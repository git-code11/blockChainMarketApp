
import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useContractRead } from 'wagmi';

import LazyScroll from '../../LazyScroll';

import auctionAbi from '../../../contract/Auction.sol/MarketAuction.json';

import _contract from '../../../contract/address.js';

import ItemView from '../item_container/auction';

const ItemContainer = ({index})=>{
    const {data:tokenId, isLoading, isSuccess} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"queryAllByIndex",
        args:[index]
    });

    return <ItemView {...{tokenId, isLoading, isSuccess}}/>
}

export default ()=>{

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
                Parent={({children})=><Grid container spacing={2}>{children}</Grid>}
                >
                {({index})=>
                   <ItemContainer index={index}/>
                }
            </LazyScroll>}

        </Box>
    );
}