import nextConnect from 'next-connect';
import {generateNonce} from 'siwe';
import { validateMessage } from '../lib/siwes';
import { withSessionApi } from '../lib/session';
import jwt from "jsonwebtoken";

const nonceRoute = async (req, res)=>{
    //const {uid} = req.query;
    const nonce = generateNonce();
    req.session.nonce = nonce;
    //req.session.uid = uid;
    await req.session.save();
    return res.json({nonce});
}


const verifyRoute = async (req, res, next)=>{

    try {
        const { message, signature } = req.body;
        const fields = await validateMessage(message, signature);
        if (fields.nonce !== req.session.nonce)
            throw Error('Invalid nonce.');
            //return res.status(422).json({ message: 'Invalid nonce.' })

        //if(fields.address !== req.session.uid)
        //    throw Error('Invalid address.')
        await req.session.destroy()
        const token = jwt.sign({me:fields.address}, process.env.JWT_SECRET_KEY, { expiresIn: /* fields.expirationTime */24 * 60 * 60 });
        return res.json({token, uid:fields.address});
      } catch (err) {
        return res.status(400).json({ error: true, message: err?.message});
        //next(err)
      }
}

const handler = nextConnect().get(nonceRoute).post(verifyRoute);

export default withSessionApi(handler);