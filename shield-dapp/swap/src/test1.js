import { prepareTradeQuoteParams, quoteProviders,
    CandidatePoolCache, TradeCache,bestTrades, utils, TradeType, PoolType
} from './smart'

import {SELECTED_CHAINID} from './constants'
import {bscTestnetTokens } from "@pancakeswap/tokens";
import {Native} from "@pancakeswap/sdk"

import { toReadableAmount } from './libs/conversion';

import { computeTradePriceBreakdown, computeSlippageAdjustedAmounts, formatExecutionPrice } from './smart/exchange';


const getBestTradeFunc = bestTrades.api;


const WBNB_TOKEN = Native.onChain(SELECTED_CHAINID);
const USDT_TOKEN = bscTestnetTokens.usdt;

const trade_params = {
    amountIn:"35",
    currencyIn: USDT_TOKEN,
    currencyOut:WBNB_TOKEN,
    tradeType:TradeType.EXACT_INPUT,
    config:{
        gasPriceWei:utils.gasPriceWei,
        quoteProvider:quoteProviders.offChain(),
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
    const trade = await getBestTradeFunc(...quote);
    
    console.log("Trade Fetch Success");
    console.log("Input0 =>", toReadableAmount(trade.inputAmount.quotient), trade.inputAmount.currency.symbol);
    console.log("Output0 =>", toReadableAmount(trade.outputAmount.quotient), trade.outputAmount.currency.symbol);

    console.log("FormatExecution Price");
    console.log(formatExecutionPrice(trade, false));

    console.log("Slippage = 100Bps = 1%");
    console.log(computeSlippageAdjustedAmounts(trade, 100));
    
    console.log("Price Breakdown");
    console.log(computeTradePriceBreakdown(trade));

}

main();
