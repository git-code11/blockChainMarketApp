import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import LazyScroll from './LazyScroll';

import Item from "./Item/Neutral";

import { useContractRead, useContractReads } from 'wagmi';

import nftAbi from '../contract/NFT.sol/NFT.json';
import _contract from '../contract/address.json';

import { useIpfsData } from '../context/lib/ipfs';


const ListAllSection = ()=>{

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
                Parent={({children})=><Grid container spacing={2} rowSpacing={3} children={children}/>}
                >
                {({index})=>
                   <ItemContainer tokenId={index+1}/>
                }
            </LazyScroll>
        </Box>
    );
}


const ItemContainer  = ({tokenId})=>{

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
        ]
    });

   
    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    
    const loading = isLoading || ipfs.isLoading
    
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


export default ListAllSection;