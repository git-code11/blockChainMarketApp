import {useMemo, useCallback, useEffect} from 'react';
import { TradeType } from '@pancakeswap/sdk';
//import { SmartRouter } from '@pancakeswap/smart-router/evm'
const { SmartRouter } = require('@pancakeswap/smart-router/evm');
import _getBestTrade from "../../../swap/src/smart/_getBestTrade";
import _poolProvider, { CandidatePoolCache } from '../../../swap/src/smart/_poolProvider';
import _quoteProvider from '../../../swap/src/smart/_quoteProvider';
import { getPoolTypes, gasPriceWei } from '../../../swap/src/smart/_utils';
import { useDispatch, useSelector } from 'react-redux';
import { useSwapCurrency } from './currency';
import usePromise from '../../hook/usePromise';
import useSwapOutput from './useSwapOutput';
import { actions } from '../reducer';
import { prepareTradeQuoteParams } from '../../../swap/src/smart/_prepare';
import { useDebounce } from 'use-debounce';
import { toVReadableAmount } from '../../../swap/src/smart/_utils';

const cache1 = new CandidatePoolCache();

export default ()=>{
    
    const dispatch = useDispatch();
    
    const {update:outputUpdate} = useSwapOutput();

    const updateState = useCallback(trade=>{
        if(trade){
            outputUpdate({amount:toVReadableAmount(trade.outputAmount.quotient)});
            dispatch(actions.tradeChange({
                chainId:trade.inputAmount.currency.chainId,
                value:SmartRouter.Transformer.serializeTrade(trade)
            }));
        }
    },[dispatch, outputUpdate])

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

    const [_currencyIn] = useDebounce(input.currency, 5000);
    const [_currencyOut] = useDebounce(output.currency, 5000);
    const currencyIn = useSwapCurrency(_currencyIn);
    const currencyOut = useSwapCurrency(_currencyOut);

    const [amountIn] = useDebounce(input.amount, 5000);

    const _getBestTradeFunc = useMemo(()=>_getBestTrade.cache.main(cache1),[dev]);
    
    //console.log({amountIn, currencyIn, currencyOut});
    const _enabledQuote = useMemo(
                ()=>
                    Boolean(!isNaN(amountIn) && currencyIn && currencyOut)
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
            [amountIn, currencyIn, currencyOut, _enabledQuote]);
    
    console.log({_enabledQuote, _params});

    const _tradeFunc = useCallback(async (...args)=>{
        console.log("DEBUG Calling Trade", args)
        if(args.length === 0)
            return null;
        const _trade = await _getBestTradeFunc(...args);
        console.log({_trade})
        updateState(_trade);
        return _trade;
    },[_params, _getBestTradeFunc, dispatch, updateState]);

    const {call:getTradeQuote, loading, error} = usePromise(_tradeFunc);
    console.log({loading, error});
    const data = useMemo(()=>{
        if(serializedTrade.chainId && serializedTrade.value){
            return SmartRouter.Transformer.parseTrade(serializedTrade.chainId, serializedTrade.value);
        }
        return null;
    },[serializedTrade]);

    const update = useCallback(()=>{
        getTradeQuote(..._params);
    },[_params]);

    useEffect(()=>{
        if(_params)
            update();
    },[_params]);

    return {data, update, loading, error}
}