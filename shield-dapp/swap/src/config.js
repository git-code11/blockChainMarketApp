import { FeeAmount } from '@pancakeswap/v3-sdk'
import { WBNB_TOKEN, CAKE_TOKEN } from './constants'

// Configuration

//const _privateKey = Wallet.createRandom().privateKey;

export const CurrentConfig = {
  chain:{
    bsc_testnet:97,
    bsc_mainnet:56
  },
  rpc: {
    bsc_testnet: "https://data-seed-prebsc-1-s1.binance.org:8545",
    bsc_mainnet: "https://bsc-dataseed1.binance.org",
  },
  wallet: {
    address: '',
    privateKey:'7a3191ef16ebe5897731c4f70390eef0ee62a0f368e748f431a5375b45713771',
  },
  tokens: {
    in: CAKE_TOKEN,
    amountIn: 10,
    out: WBNB_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}