import {useMemo} from 'react';
import { TradeType } from '@pancakeswap/sdk';
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import _getBestTrade from "../../../swap/src/smart/_getBestTrade";
import _poolProvider from '../../../swap/src/smart/_poolProvider';
import _quoteProvider from '../../../swap/src/smart/_quoteProvider';
import { prepareTradeQuoteParams, getPoolTypes, gasPriceWei } from '../../../swap/src/smart/_utils';
import { useDispatch, useSelector } from 'react-redux';
import { useSwapCurrency } from './currency';
import usePromise from '../../hook/usePromise';
import useSwapOutput from './useSwapOutput';
import { actions } from '../reducer';

const cache1 = new CandidatePoolCache();

export default ()=>{
    
    const dispatch = useDispatch();
    
    const {update:outputUpdate} = useSwapOutput();

    const updateState = useCallback(trade=>{
        if(trade){
            outputUpdate({amount:trade.outputAmount.quotient});
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

    const currencyIn = useSwapCurrency(input.currency);
    const currencyOut = useSwapCurrency(output.currency);

    const _getBestTradeFunc = useMemo(()=>_getBestTrade.cachedMain(cache1),[dev]);

    const _params = useMemo(()=>
                prepareTradeQuoteParams({
                    amountIn:input.amount,
                    currencyIn,
                    currencyOut,
                    tradeType:TradeType.EXACT_INPUT,
                    config:{
                        allowedPoolTypes,
                        gasPriceWei
                    }
                }),
            [input.amount, currencyIn, currencyOut]);
    
    const _tradeFunc = useCallback(async (...arg)=>{
        const _trade = await _getBestTradeFunc(...arg);
        updateState(_trade);
        return _trade;
    },[_params, _getBestTradeFunc, dispatch, updateOutput]);

    const {call:getTradeQuote, loading, error} = usePromise(_tradeFunc);
    
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
        update();
    },[_params]);

    return {data, update, loading, error}
}