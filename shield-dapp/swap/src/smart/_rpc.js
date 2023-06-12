import { ChainId } from '@pancakeswap/sdk'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains';

export const CHAINS = [bsc, bscTestnet, goerli, mainnet]

export const PUBLIC_RPC_URL = {
    [ChainId.BSC_TESTNET]:[
        
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "http://data-seed-prebsc-1-s2.binance.org:8545/",
        "https://bsc-testnet.publicnode.com",
        "https://bsc-testnet.public.blastapi.io",
        
    ],
    [ChainId.GOERLI]:[
      
      'https://eth-goerli.public.blastapi.io',
      "https://ethereum-goerli.publicnode.com",
    ],
    [ChainId.BSC]:[

        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed1.defibit.io',
    ],
    [ChainId.ETHEREUM]:[
    
        'https://eth.llamarpc.com',
        'https://cloudflare-eth.com',
        "https://rpc.builder0x69.io",
        "https://ethereum.publicnode.com",
        "https://rpc.mevblocker.io",
        "https://eth-rpc.gateway.pokt.network",
        "https://rpc.flashbots.net/",
        "https://rpc.ankr.com/eth",
        "https://eth-mainnet.nodereal.io/v1/",
        "https://eth-mainnet.public.blastapi.io",
        "https://llamanodes.com/",
        
    ]
}