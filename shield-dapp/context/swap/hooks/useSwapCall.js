import { useCallback} from "react";
import { useSelector } from "react-redux";

import { prepareTradeCallData } from "../../../swap/src/smart/_prepare";

import { createSelector } from "@reduxjs/toolkit";
import { useDeserializeTrade } from "./trade";

const _selector = createSelector(state=>state.swap,
    swap=>({
        serializedTrade:swap.tradeVault,
        slippageTolerance:swap.settings.tolerance,
        deadlineOrPreviousBlockhash:swap.settings.deadline,
        admin:swap.admin.account,
        feeBips:swap.admin.feeBips
    })
);

const usePrepareTradeCallData = (trade, options)=>{
    return useCallback(()=>{
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
    },[trade, options]);

}

export default ()=>{
    const {serializedTrade, ...options} = useSelector(_selector);

    const trade = useDeserializeTrade(serializedTrade);

    const getCalldata = usePrepareTradeCallData(trade, options);

    return {trade, getCalldata}

}