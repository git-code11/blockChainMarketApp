import {generateNonce} from 'siwe';
import { toUtf8Bytes, sha256 } from 'ethers/lib/utils.js';

const SEP = process.env.NONCE_SECRET_SEP || "__&!__";

const _helper = (n, d, sep)=>sha256(toUtf8Bytes(`${n}${sep||SEP}${d}`)).slice(2,7);

export const createNonce = (data, sep)=>{
    const nonce = generateNonce();
    const sig = _helper(nonce, data, sep);
    return {nonce, sig};
}

export const verifyNonce = (nonce, data, sig, sep)=>{
    return sig === _helper(nonce, data, sep);
}