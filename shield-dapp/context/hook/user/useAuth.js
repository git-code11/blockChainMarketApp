import {useCallback, useEffect} from "react";
import { getAccount, getNetwork } from "wagmi/actions";
import { useAccount, useDisconnect, useConnect, useSignMessage  } from "wagmi";
import { getMessage } from "../../../services/lib/siwes";
import { useSession, signIn as __signIn, signOut, getCsrfToken } from "next-auth/react";
import usePromise from "../usePromise";
import axios from 'axios';


const _signIn = async (...args)=>{
    const result = await __signIn(...args);
    if(result.error)
        throw Error(result.error)
    return result;
}

const CLEAR_ERROR_TIMEOUT = 60000 //60 sec


const _getNonce = (uid)=>axios.post('/api/nonce',{uid}).then(response=>response.data);

export default ()=>{
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";
    

    const {call:signIn, ...signInProps} = usePromise(_signIn);
    const {call:getNonce, ...getNonceProps} = usePromise(_getNonce);

    
    const __wagmi_signMessage = useSignMessage();

    const verify = useCallback(async ()=>{
        const {address} = getAccount();
        const {chain} = getNetwork();
        const {nonce, sig} = (await getNonce(address))||{};
        
        if(!nonce)
            return;
        const _message = getMessage(address, nonce, chain.id);
        const signature = await __wagmi_signMessage.signMessageAsync({message:_message.prepareMessage()});
        const result = await signIn('credentials', {message:JSON.stringify(_message), signature, sig, redirect: false});
        
    },[session]);

    const __wagmi_connect = useConnect();
    const __wagmi_disconnect = useDisconnect();
    const __wagmi_account = useAccount();

    const connect = useCallback((props)=>{
        if(!__wagmi_account.isConnected)
            __wagmi_connect.connect({
                connector:__wagmi_connect.connectors[0],
                ...props
        });
    },[__wagmi_account.isConnected, __wagmi_connect]);

    const reset = useCallback(()=>{
        if(isAuthenticated)
            signOut();
    },[isAuthenticated]);

    const disconnect = useCallback(()=>{
        if(__wagmi_account.isConnected){
            __wagmi_disconnect.disconnect();
        }
        reset();
    },[__wagmi_account.isConnected, __wagmi_disconnect.disconnect, reset]);

    
    const loading =  __wagmi_signMessage.isLoading || session.status === "loading" || 
                        __wagmi_account.isConnecting || getNonceProps.loading || signInProps.loading;
    const error =    __wagmi_signMessage.error || getNonceProps.error || signInProps.error;
    const connected = __wagmi_account.isConnected && isAuthenticated;
    const showVerify =  __wagmi_account.isConnected && !isAuthenticated;

    useEffect(()=>{
        const resetErrors = ()=>{
            if(__wagmi_signMessage.error){
                __wagmi_signMessage.reset();
            }else if(getNonceProps.error){
                getNonceProps.reset();
            }
            else if(signInProps.error){
                signInProps.reset();
            }
        }

        let _id;
        if(__wagmi_signMessage.error || signInProps.error)
            _id = setTimeout(resetErrors, CLEAR_ERROR_TIMEOUT);
        return ()=>clearTimeout(_id);
    },[__wagmi_signMessage.error, getNonceProps.error, signInProps.error]);

    return { disconnect, connect, verify, reset, connected, showVerify, loading, error, session, isAuthenticated, address:__wagmi_account.address}
}
