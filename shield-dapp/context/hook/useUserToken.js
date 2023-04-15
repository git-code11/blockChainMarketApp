import {useCallback} from "react";
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import {client} from '../provider/http';
import { bscTestnet } from "wagmi/chains";
import {fetchSigner, getAccount} from "wagmi/actions";

const tokenFetcher = async(key)=>{

    const account = getAccount();
    if(!account.isConnected)
        throw Error("Not Connected");

    let user;
    let address;

    try{
        user = await fetchSigner();
        address = account.address//await user.getAddress();
    }catch(e){
        throw Error(`Can't get signer:${e.message}`);
    }

    if(!(address && user))
        throw Error('need address and user');

    let response = await client.get(`/auth/create/${address}`);

    //sign the message
    let signature;

    try{
        signature = await user.signMessage(response.data.msg);
    }catch(e){
        throw Error('signing failed')
    }

    //get verified by server
    response = await client.post(`/auth/verify`,{sig:signature});
    setCacheToken(response.data.token);
   
    return response.data.token;
}

const TOKEN_SWR_KEY = "/myToken";

const useUserToken = ()=>{
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


const cache_token_key = "app_key_token";

const getCacheToken = ()=>localStorage.getItem(cache_token_key);
const setCacheToken = (data)=>localStorage.setItem(cache_token_key, data);

export default useUserToken;
