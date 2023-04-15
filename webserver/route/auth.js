const {Router} = require("express");
const router = Router();
const {v4 : uuidv4} = require('uuid')
const { verifyMessage } = require("ethers");
const jwt = require("jsonwebtoken");



router.get('/create/:uid',async (req, res)=>{
    const {uid} = req.params;
    req.session.uid = uid;
    req.session.msg = uuidv4();
    
    return res.json({msg:req.session.msg});
});


router.post('/verify',async (req, res, next)=>{
    const {msg, uid} = req.session;
    const {sig} = req.body;

    try{    
        if(verifyMessage(msg, sig) === uid){
            const token = jwt.sign({me:uid}, process.env.SECRET_KEY, { expiresIn: 24 * 60 * 60 });//expires in 24 hours
            return res.json({token, uid});
        }
    }
    catch(e){}
    
    next(Error("Verification failed"));
});



module.exports = router;