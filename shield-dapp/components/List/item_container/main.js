
import Grid from "@mui/material/Unstable_Grid2";


import Item from "../../Item/Neutral";

import {  useContractReads } from 'wagmi';

import nftAbi from '../../../contract/NFT.sol/NFT.json';
import _contract from '../../../contract/address.js';

import { useIpfsData } from '../../../context/hook/ipfs';

export default ({tokenId, ...readProps})=>{

    const {data, isLoading} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"tokenURI",
                args:[tokenId]
            },
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"itemCreator",
                args:[tokenId]
            },
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"ownerOf",
                args:[tokenId]
            }
        ],
        enabled:readProps.isSuccess
    });

   
    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    
    const loading =  readProps.isLoading || isLoading || ipfs.isLoading
    
    return (
        <Grid key={tokenId} xs={12} sm={6} md={4} lg={3} justifyContent="space-evenly">
            <Item tokenId={tokenId} loading={loading}
                owner={data?.[2]}
                creator={data?.[1]}
                {...idata}
            />
        </Grid>
    )
}