import { NFTStorage } from 'nft.storage';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE });


const _store = async (key, {arg})=>{
    const {name, description, file, properties} = arg;
    const metadata = await client.store({name, description, image:file?.[0], properties:properties || {} });
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


const _BlobStore = async (key, {arg})=>{
    const blob = new Blob([JSON.stringify(arg)]);
    const cid = await client.storeBlob(blob);
    return cid;
}

const useIpfsBlobStore = ()=>{
    const {isMutating:loading, ...methods} =  useSWRMutation("/ipfs-blob-save", _BlobStore);
    return {loading, ...methods};
}

const _BlobFetcher = async([uri, cid])=>{
    if(!cid)
        return null;
    const response = await axios.get(uri);
    const data = response.data
    return data;
}

const useIpfsBlobData = (cid, gateway)=>{
    const {isLoading:loading, isValidating: validating, ...methods} = useSWRImmutable([`https://${gateway||'nftstorage.link'}/ipfs/${cid}`, cid], _BlobFetcher);
    return {isLoading:loading, loading, validating, ...methods};
}



export {store, useIpfsData, useIpfsStore, ipfsHttpUrl, useIpfsBlobStore, useIpfsBlobData};





