import { ChainId, Native } from "@pancakeswap/sdk";
import {bscTestnetTokens} from "@pancakeswap/tokens";

import {useMemo} from 'react';
import useSWR from 'swr';
import { icon_grabber } from "../../lib/icon_grabber";
import axios from 'axios';

const _tkList = Object.values(bscTestnetTokens);
export const TOKEN_LIST = _tkList.reduce((acc, value)=>({...acc, [value.address]:value}),{});

export const TOKEN_ADDRESS_LIST = _tkList.map(tk=>tk.address);

export const useSwapCurrencyAddrList = (chainId)=>{
    return TOKEN_ADDRESS_LIST;
}

export const useSwapCurrencyList = (chainId)=>{
    return TOKEN_LIST;
}

export const useSwapCurrency = (address)=>{
    const token = TOKEN_LIST[address];
    
    //const {data:image} = {}//useSWR(token?.projectLink, icon_grabber);
    //const result = useMemo(()=>(token?{...token, image}:null), [token, image])
    return token;
}

const fetcher = key=>axios.get(key).then(response=>response.data);

export const useSwapNativePrice = ({ids, vs})=>{
     vs = vs ?? ['usd', 'eur', 'jpy'];
     ids= ids ?? ['binancecoin','ethereum'];
    const API_URL =  `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${vs.join(',')}`
    const methods = useSWR(API_URL, fetcher);
    return methods;
}

export const useSwapCurrenctPrice = ({contracts, id, vs})=>{
    vs = vs ?? ['usd', 'eur', 'jpy'];
    id= id ?? 'binancecoin';//'ethereum'
   const API_URL =  contracts?.length > 0 &&`https://api.coingecko.com/api/v3/simple/token_price/${id}?contract_addresses=${contracts.join(',')}&vs_currencies=${vs.join(',')}`
   const methods = useSWR(API_URL, fetcher);
   return methods;
}