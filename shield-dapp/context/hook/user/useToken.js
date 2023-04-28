import {useCallback} from "react";
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import {client} from '../../lib/http';
import {getAccount, signMessage, getNetwork} from "wagmi/actions";
import {getCacheToken, setCacheToken} from '../../lib/token';
import { getMessage } from "../../../services/lib/siwes";

const tokenFetcher = async(key)=>{

    const {address, isDisconnected} = getAccount();
    const {chain} = getNetwork();

    if(isDisconnected)
        throw Error("Not Connected");

    if(!address)
        throw Error('need address and user');

    let response = await client.get(`/auth?uid=${address}`);

    const message = getMessage(address, response.data.nonce, chain.id);

    //sign the message
    let signature;

    try{
        signature = await signMessage({message:message.prepareMessage()});
    }catch(e){
        throw Error('signing failed')
    }

    //get verified by server
    response = await client.post(`/auth`,{message, signature});
    setCacheToken(response.data.token);
   
    return response.data.token;
}

const TOKEN_SWR_KEY = "/myToken";

export default ()=>{
    const {data, mutate:_mutate} = useSWRImmutable(TOKEN_SWR_KEY, getCacheToken);
    const {error, isMutating:isLoading, trigger, reset} = useSWRMutation(TOKEN_SWR_KEY, tokenFetcher);
    
    const refresh = useCallback(()=>{
        if(error)
            reset();
        if(!isLoading)
            trigger();
    },[reset, trigger, error, isLoading]);

    const mutate = useCallback((val)=>{
        _mutate( val, 
                { revalidate: false } 
          );
    },[_mutate]);

    const clear = useCallback(()=>{
        if(data){
            mutate(null);
            reset();
            setCacheToken('');
        }
    },[mutate, data]);
    

    return {data, error, isLoading, refresh, clear};
}
