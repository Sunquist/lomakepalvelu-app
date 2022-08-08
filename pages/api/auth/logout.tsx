import { NextApiRequest, NextApiResponse } from "next"
import { addCookie } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        addCookie(res, 'identity', "destroy", { path: '/', maxAge: 1, overwrite: true })

        res.redirect("/hallinta")
    }catch(ex: any){
        res.status(ex.status || 500).send(ex.message || "Unknown error")
    }
}