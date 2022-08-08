import passport from 'passport'
import nextConnect from 'next-connect'

import { getOIDCStrategy, generateMSSession, authenticationCookieHandler } from '../../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

passport.use(
    getOIDCStrategy()
);

export default nextConnect()
  .use(authenticationCookieHandler)
  .use(passport.initialize())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        passport.authenticate('azuread-openidconnect', { session: false }, async (err: any, user: any, info: any) => {
            if(err) { console.error(err); return res.redirect('/') }
            if(!user) { return res.redirect('/'); }
        
            await generateMSSession(user, req, res)
        
            res.redirect("/hallinta")
        })(req, res)
    } catch (error: any) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })