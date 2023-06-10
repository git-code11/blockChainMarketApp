import { prepareTradeCallData, prepareTradeQuoteParams, quoteProviders,
    poolProviders, CandidatePoolCache, TradeCache,bestTrades, utils, TradeType, PoolType
} from './smart'

import {SELECTED_CHAINID} from './constants'
import {bscTestnetTokens } from "@pancakeswap/tokens";
import {Native} from "@pancakeswap/sdk"

import { createTransaction, sendTransaction, getWallet, approveAmount } from '../libs/providers';
import { fromReadableAmount, toReadableAmount } from '../libs/conversion';_

const poolCache = new CandidatePoolCache();
const getBestTradeFunc = bestTrades.cache.main(poolCache);
const tradeCache = new TradeCache(getBestTradeFunc);

const WBNB_TOKEN = Native.onChain(SELECTED_CHAINID);
const USDT_TOKEN = bscTestnetTokens.usdt;

const trade_params = {
    amountIn:"0.004",
    currencyIn: WBNB_TOKEN,
    currencyOut:USDT_TOKEN,
    tradeType:TradeType.EXACT_INPUT,
    config:{
        gasPriceWei:utils.gasPriceWei,
        quoteProvider:quoteProviders.offChain,
        allowedPoolTypes:[PoolType.V2, PoolType.V3, PoolType.STABLE]
    }
}

const options = {
    toleranceBips:10,//10bips
    deadline: 1 * 60, //1min //default 1hr
    recipient:"0x8b3Eb6b31f45b9Dbbdb1EB1B25F2aE19B0835726",
    admin:"0x8b3Eb6b31f45b9Dbbdb1EB1B25F2aE19B0835726",
    feeBips:1 //1Bips
}

const main = async ()=>{
    const {currencyIn, currencyOut, amountIn} = trade_params;

    console.log(`Fetcing Trade for Swapping on
        ${amountIn} ${currencyIn.symbol} to -- ${currencyOut.symbol}
    `);

    const quote = prepareTradeQuoteParams(trade_params);
    const trade = await tradeCache.getTrade({forceUpdate:false, args:quote});
    
    console.log("Trade Fetch Success");
    console.log("Input0 =>", toReadableAmount(trade.inputAmount.quotient));
    console.log("Output0 =>", toReadableAmount(trade.outputAmount.quotient));

    const calldata = prepareTradeCallData({trade, options});
    console.log("Fetch CallData Success")
    
    if(currencyIn.isToken){
      console.log("Approving Contract to spend token");
      const _amount = fromReadableAmount( amountIn , currencyIn.decimals);
      const data = await approveAmount(currencyIn.address, getWallet(), calldata.to, _amount);
      console.log("approve Success", data)
    }
    
    console.log("Creating  Transaction");
    const tradeTX = await createTransaction(
      {
        from: getWallet().address,
        to: calldata.to,
        data:calldata.data,
        value:calldata.value
      }
    );
    
    console.log("Executing Transaction");
    const result = tradeTX && (await sendTransaction(getWallet(), tradeTX));
    console.log("Transaction", result);
    console.log("Completed");
}

main();
