import {useCallback, useEffect} from "react";
import { useSWRConfig } from 'swr';
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
        user = await fetchSigner({chainId:bscTestnet.id});
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
    const {data:_data, mutate:_mutate} = useSWRImmutable(TOKEN_SWR_KEY);
    const {data, error, isMutating:isLoading, trigger, reset} = useSWRMutation(TOKEN_SWR_KEY, tokenFetcher);

    //const { mutate:_mutate } = useSWRConfig();

    const refresh = useCallback(()=>{
        if(error)
            reset();
        if(!isLoading)
            trigger();
    },[reset, trigger, error, isLoading]);

    const mutate = useCallback((val)=>{
        /*_mutate( val, 
                { revalidate: false } 
          );*/
    },[_mutate]);

    const clear = useCallback(()=>{
        if(data){
            //mutate(null);
            reset();
        }
    },[mutate]);

    useEffect(()=>{
        const token = getCacheToken();     
        if(!data && token){
            mutate(token)
        }
    },[]);

    console.log("--always loading");

    return {data, error, isLoading, refresh, clear};
}


const useClearToken = ()=>{
    const { mutate } = useSWRConfig()
    
    const action = useCallback(()=>{
        mutate(
            '/myToken',
            null, 
            { revalidate: false } 
          );
    },[mutate])

    return action;
}

const cache_token_key = "app_key_token";

const getCacheToken = ()=>localStorage.getItem(cache_token_key);
const setCacheToken = (data)=>localStorage.setItem(cache_token_key, data);

export default useUserToken;
export {useClearToken};
