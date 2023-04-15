const {v4 : uuidv4} = require('uuid')
const { verifyMessage } = require("ethers");
const jwt = require("jsonwebtoken");

const createToken = (me)=>jwt.sign({me}, process.env.SECRET_KEY, { expiresIn: 24 * 60 * 60 });//expires in 24 hours


const signed_prefix = (msg)=>{
    let m = "\x19Ethereum Signed Message:\n";
    m += length(msg);
    m += msg;
    return m;
}

const isValid = (msg, sig, uid)=>{
    try{
        const result = verifyMessage(signed_prefix(msg), sig) === uid;
        return result;
    }catch(err){}
    return false;
}



const getData = ()=>{
    const _rand = uuidv4();
    return _rand;
}


module.exports = {getData, isValid, createToken};