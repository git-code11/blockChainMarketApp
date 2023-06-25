import { ChainId, ERC20Token } from "@pancakeswap/sdk";

import { ethereumTokens, 
    bscTokens, 
    bscTestnetTokens, 
    goerliTestnetTokens
} from "@pancakeswap/tokens";

import { getBNBTokens, getETHTokens, getWrapTokens } from "./swap-tokens";


const moreTokensBSC = [
    {
        name:"MATIC BEP20",
        symbol:"MATIC",
        decimals:18,
        address:"0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
        chainId:56
    },
    {
        name:"ShieldCoin",
        symbol:"SHC",
        decimals:18,
        address:"0x4E6345e00B8DA9b12dcF81D585D15Ea9924B3E80",
        chainId:56
    },
];

const moreTokensETH = [];

const moreTokensBSC_Testnet = [
    {
        name:"EXPLOT",
        symbol:"XPT",
        decimals:18,
        address:"0x67d495d90b0cf6cfa990659ff980a49d27ecadd1",
        chainId:97
    }
];



const _TK_BSC_TEST = moreTokensBSC_Testnet.reduce((acc, tk)=>{
    acc[tk.symbol.toLocaleLowerCase()] = new ERC20Token(
        tk.chainId,
        tk.address,
        tk.decimals,
        tk.symbol,
        tk.name
    );
    return acc
    }, {}
);

const bsc_list = [...getBNBTokens(), ...moreTokensBSC];
const eth_list = [...getETHTokens(), ...moreTokensETH];
const __bnb_symbol_tokens = getWrapTokens(bsc_list);

const __eth_symbol_tokens = getWrapTokens(eth_list);

const bnb_symbol_tokens = __bnb_symbol_tokens();

const eth_symbol_tokens = __eth_symbol_tokens();

export const getLogoURI = (token)=>{
    const {address, symbol} = token || {};
    if(!Boolean(address && symbol)){
        return null;
    }
    
    for(let list of [bsc_list, eth_list]){
        let found = list.find(tk=>
            tk.address.toLowerCase() === address.toLowerCase()||
            tk.symbol.toLowerCase() === symbol.toLowerCase()
        );
        if(found){
            return found.logoURI;
        }
    }

    return null;
}


export const _CHAIN_TOKEN_LIST = {
    [ChainId.ETHEREUM]:eth_symbol_tokens,
    [ChainId.BSC]:bnb_symbol_tokens,
    [ChainId.BSC_TESTNET]:{...bscTestnetTokens, ..._TK_BSC_TEST},
    [ChainId.GOERLI]:goerliTestnetTokens
}