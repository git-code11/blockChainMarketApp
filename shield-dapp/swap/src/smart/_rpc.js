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
        'https://rpc.ankr.com/bsc',
        'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
        'https://bsc-mainnet.public.blastapi.io',
        'https://koge-rpc-bsc.48.club',
        'https://rpc-bsc.48.club',
        'https://bsc-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
        'https://bsc-dataseed3.ninicoin.io',
        'https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d',
        'https://bscrpc.com',
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
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