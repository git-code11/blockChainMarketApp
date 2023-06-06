import { ChainId } from '@pancakeswap/sdk'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains';

export const CHAINS = [bsc, bscTestnet, goerli, mainnet]

const DEF_RPC_URL = {
    [ChainId.BSC_TESTNET]:[
      bscTestnet.rpcUrls.default.http[0]
    ],
    [ChainId.GOERLI]:[
      goerli.rpcUrls.default.http[0],
      goerli.rpcUrls.infura.http[0],
      goerli.rpcUrls.alchemy.http[0]
    ],
    [ChainId.BSC]:[
      bsc.rpcUrls.default.http[0],
    ],
    [ChainId.ETHEREUM]:[
      mainnet.rpcUrls.default.http[0],
      mainnet.rpcUrls.infura.http[0],
      mainnet.rpcUrls.alchemy.http[0],
    ]
}

export const RPC_URL = {
    [ChainId.BSC_TESTNET]:[
        
        "https://bsc-testnet.publicnode.com",
        "https://bsc-testnet.public.blastapi.io",
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "http://data-seed-prebsc-1-s2.binance.org:8545/",
        ...DEF_RPC_URL[ChainId.BSC_TESTNET]
    ],
    [ChainId.GOERLI]:[
      "https://rpc.ankr.com/eth_goerli",
      "https://ethereum-goerli.publicnode.com",
      "https://eth-goerli.public.blastapi.io",
      ...DEF_RPC_URL[ChainId.GOERLI]
    ],
    [ChainId.BSC]:[
        "https://bsc.publicnode.com",
        "https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d",
        "https://bscrpc.com",
        "https://rpc.ankr.com/bsc",
        "https://bsc.rpcgator.com/",
        "https://bsc-mainnet.nodereal.io/v1/",
        "https://bsc-dataseed.binance.org",
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        ...DEF_RPC_URL[ChainId.BSC],
    ],
    [ChainId.ETHEREUM]:[
        "https://eth.llamarpc.com",
        "https://rpc.builder0x69.io",
        "https://ethereum.publicnode.com",
        "https://rpc.mevblocker.io",
        "https://eth-rpc.gateway.pokt.network",
        "https://rpc.flashbots.net/",
        "https://rpc.ankr.com/eth",
        "https://eth-mainnet.nodereal.io/v1/",
        "https://eth-mainnet.public.blastapi.io",
        "https://llamanodes.com/",
        ...DEF_RPC_URL[ChainId.ETHEREUM],
    ]
}