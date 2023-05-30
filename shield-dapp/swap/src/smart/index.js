import { ChainId, TradeType, CurrencyAmount, Percent} from '@pancakeswap/sdk';
import {PoolType, SwapRouter} from '@pancakeswap/smart-router/evm';
import { fromReadableAmount, toReadableAmount } from '../libs/conversion';
import {CurrentConfig} from '../config';
import { createTransaction, sendTransaction, getWallet, approveAmount } from '../libs/providers';

import _quoteProvider from './_quoteProvider';
import _poolProvider,{CandidatePoolCache, globalCandidatePoolCache} from './_poolProvider';
import _getBestTrade from './_getBestTrade';
import {getSwapRouterAddr, timeit} from './_utils';
import { getWorker } from './_worker';//_web_worker

const currentChainId = ChainId.BSC_TESTNET;

const swapOptions = {
 
  slippageTolerance: new Percent(5000, 10_000),  //5000bips = 50%

  recipient: getWallet().addresss,

  /**
   * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
   */
  deadlineOrPreviousBlockhash: Math.round(Date.now()/1000) + 60 * 60,  //60 min

  /**
   * Optional information for taking a fee on output.
   */
  fee:{
    recipient:"0x8b3Eb6b31f45b9Dbbdb1EB1B25F2aE19B0835726",
    fee: new Percent(100, 10_000)//1% fee 100bps
  }
}

const _config = {
    gasPriceWei: 10,
    poolProvider: _poolProvider.onChain,
    quoteProvider: _quoteProvider.onChain,
    allowedPoolTypes:[PoolType.V2, PoolType.V3, PoolType.STABLE]
}

const params = [
    CurrencyAmount.fromRawAmount(CurrentConfig.tokens.in,
        fromReadableAmount( CurrentConfig.tokens.amountIn ,18)
        ),
    CurrentConfig.tokens.out,
    TradeType.EXACT_INPUT,
    _config
];

const params1 = [
  CurrencyAmount.fromRawAmount(CurrentConfig.tokens.in,
      fromReadableAmount( 23 ,18)
      ),
  CurrentConfig.tokens.out,
  TradeType.EXACT_INPUT,
  _config
];

const params2 = [
  CurrencyAmount.fromRawAmount(CurrentConfig.tokens.in,
      fromReadableAmount( 0.4 ,18)
      ),
  CurrentConfig.tokens.out,
  TradeType.EXACT_INPUT,
  _config
];



const run = async(_getBestTradeFunc)=>{
  let trade = await _getBestTradeFunc(...params);
  console.log("Input0 =>", toReadableAmount(trade.inputAmount.quotient));
  console.log("Output0 =>", toReadableAmount(trade.outputAmount.quotient));
  console.log("PART2");
  
  trade = await _getBestTradeFunc(...params1);
  console.log("Input1 =>", toReadableAmount(trade.inputAmount.quotient));
  console.log("Output1 =>", toReadableAmount(trade.outputAmount.quotient));

  trade = await _getBestTradeFunc(...params2);
  console.log("Input2 =>", toReadableAmount(trade.inputAmount.quotient));
  console.log("Output2 =>", toReadableAmount(trade.outputAmount.quotient));
  
}

const cache_1 = new CandidatePoolCache();
const cache_2 = new CandidatePoolCache();
const cache_3 = new CandidatePoolCache();

const allFunc = {
  main:_getBestTrade.main,
  api:_getBestTrade.api,
 // worker:(...args)=>_getBestTrade.worker()(...args),
  cachedMain:_getBestTrade.cache.main(cache_1),
  cachedApi:_getBestTrade.cache.api(cache_2),
 // cachedWorker:_getBestTrade.cache.worker(cache_3)
}

const start = async()=>{
  const calls = {}
  for(let [name, args] of Object.entries(allFunc)){
    calls[name] = await timeit(
      {
        func: run,
        name,
        args
      }
    );
  }
  
  for(let key in allFunc){
    console.log(key, "=>", calls[key]/1000);
  }
}

const ENABLE_CACHE = false;

async function main(_worker, _cachedPool){
    console.log("Getting Trade");
    const _getBestTradeFunc = ENABLE_CACHE ? _getBestTrade.cachedMain(_cachedPool): _getBestTrade.main;
    let trade = await _getBestTradeFunc(...params);
    console.log("Input0 =>", toReadableAmount(trade.inputAmount.quotient));
    console.log("Output0 =>", toReadableAmount(trade.outputAmount.quotient));
    console.log("PART2");
    
    {
      trade = await _getBestTradeFunc(...params1);
      console.log("Input1 =>", toReadableAmount(trade.inputAmount.quotient));
      console.log("Output1 =>", toReadableAmount(trade.outputAmount.quotient));
    }
    
    {
      trade = await _getBestTradeFunc(...params2);
      console.log("Input2 =>", toReadableAmount(trade.inputAmount.quotient));
      console.log("Output2 =>", toReadableAmount(trade.outputAmount.quotient));
    }

    console.log({gpool:cache1._expireTime});
    console.log({gpool:globalCandidatePoolCache._expireTime});
    return "finish";

    const callParams = SwapRouter.swapCallParameters(trade,  swapOptions)
    const swapRouterAddress = getSwapRouterAddr(currentChainId);
    //console.log({trade});
    //console.log({callParams})
    if(CurrentConfig.tokens.in.isToken){
      console.log("Approving Contract to spend token");
      const _inToken = CurrentConfig.tokens.in;
      const _amount = fromReadableAmount( CurrentConfig.tokens.amountIn ,18)
      const data = await approveAmount(_inToken.address, getWallet(), swapRouterAddress, _amount);
      console.log("approve result", data)
    }
    
    console.log("Create Transaction");
    const tradeTX = await createTransaction(
      {
        from: getWallet().address,
        to: swapRouterAddress,
        data: callParams.calldata,
        value:callParams.value
      }
    );
   
  const result = tradeTX && (await sendTransaction(getWallet(), tradeTX));
  console.log("trade TX", result);
  console.log("done")
}

const worker1 = getWorker();
const cache1 = new CandidatePoolCache();
const startTime = Date.now();

// main(worker1, cache1).catch(console.log).finally(()=>{
//   console.log("Duration=>",(Date.now()-startTime)/1000, 's');
//   process.exit();
// });

start().catch(console.log).finally(()=>{
  process.exit();
});

