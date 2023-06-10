import { NFTStorage } from 'nft.storage';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE });


const _store = async (key, {arg})=>{
    const {name, description, file, properties} = arg;
    const metadata = await client.store({name, description, image:file[0], properties:properties || {} });
    return metadata;
}

const store = data=>_store('', data);

const useIpfsStore = ()=>{
    const {isMutating:loading, ...methods} =  useSWRMutation("/ipfs-store-save", _store);

    return {loading, ...methods};
}

const fetcher = async ([uri, cid])=>{
    if(!cid)
        return null;
    const response = await axios.get(uri);
    const {image, ...rest} = response.data
    return {...rest, image:ipfsHttpUrl(image)};
}

const useIpfsData = (cid, gateway)=>{
    const {isLoading:loading, isValidating: validating, ...methods} = useSWRImmutable([`https://${gateway||'nftstorage.link'}/ipfs/${cid}/metadata.json`, cid], fetcher);
    return {isLoading:loading, loading, validating, ...methods};
}

const ipfsHttpUrl = (ipfs_url, gateway)=>`https://${gateway||'nftstorage.link'}/ipfs/${ipfs_url.replace('ipfs://','')}`;


export {store, useIpfsData, useIpfsStore, ipfsHttpUrl};





