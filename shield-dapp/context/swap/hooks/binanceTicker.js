import { ChainId } from "@pancakeswap/sdk";
import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';


const fetcher = async key=>{
    
    if(key){
        const data = await axios.get(key).then(response=>response.data);
       return data;
    }
    return null
}

export const TICKER_ID =  {
    [ChainId.BSC]:"BNB",
    [ChainId.ETHEREUM]:"ETH",
    [ChainId.BSC_TESTNET]:"BNB",
    [ChainId.GOERLI]:"ETH",
}

//https://api.binance.com/api/v3/ticker/price?symbols=["USDCUSDT","BNBUSDT"]
export const useApiSymbolsPrice = (pairs)=>{
    const _pairs = useMemo(()=>pairs && pairs.map(d=>d.toUpperCase()),[pairs]);
    const API_URL =  `https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(_pairs)}`
    const methods = useSWR(pairs?.length > 0 ?API_URL:null, fetcher);
    return {...methods, loading:methods.isLoading};
}


//https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT
export const useApiSymbolPrice = (pair)=>{
    const API_URL =  `https://api.binance.com/api/v3/ticker/price?symbol=${pair && pair?.toUpperCase()}`
    const methods = useSWR(pair?API_URL:null, fetcher);
    return {...methods, loading:methods.isLoading};
}

export const useTickerPrice = ({symbol, base="USDT", enabled=true})=>{
    const notBase = symbol?.toUpperCase() !== base?.toUpperCase() && enabled;
    const isUsdt = symbol?.toUpperCase() === "USDT";
    const {data, ...method} =  useApiSymbolPrice( notBase && symbol && (symbol+base));
    //console.log({isUsdt, symbol})
    return {...method, 
            data:isUsdt?{price:1}:data}
}

export const useSwapTickerPrice = ({currency, enabled})=>{
    const symbol = Boolean(currency?.isNative)?(TICKER_ID[currency?.chainId]):currency?.symbol
    const {data} = useTickerPrice({
        symbol,
        enabled
    });

    return data && Number(data?.price)
}
