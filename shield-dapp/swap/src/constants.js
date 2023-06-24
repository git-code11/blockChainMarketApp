import {ChainId} from "@pancakeswap/sdk";

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

//For test purpose not used in production
export const WALLET_KEY = process.env.WALLET_KEY;
export const RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
export const ADMIN = "0x47207ECD6a722547ec42ee899d2b8973f707090d"
export const SELECTED_CHAINID = ChainId.BSC_TESTNET;

