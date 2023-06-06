import { ChainId } from "@pancakeswap/sdk";
import useSWR from 'swr';
import axios from 'axios';



const fetcher = async key=>{
    if(key)
        return await axios.get(key).then(response=>response.data);
    return null
}

const GEKO_ID = {
    [ChainId.BSC]:"binancecoin",
    [ChainId.ETHEREUM]:"ethereum"
}

const GEKO_VS = {
    USD:"usd",
    EUR:"eur",
    JPY:"jpy"
}

export const useSwapNativePrice = ({ids, vs})=>{
     vs = vs ?? GEKO_VS.values();
     ids= ids ?? GEKO_ID.values();
    const API_URL =  `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${vs.join(',')}`
    const methods = useSWR(API_URL, fetcher);
    return methods;
}

export const useSwapTokenPrice = ({tokens, id, vs})=>{
    vs = vs ?? GEKO_VS.values();
    id= id ?? GEKO_ID[ChainId.BSC];
   const API_URL =  tokens?.length > 0?
        `https://api.coingecko.com/api/v3/simple/token_price/${id}?contract_addresses=${contracts.join(',')}&vs_currencies=${vs.join(',')}`:
        null;
   const methods = useSWR(API_URL, fetcher);
   return methods;
}