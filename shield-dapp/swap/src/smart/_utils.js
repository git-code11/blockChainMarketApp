//import { ChainId } from '@pancakeswap/sdk'
import {PoolType, SWAP_ROUTER_ADDRESSES, SwapRouter} from '@pancakeswap/smart-router/evm';
//import { GraphQLClient } from 'graphql-request'
import { createPublicClient, http, fallback } from 'viem'
import { bsc, bscTestnet, goerli } from 'viem/chains';

import _quoteProvider from './_quoteProvider';
import _poolProvider from './_poolProvider';
import { TradeType, CurrencyAmount, Percent} from '@pancakeswap/sdk';
import { parseUnits, formatUnits } from 'ethers/lib/utils.js';

// const V3_SUBGRAPH_URLS = {
//     [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
//     [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
//     [ChainId.BSC]: `https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc`,
//     [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
// }

const CHAINS = [bsc, bscTestnet, goerli]

const MAP_ID_CHAIN = CHAINS.reduce((_map, _chain)=>({..._map,[_chain.id]:_chain}),{});

export const viemClients = ({ chainId}) => {
    return createPublicClient({
        chain: MAP_ID_CHAIN[chainId],
        transport:fallback(
            Object.values(MAP_ID_CHAIN[chainId].rpcUrls).map(({http:_url})=>
                http(_url[0], {
                    timeout: 15_000,
                })
            ),
            {
                rank:false
            }
        ),
        batch: {
          multicall: {
            batchSize: 1024 * 200,
          }
        }
    })
}

// export const v3Clients = {
//     [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
//     [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
//     [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC]),
//     [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET]),
// }

export const gasPriceWei = (chainId)=>viemClients({chainId}).getGasPrice();

export const getPoolTypes = ({V2, V3, STABLE}) => {
    const types = [];
    if (V2) {
      types.push(PoolType.V2)
    }
    if (V3) {
      types.push(PoolType.V3)
    }
    if (STABLE) {
      types.push(PoolType.STABLE)
    }
    return types
}

export const getAllPoolTypes = ()=>getPoolTypes({V2:true, V3:true, STABLE:true});

export const getSwapRouterAddr = id=>SWAP_ROUTER_ADDRESSES[id]

export const timeit = async ({func, name, args})=>{
  console.log("CALLING FUNC", name ?? func?.constructor?.name);
  const startTime = Date.now();
  try{
    await func(args);
  }catch(e){
    console.log(e);
    console.log("Error Occured")
  }
  return Date.now() - startTime;
}

export function fromReadableAmount(
  amount,
  decimals
) {
  return parseUnits(amount.toString(), decimals)
}


const READABLE_FORM_LEN = 24

export function toReadableAmount(rawAmount, decimals) {
  return formatUnits(rawAmount, decimals).slice(0, READABLE_FORM_LEN)
}


const prepareTradeQuoteParamsConfig  = {
  gasPriceWei: 10,
  poolProvider: _poolProvider.onChain,
  quoteProvider: _quoteProvider.onChain,
  allowedPoolTypes:getAllPoolTypes()
}

export const prepareTradeQuoteParams = ({amountIn, currencyIn, currencyOut, tradeType, config})=>{
  const _config = {
    ...prepareTradeQuoteParamsConfig,
    ...config
  }

  const params = [
    CurrencyAmount.fromRawAmount(currencyIn,
        fromReadableAmount( amountIn ,18)
        ),
    currencyOut,
    tradeType??TradeType.EXACT_INPUT,
    _config
  ];

  return params;

}


export const prepareTradeCallData = ({
            trade,
            chainId,
            options
    })=>{
  const _options = {}
  _options.slippageTolerance = new Percent(options.toleranceBips?? 1, 10_000); //1bips
  _options.deadlineOrPreviousBlockhash = options.deadline ?? Math.round(Date.now()/1000) + 60 * 60; //1hr
  _options.recipient = options.recipient;
  if(options.admin){
    _options.fee = {
      recipient: options.admin,
      fee: new Percent(options.feeBips??1, 10_000) //1bips
    };
  }
    
  const callParams = SwapRouter.swapCallParameters(trade,  _options)
  const swapRouterAddress = getSwapRouterAddr(chainId);
  return {address:swapRouterAddress, param:callParams}
}

