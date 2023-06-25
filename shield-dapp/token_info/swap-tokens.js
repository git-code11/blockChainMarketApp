import { ERC20Token } from "@pancakeswap/sdk";
import ethMM from "./pancakeswap-eth-mm.json";
import bnbExt from "./pancakeswap-extended.json";
import bnbMM  from "./pancakeswap-bnb-mm.json";

export const getWrap = (tk)=>{
    return new ERC20Token(
        tk.chainId,
        tk.address,
        tk.decimals,
        tk.symbol,
        tk.name
    );
}


const _getTokensInfo = (allList=[])=>{
    let cache = null;
    return ()=>{
        if(!cache){
            cache = allList[0] ?? [];
            if(allList.length > 1){
                allList.slice(1).forEach( tokens=>
                    tokens.forEach( info=>{
                        const exist = Boolean(cache.find(data=>data.address.toLowerCase() === info.address.toLowerCase()));
                        if(!exist){
                            cache.push(info);
                        }
                    })
                )
            }
        }
        return cache;
    }
}

export const getBNBTokens = _getTokensInfo([bnbMM.tokens, bnbExt.tokens]);
export const getETHTokens = _getTokensInfo([ethMM.tokens]);

export const getWrapTokens = (tks=[])=>{
    let cache = null;
    return ()=>{
        if(!cache){
            cache = {};
            tks.reduce((acc, tk)=>{
                //console.log({acc,tk});
                acc[tk.symbol.toLowerCase()] = getWrap(tk);
                return acc;
            },cache);
        }
        return cache;
    }
}
