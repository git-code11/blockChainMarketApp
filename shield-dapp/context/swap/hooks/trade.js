import {useMemo, useCallback, createContext, useContext, useEffect} from 'react';
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
import useSwapChainChanged from './useSwapChainChanged';
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

const DEBOUNCE_TIME = 250;


const useGetBestTrade = ()=>{
    
    const dev = useSelector(state=>state.swap.dev);

    const _getBestTradeFunc = useCallback((args)=>{
        /**
         * reset pool and trade cache for forced update or when new transaction takes place
         */
        if(args && args.forceUpdate){
            poolCache1.reset();
            tradeCache1.reset();
        }
        return tradeCache1.getTrade(args);
    },[dev]);

    return _getBestTradeFunc;

}

const useAllowedPoolTypes = ()=>{
    const pool = useSelector(state=>state.swap.settings.pool);

    return useMemo(()=>getPoolTypes(pool), [pool]);
}

export const useDeserializeTrade = (serializedTrade)=>{
    return useMemo(()=>{
        if(serializedTrade.chainId && serializedTrade.value){
            return SmartRouter.Transformer.parseTrade(serializedTrade.chainId, serializedTrade.value);
        }
        return null;
    },[serializedTrade]);
}

export const useSerializeTrade = ()=>{
    return useCallback(SmartRouter.Transformer.serializeTrade,[]);
}

const useUpdateCurrentTradeState = ()=>{

    const dispatch = useDispatch();
    const serializeTrade = useSerializeTrade();

    return useCallback(trade=>{
        console.log("TRADE _UPDATE")
        if(trade){
            dispatch(actions.tradeChange({
                input:{
                    amount:amountFixed(trade.inputAmount),
                    currency:trade.inputAmount.currency.wrapped.address
                },
                output:{
                    amount:amountFixed(trade.outputAmount),
                    currency:trade.outputAmount.currency.wrapped.address
                },
                chainId:trade.inputAmount.currency.chainId,
                value:serializeTrade(trade)
            }));
        }
    },[]);
}


const usePrepareQuoteParams = ({
    amountIn,
    currencyIn,
    currencyOut,
    allowedPoolTypes,
    })=>{

    const _enabledQuote = useMemo(
        ()=>
            Boolean(!isNaN(amountIn) && Number(amountIn) > 0 && currencyIn && currencyOut)
    ,[amountIn, currencyIn, currencyOut]);

    return useMemo(()=>
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

}


const useDebounceValue = ()=>{
    
    const {
        input, 
        output,
    } = useSelector(state=>state.swap);

    const [_currencyIn] = useDebounce(input.currency, DEBOUNCE_TIME);
    const [_currencyOut] = useDebounce(output.currency, DEBOUNCE_TIME);
    const currencyIn = useSwapCurrency(_currencyIn);
    const currencyOut = useSwapCurrency(_currencyOut);

    const [amountIn] = useDebounce(input.amount, DEBOUNCE_TIME);

    return {amountIn, currencyIn, currencyOut}
}

const useCurrentTrade = ()=>{
    const serializedTrade = useSelector(state=>state.swap.trade);

    return useDeserializeTrade(serializedTrade);
}

const useSwapTradeWrap = ()=>{

    useSwapChainChanged();

    const data = useCurrentTrade();
    const exist = useMemo(()=>Boolean(data),[data]);
    const allowedPoolTypes = useAllowedPoolTypes();
    const _getBestTradeFunc = useGetBestTrade();
    
    const updateCurrentTrade= useUpdateCurrentTradeState();   
    
    const {amountIn, currencyIn, currencyOut} = useDebounceValue();
    
    const params = usePrepareQuoteParams({
        amountIn,
        currencyIn,
        currencyOut,
        allowedPoolTypes
    });
    
    const _tradeFunc = useCallback(async (forceUpdate, args)=>{
        if(args && args.length === 0)
            return null;
        const _trade = await _getBestTradeFunc({forceUpdate, args});
        
        console.log("SUCCES TRADE", _trade);
        return _trade;
    },[_getBestTradeFunc]);

    const {call:getTradeQuote, loading, error} = usePromise(_tradeFunc, false);//dont wait for a value fo resume
    
    const update = useCallback((forceUpdate)=>{
        if(params){
            getTradeQuote(forceUpdate??false, params).then(({result, verified})=>{
                if(verified)
                    updateCurrentTrade(result);
            });
        }
    },[params]);

    const outputValue = useMemo(()=>data?amountFixed(data.outputAmount):"0.0", [data]);
    
    return {data, outputValue, exist, update, loading, error, params}
}

const swapTradeContext = createContext();

const useSwapTrade = ()=>useContext(swapTradeContext);

export const SwapTradeProvider = ({children})=>{
    const swapWrap = useSwapTradeWrap();

    return (
        <swapTradeContext.Provider value={swapWrap}>
            {children}
        </swapTradeContext.Provider>
    )
}

export default useSwapTrade;

export const useSwapTradeUpdated = ()=>{
    const trade = useSwapTrade();
    
    useEffect(()=>{
        console.log("calling trade update");
        trade.update();
    },[trade.update]);

    return trade;
}