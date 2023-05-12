import { createNonce } from "../lib/nonce";

export default async (req, res)=>{;
    if(req.method === "GET")
        return res.status(404).send("ONLY POST");
    const result = createNonce(req.body.uid);
    return res.json(result);
}