import passport from 'passport'
import nextConnect from 'next-connect'

import { getOIDCStrategy, authenticationCookieHandler } from '../../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

passport.use(
    getOIDCStrategy()
);

export default nextConnect()
  .use(authenticationCookieHandler)
  .use(passport.initialize())
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      passport.authenticate('azuread-openidconnect')(req, res)
    } catch (error: any) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })