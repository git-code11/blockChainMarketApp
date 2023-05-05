
import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useContractRead, useContractReads } from 'wagmi';
import useCurrency from '../context/hook/useCurrency';
import { useIpfsData } from '../context/lib/ipfs';

import LazyScroll from './LazyScroll';
import Item from "./Item/Auction";

import auctionAbi from '../contract/Auction.sol/MarketAuction.json';
import nftAbi from '../contract/NFT.sol/NFT.json';
import _contract from '../contract/address.json';



const ListAuctionSection = ({min})=>{

    const {isReady} = useRouter();
    
    const {data, isLoading} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"allSize",
        enabled:isReady
    });

        
    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Available Auction</Typography>

            {(!isReady || isLoading) &&
                <Stack py={10} alignItems="center">
                    <CircularProgress/>
                </Stack>
            }
            

            {
            <LazyScroll end={data}
                Parent={({children})=><Grid container spacing={2} children={children}/>}
                >
                {({index})=>
                   <ItemContainer index={index}/>
                }
            </LazyScroll>}

        </Box>
    );
}


const ItemContainer  = ({index})=>{

    const {data:tokenId, ...readProps} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"queryAllByIndex",
        args:[index]
    });

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
        <Grid key={index} xs={12} sm={6} md={4} lg={3} justifyContent="space-evenly">
            <Item tokenId={tokenId} loading={loading}
                auction={data?.[2]} currency={token}
                creator={data?.[1]}
                {...idata}
            />
        </Grid>
    )
}

export default ListAuctionSection;