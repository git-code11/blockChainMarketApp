import {useRouter} from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import LazyScroll from './LazyScroll';

import Item from "./Item/Price";

import { useContractRead, useContractReads } from 'wagmi';

import useCurrency from '../context/hook/useCurrency';

import saleAbi from '../contract/Sale.sol/MarketSales.json';
import nftAbi from '../contract/NFT.sol/NFT.json';
import _contract from '../contract/address.json';

import { useIpfsData } from '../context/hook/ipfs';


const ListPriceSection = ()=>{

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


const ItemContainer  = ({index})=>{

    const {data:tokenId, ...readProps} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
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
                abi:saleAbi.abi,
                address:_contract.sale,
                functionName:"ItemForSale",
                args:[tokenId]
            }
        ],
        enabled:readProps.isSuccess
    });

    const {data:currency, ...tokenOpt} = useCurrency(data?.[2].currency);
   
    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    
    const loading = readProps.isLoading  || isLoading || ipfs.isLoading || tokenOpt.isLoading;
    
    return (
        <Grid key={index} xs={12} sm={6} md={4} lg={3} justifyContent="space-evenly">
            <Item tokenId={tokenId} loading={loading}
                sale={data?.[2]} currency={currency}
                creator={data?.[1]}
                {...idata}
            />
        </Grid>
    )
}


export default ListPriceSection;