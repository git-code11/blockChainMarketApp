import {useMemo, useCallback, useEffect} from 'react';
import { TradeType } from '@pancakeswap/sdk';
//import { SmartRouter } from '@pancakeswap/smart-router/evm'
const { SmartRouter } = require('@pancakeswap/smart-router/evm');
import _getBestTrade, { TradeCache } from "../../../swap/src/smart/_getBestTrade";
import _poolProvider, { CandidatePoolCache } from '../../../swap/src/smart/_poolProvider';
import _quoteProvider from '../../../swap/src/smart/_quoteProvider';
import { getPoolTypes, gasPriceWei, amountFixed } from '../../../swap/src/smart/_utils';
import { useDispatch, useSelector } from 'react-redux';
import { useSwapCurrency } from './currency';
import usePromise from '../../hook/usePromise2';
import { actions } from '../reducer';
import { prepareTradeQuoteParams } from '../../../swap/src/smart/_prepare';
import { useDebounce } from 'use-debounce';

import { getWorker } from '../../../swap/src/smart/_web_worker';

const poolCache1 = new CandidatePoolCache();
const worker1 = getWorker();
const tradeCache1 = new TradeCache(_getBestTrade.cache.main(poolCache1, worker1))

/**
 * NOTE: 
 * const poolCache1 = new CandidatePoolCache();
 * const tradeCache1 = new TradeCache(_getBestTrade.cache.main(poolCache1))
 * _getBestTrade.cache.main(poolCache1) => pool = cached; trade = not cached
 * is the same as _getBestTrade.main => pool = not cached; trade = not cached
 * is the same as tradeCache1.getTrade => pool = cached; trade = cached
 */

const DEBOUNCE_TIME = 2500;

export default ()=>{
    
    const dispatch = useDispatch();

    const updateState = useCallback((trade)=>{
        console.log("TRADE _UPDATE")
        if(trade){
            dispatch(actions.tradeChange({
                input:{
                    amount:amountFixed(trade.inputAmount),
                    currency:trade.inputAmount.currency.address
                },
                output:{
                    amount:amountFixed(trade.outputAmount),
                    currency:trade.outputAmount.currency.address
                },
                chainId:trade.inputAmount.currency.chainId,
                value:SmartRouter.Transformer.serializeTrade(trade)
            }));
        }
    },[dispatch]);

    const {
            input, 
            output, 
            dev, 
            settings:{
                pool
            },
            trade:serializedTrade
        } = useSelector(state=>state.swap);
    
    const allowedPoolTypes = useMemo(()=>getPoolTypes(pool), [pool]);

    const [_currencyIn] = useDebounce(input.currency, DEBOUNCE_TIME);
    const [_currencyOut] = useDebounce(output.currency, DEBOUNCE_TIME);
    const currencyIn = useSwapCurrency(_currencyIn);
    const currencyOut = useSwapCurrency(_currencyOut);

    const [amountIn] = useDebounce(input.amount, DEBOUNCE_TIME);

    const _getBestTradeFunc = useCallback((...args)=>tradeCache1.getTrade(...args),[dev]);
    
    //console.log({amountIn, currencyIn, currencyOut});
    const _enabledQuote = useMemo(
                ()=>
                    Boolean(!isNaN(amountIn) && Number(amountIn) > 0 && currencyIn && currencyOut)
            ,[amountIn, currencyIn, currencyOut]);

    const _params = useMemo(()=>
                _enabledQuote && 
                prepareTradeQuoteParams({
                    amountIn,
                    currencyIn,
                    currencyOut,
                    tradeType:TradeType.EXACT_INPUT,
                    config:{
                        allowedPoolTypes,
                        gasPriceWei
                    }
                }),
            [amountIn, currencyIn, currencyOut, allowedPoolTypes, _enabledQuote]);
    
    const _tradeFunc = useCallback(async (forceUpdate, ...args)=>{
        if(args.length === 0)
            return null;
        const _trade = await _getBestTradeFunc({forceUpdate, args});
        
        console.log("SUCCES TRADE", _trade);
        return _trade;
    },[_getBestTradeFunc, dispatch, updateState]);

    const {call:getTradeQuote, value:callValue, loading, error} = usePromise(_tradeFunc, false);//dont wait for a value fo resume
    
    useEffect(()=>{
        console.log({callValue});
        if(callValue)
            updateState(callValue);
    }, [callValue]);

    const data = useMemo(()=>{
        if(serializedTrade.chainId && serializedTrade.value){
            return SmartRouter.Transformer.parseTrade(serializedTrade.chainId, serializedTrade.value);
        }
        return null;
    },[serializedTrade]);

    
    const update = useCallback((forceUpdate)=>{
        if(_params){
            getTradeQuote(forceUpdate??false, ..._params);
        }
    },[_params]);

    const outputValue = useMemo(()=>data?amountFixed(data.outputAmount):"0.0", [data]);

    const exist = useMemo(()=>Boolean(data),[data]);

    return {data, outputValue, exist, update, loading, error, params:_params}
}