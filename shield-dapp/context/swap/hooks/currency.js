import { ChainId, Native, WNATIVE } from "@pancakeswap/sdk";
import { ethereumTokens, 
            bscTokens, 
            bscTestnetTokens, 
            goerliTestnetTokens
    } from "@pancakeswap/tokens";

import {useMemo} from 'react';
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
        _map[chainId] = Object.values(tokens).reduce((_tokenMap, token)=>{
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

    const _token = useMemo(()=>{
        const token = _TOKEN_LIST[_chainId??chainId][address];
        
        const native = Object.values(WNATIVE).find(token=> token.address === address);
        if(Boolean(native)){
            return Native.onChain(native.chainId);
        }

        return token;
    },
    [address, _chainId, chainId]);
    
    return _token;
}