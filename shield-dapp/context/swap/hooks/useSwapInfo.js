import {useMemo} from 'react';
import {useSelector} from 'react-redux'
import { createSelector } from '@reduxjs/toolkit';
import { Percent } from '@pancakeswap/sdk';

import {
    utils as SmartUtils
} from "../../../swap/src/smart";
import useSwapTokenRisk from './useSwapTokenRisk';

const _selector = createSelector(state=>state.swap.settings,
    settings=>({tolerance:settings.tolerance})
);

export default (trade) =>{
    const {tolerance} = useSelector(_selector);//slippageTolerance
    const executionPrice = useMemo(()=>trade && SmartUtils.getExecutionPrice(trade),[trade]);
    const slippage = useMemo(()=>new Percent(tolerance, 10_000),[tolerance]);
    const minimumAmountOut = useMemo(()=>trade && SmartUtils.minimumAmountOut(trade, slippage),[trade, slippage]);
    const maximumAmountIn = useMemo(()=>trade && SmartUtils.maximumAmountIn(trade, slippage),[trade, slippage])
    const {data:tokenRisk} = useSwapTokenRisk(trade && trade.outputAmount.currency);
    
    return ({
        slippage,
        executionPrice,
        minimumAmountOut,
        maximumAmountIn,
        tokenRisk 
    });
}