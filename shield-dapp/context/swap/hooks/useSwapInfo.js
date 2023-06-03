import {useMemo} from 'react';
import {useSelector} from 'react-redux'
const {SmartRouter} = require("@pancakeswap/smart-router/evm");
import { createSelector } from '@reduxjs/toolkit';
import { Percent } from '@pancakeswap/sdk';

const _selector = createSelector(state=>state.swap.settings,
    settings=>({tolerance:settings.tolerance})
);

export default (trade) =>{
    const {tolerance} = useSelector(_selector);//slippageTolerance
    const executionPrice = useMemo(()=>trade && SmartRouter.getExecutionPrice(trade),[trade]);
    const slippage = useMemo(()=>new Percent(tolerance, 10_000),[tolerance]);
    const minimumAmountOut = useMemo(()=>trade && SmartRouter.minimumAmountOut(trade, slippage),[trade, slippage]);
    const maximumAmountIn = useMemo(()=>trade && SmartRouter.maximumAmountIn(trade, slippage),[trade, slippage])
    

    return ({
        slippage,
        executionPrice,
        minimumAmountOut,
        maximumAmountIn
    });
}