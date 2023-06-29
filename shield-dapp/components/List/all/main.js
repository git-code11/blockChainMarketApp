import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import LazyScroll from '../../LazyScroll';

import { useContractRead } from 'wagmi';

import nftAbi from '../../../contract/NFT.sol/NFT.json';
import _contract from '../../../contract/address.js';

import ItemView from '../item_container/main';

const ItemContainer = ({index})=>{
    
    return <ItemView {...{tokenId:index+1, isLoading:false, isSuccess:true}}/>
}

export default ()=>{

    const {isReady} = useRouter();

    const {data, isLoading} = useContractRead({
        abi:nftAbi.abi,
        address:_contract.nft,
        functionName:"totalSupply",
        enabled:isReady
    });


    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">All Available Items</Typography>

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