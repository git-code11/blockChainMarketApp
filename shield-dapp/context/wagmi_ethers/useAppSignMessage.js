import { fetchSigner, getAccount, signMessage } from "wagmi/actions";
import usePromise from "../hook/usePromise";

const action = async message=>{
    const {address} = getAccount();
    if(!address){
        throw Error(`need address:${address}`)
    }
    
    const signer = await fetchSigner();
    if(!signer){
        throw Error(`need signer`)
    }

    const wallet_provider = signer.provider.provider;
    console.log({wallet_provider})
    let signature;
    if(wallet_provider.isWalletConnect && false){
        const connector = wallet_provider.connector;
        signature = await connector.signPersonalMessage([message, address]);
    }else{
        signature = await signMessage({message});
    }
    return signature;
}

export default ()=>{
    const {call:sign, value:data, ...props} = usePromise(action);
    return {sign, data, isLoading:props.loading, ...props}
}