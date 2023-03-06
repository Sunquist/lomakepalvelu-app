import { serialize } from 'cookie';
import { OIDCStrategy } from 'passport-azure-ad'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { getDatabase } from './mongo';
import { SessionDocument } from '../models/session';
import UserModel, { User } from '../models/user';
import { UserProvider } from '../types/authentication';
import VerifyModel from '../utils/VerifyModel';

/**
 * 
 * @param {*} req 
 * @returns User object
 */
export function authenticate(req: any) {
    const cookies = resolveCookies(req.headers.cookie)

    if(!cookies || !cookies.identity)
        throw({
            status: 401,
            message: "Unauthenticated"
        })
    
    return jwt.verify(cookies.identity, `${process.env.JWT_SECRETKEY}`)
}

/**
 * @returns passport-azure-ad OIDCStrategy
 */
export function getOIDCStrategy () {
    //@ts-ignore types missmatch
    return new OIDCStrategy({
        identityMetadata: `https://login.microsoftonline.com/${process.env.AZUREOPENID_TENANTID}/v2.0/.well-known/openid-configuration`,
        clientID: process.env.AZUREOPENID_CLIENTID,
        clientSecret: process.env.AZUREOPENID_CLIENTSECRET,
        issuer: `https://sts.windows.net/${process.env.AZUREOPENID_TENANTID}/`,
        audience: "",
        loggingLevel: (process.env.NODE_ENV === "production")? "warn" : "info",
        passReqToCallback: true,
        validateIssuer: true,
        redirectUrl: process.env.AZUREOPENID_REDIRECTURL,
        allowHttpForRedirectUrl: (process.env.NODE_ENV === "production")? false : true,
        responseType: "code id_token",
        cookieEncryptionKeys: [
            { key: process.env.AZUREOPENID_COOKIEKEY, iv: process.env.AZUREOPENID_COOKIEIV }
        ],
        useCookieInsteadOfSession: true,
        responseMode: "form_post",
        scope: ["profile", "offline_access", "https://graph.microsoft.com/mail.read"]
    }, async (req: NextApiRequest, iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, done: any) => {
        if (!profile.oid) 
            return done(new Error("No oid found"), null);
        return done(null, profile);
    })
}

/**
 * Creates a cookie middleware like express
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function authenticationCookieHandler (req: NextApiRequest,res: NextApiResponse,next: any) {
    //@ts-ignore middleware
    res.cookie = (...cookieOptions: any) => {
        const [ token, value, options ] = cookieOptions;
        addCookie(res, token, value, options)
    }
    //@ts-ignore middleware
    res.clearCookie = (...cookieOptions: any) => {
        const [ token ] = cookieOptions;
        addCookie(res, token, "destroy", { expire: 0, overwrite: true })
    }
    //@ts-ignore middleware
    req.res = res;
    next()
}

/**
 * Adds cookie to response header
 * @param {*} res 
 * @param {string} token 
 * @param {string} value 
 * @param {*} options 
 * @returns true
 */
export function addCookie (...ops: any) {
    const [ res, token, value, options ] = ops;
    let currentCookies = res.getHeader('Set-Cookie');

    if(currentCookies){
        return res.setHeader('Set-Cookie', [serialize(token, value, options), ...((currentCookies.filter)? currentCookies : [currentCookies]).filter((c: any) => {
            const cToken = c.split("=")[0];
            return cToken !== token
        })]);
    }

    return res.setHeader('Set-Cookie', serialize(token, value, options));
}

/**
 * 
 * @param {string} cookieHeader 
 * @returns Cookies in JObject
 */
export function resolveCookies(cookieHeader: any) {
    if(!cookieHeader)
        return {}

    return cookieHeader.split("; ").reduce((pv: any, cv: any) => {
        const [ key, value ] = cv.split("=")
        return {
            ...pv,
            [key]: value
        }
    }, {})
}

/**
 * Creates a new user
 * @param {UserProvider} user 
 * @returns {User} user
 */
export async function createUserFromLogin(user: UserProvider){
    const userDoc = VerifyModel({
        Username: user.Username,
        Name: user.Name || null,
        Admin: false,
        Providers: {
            [user.Provider]: {
                userid: user.UserId
            }
        },
        Preferences: {
            theme: "dark"
        }
    }, UserModel);

    const insertDoc = {
        ...userDoc,
        _id: uuidv4(),
        _ts: Date.now(),
    }

    const database = await getDatabase("master", "master")
    const insertUser = database.collection('users').insertOne(insertDoc)

    return insertDoc
}

/**
 * Finds or creates a new user
 * @param {UserProvider} user 
 * @returns {User} user
 */
export async function findOrCreateUser(user: UserProvider){
    const database = await getDatabase("master", "master")
    let userDoc = await database.collection('users').findOne({
        Username: user.Username
    })

    if(!userDoc)
        userDoc = await createUserFromLogin(user)

    return userDoc;
}

/**
 * Adds identity cookie to response header with given profile
 * @param {UserProvider} ProvidedUserProfile
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export async function generateSession(providedUser: UserProvider, req: NextApiRequest, res: NextApiResponse) {
    const user = await findOrCreateUser(providedUser)

    const sessionDoc = {
        id: uuidv4(),
        ts: Date.now(),
        ...user
    }

    const token = jwt.sign(sessionDoc, `${process.env.JWT_SECRETKEY}`, {
        expiresIn: process.env.JWT_EXPIRES,
        issuer: process.env.JWT_ISSURE,
    });

    jwt.verify(token, `${process.env.JWT_SECRETKEY}`)

    addCookie(res, 'identity', token, { path: '/' });
}

/**
 * Adds identity cookie to response header with given profile
 * @param {*} profile Azure OpenID profile
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export async function generateMSSession(profile: any, req: NextApiRequest, res: NextApiResponse) {
    await generateSession({
        Username: profile._json.preferred_username,
        Name: profile._json.name,
        Provider: "microsoft",
        UserId: profile._json.sub
    }, req, res);
}