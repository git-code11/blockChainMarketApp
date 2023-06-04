import { useCallback, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";

const {SmartRouter} = require("@pancakeswap/smart-router/evm") ;

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
    const {serializedTrade, ...options} = useSelector(_selector);

    const trade = useMemo(()=>{
        if(serializedTrade.chainId && serializedTrade.value){
            return SmartRouter.Transformer.parseTrade(serializedTrade.chainId, serializedTrade.value);
        }
        return null;
    },[serializedTrade]);


    const getCalldata = useCallback(()=>{
        if(trade){
            return prepareTradeCallData(
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

    return {trade, getCalldata}

}