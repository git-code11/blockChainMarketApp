import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import LazyScroll from '../../LazyScroll';

import { useContractRead } from 'wagmi';

import saleAbi from '../../../contract/Sale.sol/MarketSales.json';

import _contract from '../../../contract/address.js';

import ItemView from '../item_container/price';

const ItemContainer = ({index})=>{
    const {data:tokenId, isLoading, isSuccess} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"queryAllByIndex",
        args:[index]
    });


    return <ItemView {...{tokenId, isLoading, isSuccess}}/>
}



export default ()=>{

    const {isReady} = useRouter();

    const {data, isLoading} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"allSize",
        enabled:isReady
    });
    

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Available for Sale</Typography>

            {(!isReady || isLoading) &&
                <Stack py={10} alignItems="center">
                    <CircularProgress/>
                </Stack>
            }
            

            <LazyScroll end={data}
                Parent={({children})=><Grid container spacing={2} rowSpacing={3}>{children}</Grid>}
                >
                {({index})=>
                   <ItemContainer index={index}/>
                }
            </LazyScroll>
        </Box>
    );
}
