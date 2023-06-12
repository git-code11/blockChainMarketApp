import { ChainId } from "@pancakeswap/sdk";
import useSWR from 'swr';
import axios from 'axios';


export const GEKO_ID = {
    [ChainId.BSC]:"binancecoin",
    [ChainId.ETHEREUM]:"ethereum",
}

export const GEKO_ACTIVE_ID = Object.keys(GEKO_ID).map(Number);

const INVERT_GEKO_ID = GEKO_ACTIVE_ID.reduce((acc, id)=>(
    {...acc, [GEKO_ID[id]]:id}
    ),{});

const fetcher = async key=>{
    
    if(key){
        const data = await axios.get(key).then(response=>response.data);
        
        const parsed = Object.keys(data).reduce((acc, name)=>{
            acc[INVERT_GEKO_ID[name]??name] = data[name]
            return acc
        }
        ,{})
        return {data, parsed};
    }
    return null
}



export const GEKO_VS = {
    USD:"usd",
    EUR:"eur",
    JPY:"jpy"
}

export const useSwapNativePrice = ({ids, vs, enabled})=>{
     vs = vs ?? GEKO_VS.values();
     ids= ids?.map(id=>GEKO_ID[id]) ?? GEKO_ID.values();
    const API_URL =  `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${vs.join(',')}`
    const methods = useSWR(enabled?API_URL:null, fetcher);
    return {...methods, loading:methods.isLoading};
}

export const useSwapTokenPrice = ({tokens, id, vs, enabled})=>{
    vs = vs ?? GEKO_VS.values();
    id= GEKO_ID[id] ?? GEKO_ID[ChainId.BSC];
    const API_URL =  tokens?.length > 0?
        `https://api.coingecko.com/api/v3/simple/token_price/${id}?contract_addresses=${tokens.join(',')}&vs_currencies=${vs.join(',')}`:
        null;
    const methods = useSWR(enabled?API_URL:null, fetcher);
    return {...methods, loading:methods.isLoading};
}