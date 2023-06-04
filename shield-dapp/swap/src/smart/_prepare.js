//import { SwapRouter } from '@pancakeswap/smart-router/evm';
const {SwapRouter} = require("@pancakeswap/smart-router/evm");
import { TradeType, CurrencyAmount, Percent} from '@pancakeswap/sdk';
import _quoteProvider from './_quoteProvider';
import _poolProvider from './_poolProvider';
import { getAllPoolTypes, getSwapRouterAddr, fromVReadableAmount } from './_utils';

const prepareTradeQuoteParamsConfig  = {
  gasPriceWei: 10,
  poolProvider: _poolProvider.onChain,
  quoteProvider: _quoteProvider.onChain,
  allowedPoolTypes:getAllPoolTypes()
}

export const prepareTradeQuoteParams = ({amountIn, currencyIn, currencyOut, tradeType, config})=>{
  //console.log({amountIn, currencyIn, currencyOut, tradeType, config})
  
  const _config = {
    ...prepareTradeQuoteParamsConfig,
    ...config
  }

  const params = [
    CurrencyAmount.fromRawAmount(currencyIn,
      fromVReadableAmount( amountIn , currencyIn.decimals)
        ),
    currencyOut,
    tradeType??TradeType.EXACT_INPUT,
    _config
  ];
  
  return params;

}


export const prepareTradeCallData = ({
            trade,
            chainId,
            options
    })=>{
  const _options = {}
  _options.slippageTolerance = new Percent(Number(options.toleranceBips?? 1), 10_000); //1bips
  _options.deadlineOrPreviousBlockhash = options.deadline ?? Math.round(Date.now()/1000) + 60 * 60; //1hr
  _options.recipient = options.recipient;
  if(options.admin){
    _options.fee = {
      recipient: options.admin,
      fee: new Percent(options.feeBips??1, 10_000) //1bips
    };
  }
    
  const callParams = SwapRouter.swapCallParameters(trade,  _options)
  const swapRouterAddress = getSwapRouterAddr(chainId);
  return {address:swapRouterAddress, param:callParams,
    
    //to support other calltypes
    data:callParams.calldata,
    value:callParams.value,
    to:swapRouterAddress
  }
}

