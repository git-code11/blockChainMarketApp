import {useState} from 'react';
import { NFTStorage } from 'nft.storage';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import {faker} from '@faker-js/faker';

import {temp_p} from "../../temp";

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE });


const _store = async (key, {arg, ...more})=>{
    console.log(arg, more);
    //return {ipnft:`CID_${Date.now()}`};
    const {name, description, file, properties} = arg;
    const metadata = await client.store({name, description, image:file[0], properties:properties || {} });
    return metadata;
}

const store = data=>_store('', data);

const useIpfsStore = ()=>{
    const {isMutating:isLoading,...methods} =  useSWRMutation("/ipfsStoreSave", _store);

    return {isLoading, ...methods};
}

const fetcher = async ([_,cid])=>{
    if(!cid)
        return null;
    const response = await axios.get(_);
    const {image, ...rest} = response.data
    return {...rest, image:ipfsHttpUrl(image)};
    //console.log("my fetehcer called", cid);
    // if(!cid)
    //     return null;
        
    // return {name:faker.commerce.productName(), description:faker.commerce.productDescription(), image:temp_p[~~(Math.random()*100) % temp_p.length],
    //     properties:{
    //         catchPhrase:faker.company.catchPhrase(),
    //         material:faker.commerce.productMaterial(),
    //         cid
    //     }
    // }
}

const useIpfsData = (cid, gateway)=>{
    const {isMutating:isLoading, ...methods} = useSWRImmutable([`https://${gateway||'nftstorage.link'}/ipfs/${cid}/metadata.json`, cid], fetcher);
    console.log({data:methods.data});
    return {isLoading, ...methods};
}

const ipfsHttpUrl = (ipfs_url, gateway)=>`https://${gateway||'nftstorage.link'}/ipfs/${ipfs_url.replace('ipfs://','')}`;


export {store, useIpfsData, useIpfsStore, ipfsHttpUrl};





