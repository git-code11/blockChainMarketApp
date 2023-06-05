//import { ChainId } from '@pancakeswap/sdk'
//import {PoolType, SWAP_ROUTER_ADDRESSES} from '@pancakeswap/smart-router/evm';
const {PoolType, SWAP_ROUTER_ADDRESSES} = require("@pancakeswap/smart-router/evm");
//import { GraphQLClient } from 'graphql-request'
import { createPublicClient, http, fallback } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains';
import { parseUnits, formatUnits } from 'ethers/lib/utils.js';
import { parseUnits as vparseUnits, formatUnits as vformatUnits} from 'viem'
// const V3_SUBGRAPH_URLS = {
//     [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
//     [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
//     [ChainId.BSC]: `https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc`,
//     [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
// }

const CHAINS = [bsc, bscTestnet, goerli, mainnet]

export const MAP_ID_CHAIN = CHAINS.reduce((_map, _chain)=>({..._map,[_chain.id]:_chain}),{});

export const viemClients = ({ chainId}, ...args) => {
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

export const gasPriceWei = ({chainId})=>viemClients({chainId:chainId??ChainId.BSC}).getGasPrice();

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

export const getSwapRouterAddr = chainId=>SWAP_ROUTER_ADDRESSES[chainId]

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
  return parseUnits(amount.toString(), decimals??18)
}

export function fromVReadableAmount(
  amount,
  decimals
) {
  return vparseUnits(amount.toString(), decimals??18)
}


const READABLE_FORM_LEN = 24

export function toReadableAmount(rawAmount, decimals) {
  return formatUnits(rawAmount, decimals??18);
}


export function toVReadableAmount(rawAmount, decimals) {
  return vformatUnits(rawAmount, decimals??18);
}


export function amountFixed(amount, fixed=8){
  try{
    return Number(amount.toFixed(fixed))
  }catch{

  }
  return Number(Number(toVReadableAmount(amount.quotient, amount.currency.decimals)).toFixed(fixed));
}



export const getTxExplorer = (tx, chainId)=>{
  const explorer = MAP_ID_CHAIN[chainId??tx.chainId]?.blockExplorers?.default;
  const hash = tx?.transactionHash;
  
  if(!(explorer && hash))
    return null;
  
  return {
      name:explorer.name,
      url:(new URL(`/tx/${hash}`, explorer.url)).href
    }
}