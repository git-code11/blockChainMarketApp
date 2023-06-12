import { ChainId, ERC20Token } from "@pancakeswap/sdk";

import { ethereumTokens, 
    bscTokens, 
    bscTestnetTokens, 
    goerliTestnetTokens
} from "@pancakeswap/tokens";

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
    }
];

const _TK_BSC = moreTokensBSC.reduce((acc, tk)=>{
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

export const _CHAIN_TOKEN_LIST = {
    [ChainId.ETHEREUM]:ethereumTokens,
    [ChainId.BSC]:{...bscTokens, ..._TK_BSC},
    [ChainId.BSC_TESTNET]:bscTestnetTokens,
    [ChainId.GOERLI]:goerliTestnetTokens
}