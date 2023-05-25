//import { ChainId } from '@pancakeswap/sdk'
import {PoolType, SWAP_ROUTER_ADDRESSES,} from '@pancakeswap/smart-router/evm';
//import { GraphQLClient } from 'graphql-request'
import { createPublicClient, http, fallback } from 'viem'
import { bsc, bscTestnet, goerli } from 'viem/chains';

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

export const getPoolTypes = ({v2, v3, stable}) => {
    const types = [];
    if (v2) {
      types.push(PoolType.V2)
    }
    if (v3) {
      types.push(PoolType.V3)
    }
    if (stable) {
      types.push(PoolType.STABLE)
    }
    return types
}

export const getAllPoolTypes = ()=>getPoolTypes({v2:true, v3:true, stable:true});

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