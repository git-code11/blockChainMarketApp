import { SiweMessage } from 'siwe'

const getMessage = (address, nonce, chainId)=>
    new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum Wallet to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
    });

const validateMessage = (message, signature)=>{
    const siweMessage = new SiweMessage(message)
    return siweMessage.validate(signature)
}

export {getMessage, validateMessage};