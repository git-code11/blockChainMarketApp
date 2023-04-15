import { useContractRead, useContractWrite, usePrepareContractWrite, useContractReads, useAccount} from 'wagmi'

import {Token, TokenAmount, Fetcher, Trade, Percent} from '@pancakeswap-libs/sdk-v2';

import token_list from './token_list';

const provider = "";


//Base Token to be used in new pair path search
const baseTokens = []

//Make KEY from tokens for caching
const getPairKey = (tokens)=>tokens.map(t=>t.name).sort().join('/');

//Fetching Tokens Pair Data
const fetchPair = (tokens)=>{
	return Fetcher.fetchPairData(tokens[0], tokens[1], provider);
}

//Getting Availabe Pairs
const makePair = async(tokens)=>{
    //Example token supplied BUSD\CAK
    let pairList = [];//Store Available Pair List
  
    try{
        //Checking if pair exists and then all to pairList
        let pair = await fetchPair(tokens);
        pairList.push(pair);
    }catch(e){
        //Pair does not exist
        //console.log("No pair for =>",getPairKey(tokens));
    }

    //When no pairs found then search for new pair via path with base tokens
    if(!pairList[0]){
        for(let k = 0; k<baseTokens.length;k++){
            //if the current base token is included in the supplied token then skip
            if(tokens.includes(baseTokens[k])){
                continue;
            }

            try{
                //hold pairs to each tokens supplied to a single baseTokeE
                //BUSD\BNB && CAKE\BNB
                //;where baseToken is BNB
                let tempPair = [];
                for(let j = 0; j<2; j++){
                    //Checking if pairs exist
                    let pair = await fetchPair([tokens[j], baseToken[k]]);
                    tempPair.push(pair);
                }
                //add all pairs to pairsList
                pairList = pairList.concat(temp_pair);
            }catch(e){
                //Could not fetch pairs for none or one or both supplied token with a give baseToken
            }
        }
    }

    //returns availabe pairs for token or empty array;
    return pairList;
}

//Fetch best Paths for trade from given pairs array inn descending order
//tokens=[inputToken, outputToken]
const makeTrade = (tokens, pairs, inputValue)=>{
    const trades = Trade.bestTradeExactIn(pairs, new TokenAmount(tokens[0], inputValue), tokens[1]);
    return trades
}

//Fetch outputValue from a give trade specifing slippage percentage
//Slippage Percent ranges from an accuracy of 1 decimal place
const exTrade = (trade, percent)=>{//from 0.5 => 10
    let slipagePercent = new Percent(percent * 10, 1000);
    let outputValue = trade.minimumAmountOut(slipagePercent);
    return [outputValue, slipagePercent];
}

//Generate an instance if Token Class
const __token = (d)=>new Token(d.chainId??56, d.address, d.decimals, d.symbol, d.name);

//use id ti get an instance if token from token_list
const getWrapToken = (id)=>__token(token_list[id]);

