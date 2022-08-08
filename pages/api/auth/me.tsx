import { NextApiRequest, NextApiResponse } from "next"
import { authenticate } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const user = authenticate(req)

        res.status(200).send(user)
    }catch(ex: any){
        res.status(ex.status || 500).send(ex.message || "Unknown error")
    }
}