import {useRouter} from 'next/router';
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContractRead, useContractReads } from "wagmi";

import LazyScroll from "../../LazyScroll";
import ItemAuctionBid from '../item/Auction';
import nftAbi from "../../../contract/NFT.sol/NFT.json";
import auctionAbi from "../../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../../contract/address.js";
import { useIpfsData } from "../../../context/hook/ipfs";
import e_msg from '../../../context/lib/e_msg';

export default ()=>{
    const {isReady} = useRouter();
    
    const {data, isLoading, isError, error, refetch, isRefetching} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"ownedSize",
        enabled:isReady
    });

    if(isLoading){
        return <Stack py={5} alignItems="center">
            <CircularProgress/>
        </Stack>
    }
    
    if(data?.eq(0) || isError){
        return (
        <Stack pb={1} alignItems="center" spacing={1}>
            <Typography>No entries{`:${e_msg(error)}`}</Typography>
            {isError && <Button variant="outlined" disabled={isLoading || isRefetching} onClick={()=>refetch()}>Reload</Button>}
        </Stack>
        )
    }
    
    return (
            <LazyScroll end={data}
                Parent={({children})=><Grid container spacing={2}>{children}</Grid>}
                >
                {({index})=>
                    <Grid xs={12} sm={6} md={4} lg={3}>
                        <ItemContainer index={index}/>
                    </Grid>
                }
            </LazyScroll>
    );
}


const ItemContainer = ({index})=>{
    console.log({index});
    const {data, isLoading, isSuccess} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"queryOwnedByIndex",
        args:[index]
    });

    const {data:idata, ...info} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"tokenURI",
                args:[data]
            },
            {
                abi:auctionAbi.abi,
                address:_contract.auction,
                functionName:"auctions",
                args:[data]
            }
        ],
        enabled:isSuccess
    });

    const {data:fdata, ...ipfs} = useIpfsData(idata?.[0]);

    return <ItemAuctionBid tokenId={data} loading={isLoading || info.isLoading || ipfs.isLoading} auction={idata?.[1]} {...fdata}/>
}