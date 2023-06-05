import { ChainId, Native, WNATIVE } from "@pancakeswap/sdk";
import { ethereumTokens, 
            bscTokens, 
            bscTestnetTokens, 
            goerliTestnetTokens
    } from "@pancakeswap/tokens";

import {useMemo} from 'react';
import useSWR from 'swr';
import { icon_grabber } from "../../lib/icon_grabber";
import axios from 'axios';
import useSwapChain from "./useSwapChain";



const _CHAIN_TOKEN_LIST = {
    [ChainId.ETHEREUM]:ethereumTokens,
    [ChainId.BSC]:bscTokens,
    [ChainId.BSC_TESTNET]:bscTestnetTokens,
    [ChainId.GOERLI]:goerliTestnetTokens
}

const _TOKEN_LIST = Object.entries(_CHAIN_TOKEN_LIST).reduce(
    (_map, _data)=>{
        const [chainId, tokens] = _data;
        _map[chainId] = Object.values(tokens.reduce).reduce((_tokenMap, token)=>{
            _tokenMap[token.address] = token;
            return _tokenMap;
        },{});
        return _map;
    },
    {}
);

const _TOKEN_ADDR_LIST = Object.entries(_TOKEN_LIST).reduce(
    (_map, _data)=>{
        const [chainId, tokens] = _data;
        _map[chainId] = Object.keys(tokens);
        return _map;
    },
    {}
);

export const useSwapCurrencyAddrList = (_chainId)=>{
    const {chainId} = useSwapChain();

    return _TOKEN_ADDR_LIST[_chainId??chainId];
}

export const useSwapCurrencyList = (_chainId)=>{
    const {chainId} = useSwapChain();
    
    return _TOKEN_LIST[_chainId??chainId];
}

export const useSwapCurrency = (address, _chainId)=>{

    const {chainId} = useSwapChain();

    const token = useMemo(()=>{
        const token = TOKEN_LIST[_chainId??chainId][address];
        
        if(Object.values(WNATIVE).some(token=>token.address === address)){
            return Native.onChain(token.chainId);
        }

        return token;
    },
    [address, _chainId, chainId]);
    
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