
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {client, getClient} from '../../lib/http';
import { getAccount } from 'wagmi/actions';

const SWR_KEY_INFO = "/user/info";
const SWR_KEY_UPDATE = '/user/update';

const _getProfileFetcher = async ([_,address])=>{
    if(!address)
        return null;
    const response = await client.get(`/user/info/${address}`);
    console.log("Data is", response.data);
    return response.data;
}

const _updateProfileFetcher = async (_, {arg})=>{
    const {isDisconnected} = getAccount();
    
    if(isDisconnected)
        throw Error("Not connected");
    
    const client = getClient();
    const response = await client.post('/user/update',arg);
    return response.data;
}

const getProfile= (addr)=> _getProfileFetcher([SWR_KEY_INFO, addr]);

const useProfile =  (uid)=>{
    const methods = useSWR([SWR_KEY_INFO, uid], _getProfileFetcher);
    return methods;
}

const useProfileUpdate = ()=>{
    const {isMutating:isLoading, ...methods} = useSWRMutation(SWR_KEY_UPDATE, _updateProfileFetcher);
    return {isLoading, ...methods};
}


export {useProfileUpdate, useProfile, getProfile}