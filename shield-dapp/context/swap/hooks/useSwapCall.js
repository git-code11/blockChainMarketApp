import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const {SmartRouter} = require("@pancakeswap/smart-router/evm") ;

import { actions } from "../reducer";
import { prepareTradeCallData } from "../../../swap/src/smart/_prepare";

import { createSelector } from "@reduxjs/toolkit";

const _selector = createSelector(state=>state.swap,
    swap=>({
        serializedTrade:swap.tradeVault,
        slippageTolerance:swap.settings.tolerance,
        deadlineOrPreviousBlockhash:swap.settings.deadline,
        admin:swap.admin.account,
        feeBips:swap.admin.feeBips
    })
);

export default ()=>{
    const dispatch = useDispatch();
    const {serializedTrade, ...options} = useSelector(_selector);

    const trade = useMemo(()=>{
        if(serializedTrade.chainId && serializedTrade.value){
            return SmartRouter.Transformer.parseTrade(serializedTrade.chainId, serializedTrade.value);
        }
        return null;
    },[serializedTrade]);

    const calldata = useMemo(()=>{
        if(trade){
            prepareTradeCallData(
                {
                    trade,
                    chainId:trade.inputAmount.currency.chainId??trade.outputAmount.currency.chainId,
                    options:{
                        ...options
                    }
                })
        }
        return null;
    },[trade, options])

    const lock = useCallback(()=>{
        dispatch(actions.lockTrade());
    },[dispatch]);

    
    return {trade, calldata, lock}

}