
import Grid from "@mui/material/Unstable_Grid2";

import Item from "../..//Item/Price";

import { useContractRead, useContractReads } from 'wagmi';

import useCurrency from '../../../context/hook/useCurrency';

import saleAbi from '../../../contract/Sale.sol/MarketSales.json';
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
                abi:saleAbi.abi,
                address:_contract.sale,
                functionName:"ItemForSale",
                args:[tokenId]
            }
        ],
        enabled:readProps.isSuccess
    });

    const {data:currency, ...tokenOpt} = useCurrency(data?.[2]?.currency);
   
    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    
    const loading = readProps.isLoading  || isLoading || ipfs.isLoading || tokenOpt.isLoading;
    
    return (
        <Grid xs={12} sm={6} md={4} lg={3} justifyContent="space-evenly">
            <Item tokenId={tokenId} loading={loading}
                sale={data?.[2]} currency={currency}
                creator={data?.[1]}
                {...idata}
            />
        </Grid>
    )
}
