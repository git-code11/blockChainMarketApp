import {useState} from 'react';
import { NFTStorage } from 'nft.storage';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import {faker} from '@faker-js/faker';

import {temp_p} from "../../temp";

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE });


const _store = async (key, {arg})=>{

    return {ipnft:`CID_${Date.now()}`};
    const {name, description, image, properties} = arg;
    const metadata = await client.store({name, description, image, properties:properties || {} });
    //const metadata =  await (new Promise((resolve)=>setTimeout(()=>resolve(name + description), 4000)));
    return metadata;
}

const store = data=>_store('', data);

const useIpfsStore = (onSuccess, onError)=>{
    const [status, setStatus] = useState({});
    const {isMutating:isLoading,...methods} =  useSWRMutation("/ipfsStoreSave", _store, 
        {
            onSuccess:()=>setStatus({isSuccess:true}), 
            onError:()=>setStatus({isError:true})
        }
    );

    return {isLoading, ...status, ...methods};
}

const fetcher = async ([_,cid])=>{
    // const response = await axios.get(cid);
    // return response.data;
    //console.log("my fetehcer called", cid);
    if(!cid)
        return null;
        
    return {name:faker.commerce.productName(), description:faker.commerce.productDescription(), image:temp_p[~~(Math.random()*100) % temp_p.length],
        properties:{
            catchPhrase:faker.company.catchPhrase(),
            material:faker.commerce.productMaterial(),
            cid
        }
    }
}

// const useIpfsData = (cid, gateway)=>{
//     const {isMutating:isLoading, ...methods} = useSWRMutation(`https://${gateway||'nftstorage.link'}/ipfs/${cid}/metadata.json`, fetcher);
//     return {isLoading, ...methods};
// }

const useIpfsData = (cid, gateway)=>{
    const methods = useSWRImmutable([`https://${gateway||'nftstorage.link'}/ipfs/${cid}/metadata.json`, cid], fetcher);
    return methods;
}

const ipfsHttpUrl = (ipfs_url, gateway)=>`https://${gateway||'nftstorage.link'}/ipfs/${ipfs_url.replace('ipfs://','')}`;


export {store, useIpfsData, useIpfsStore, ipfsHttpUrl};





