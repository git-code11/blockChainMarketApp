import {useState, useCallback} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Item from "./Item/ListPrice";

import { useContractRead } from 'wagmi';

import saleAbi from '../contract/Sale.sol/MarketSales.json';
import _contract from '../contract/address.json';

import {temp_c} from "../temp";


const ListPriceSection = ()=>{
    const [size, setSize] = useState(0);
    
    const {data, isLoading} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"getAllItems"
    });

    const _loadMore = useCallback(()=>{
        setSize(d=>Math.min(d+4, data?.length));
    },[data?.length]);

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Available for Sale</Typography>

            {isLoading &&
                <Stack py={10} alignItems="center">
                    <CircularProgress/>
                </Stack>
            }

            <InfiniteScroll
                loadMore={isLoading || _loadMore}
                hasMore={size<data?.length}
                loader={
                    <Stack key={0} py={3} alignItems="center">
                        <CircularProgress/>
                    </Stack>
                }
            >
                <Grid container spacing={2} rowSpacing={3}>
                    {Array(size).fill(0).map((d,i)=>
                        <Grid key={data[i].toString()} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                            <Item tokenId={data[i]} creatorImage={temp_c[i%5]}/>
                        </Grid>
                    )}
                </Grid>
            </InfiniteScroll>
        </Box>
    );
}


export default ListPriceSection;