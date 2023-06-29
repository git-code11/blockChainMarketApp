
import Grid from "@mui/material/Unstable_Grid2";

import {  useContractReads } from 'wagmi';
import useCurrency from '../../../context/hook/useCurrency';
import { useIpfsData } from '../../../context/hook/ipfs';


import Item from "../../Item/Auction";

import auctionAbi from '../../../contract/Auction.sol/MarketAuction.json';
import nftAbi from '../../../contract/NFT.sol/NFT.json';
import _contract from '../../../contract/address.js';


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
                abi:auctionAbi.abi,
                address:_contract.auction,
                functionName:"auctions",
                args:[tokenId]
            }
        ],
        enabled:readProps.isSuccess
    });

    const {data:token, ...tokenOpt} = useCurrency();
   
    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    
    const loading = readProps.isLoading  || isLoading || ipfs.isLoading || tokenOpt.isLoading;
    

    return (
        <Grid xs={12} sm={6} md={4} lg={3} justifyContent="space-evenly">
            <Item tokenId={tokenId} loading={loading}
                auction={data?.[2]} currency={token}
                creator={data?.[1]}
                {...idata}
            />
        </Grid>
    )
}