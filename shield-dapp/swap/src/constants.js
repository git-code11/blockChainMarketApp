// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's
//import { Token } from '@pancakeswap/swap-sdk-core'
import { FACTORY_ADDRESS, DEPLOYER_ADDRESS} from '@pancakeswap/v3-sdk'
import {bscTestnetTokens } from "@pancakeswap/tokens";
import {Native} from "@pancakeswap/sdk"


// Addresses
const IS_PRODUCTION = process.env === "PRODUCTION";

export const POOL_FACTORY_CONTRACT_ADDRESS = FACTORY_ADDRESS;
export const POOL_DEPLOYER_CONTRACT_ADDRESS = DEPLOYER_ADDRESS;


export const QUOTER_V2_CONTRACT_ADDRESS = "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2";
//IS_PRODUCTION ?'0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997':"0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2"

export const SWAP_ROUTER_ADDRESS = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";
//IS_PRODUCTION?"0x1b81D678ffb9C0263b24A97847620C99d213eB14":"0x1b81D678ffb9C0263b24A97847620C99d213eB14"

// Currencies and Tokens


export const WBNB_TOKEN = bscTestnetTokens.wbnb && Native.onChain(bscTestnetTokens.wbnb.chainId);

export const CAKE_TOKEN = bscTestnetTokens.usdt;


console.log({CAKE_TOKEN, WBNB_TOKEN});

export const ERC20_ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function allowance(address _owner, address _spender) view returns (uint256)',

    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    'function approve(address _spender, uint256 _value) returns (bool)',
  
    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ]
  
  export const WETH_ABI = [
    // Wrap ETH
    'function deposit() payable',
  
    // Unwrap ETH
    'function withdraw(uint wad) public',
  ]


export const WETH_CONTRACT_ADDRESS = WBNB_TOKEN.address;
// Transactions

export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 0.01
