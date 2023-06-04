import { useCallback, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, IconButton, Alert } from "@mui/material";
import { Close} from "@mui/icons-material";
import {LOGO} from '.'

import useSwapModal from "../../context/swap/hooks/useSwapModal";

import useSwapCall from "../../context/swap/hooks/useSwapCall";
import { amountFixed } from "../../swap/src/smart/_utils";
import useSwapApprove from "../../context/swap/hooks/useSwapApprove";
import useSwapSendTransaction from "../../context/swap/hooks/useSwapSendTransaction";
import useSwapRouterAddress from "../../context/swap/hooks/useSwapRouterAddress";
import e_msg from "../../context/lib/e_msg";
import {LoadingButton} from "@mui/lab";
import useSwapTx from "../../context/swap/hooks/useSwapTx";
import useSwapTrade from "../../context/swap/hooks/useSwapTrade";

const SwapRecieveToken = ({amount})=>{

    const value = useMemo(()=>amountFixed(amount),[amount]);

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack gap={1} direction="row" alignItems="center">
                <Avatar src={LOGO} sx={{bgcolor:"#444"}}/>
                <Typography fontFamily="monospace" fontSize="24px" fontWeight="bold">{value}</Typography>
            </Stack>
            <Typography fontSize="20px" fontWeight="bold">{amount.currency.symbol}</Typography>
        </Stack>
    );
}

const SwapRecieve = ({trade})=>{
    const minAmountOut = useMemo(()=>amountFixed(trade.outputAmount),[trade]);
    const symbolOut = useMemo(()=>trade.outputAmount.currency.symbol,[trade]);

    return (
        <Stack gap={2}>
            <SwapRecieveToken amount={trade.inputAmount}/>
            <SwapRecieveToken amount={trade.outputAmount}/>            
            <Typography fontStyle="italic">
                Output is estimated.
                You will recieve at least {minAmountOut} {symbolOut} or 
                transaction will revert
            </Typography>
        </Stack>
    );
}

const SwapApproveContainer = ({trade, getCalldata})=>{

    const spender = useSwapRouterAddress(trade.inputAmount.currency);

    const approve = useSwapApprove(
        trade.inputAmount.currency.address,
        trade.inputAmount.quotient,
        spender
    );

    const approveBtnEnabled = useMemo(()=>approve.notApproved && trade.inputAmount.currency.isToken,[trade, approve]);

    return (
        <Stack spacing={1}>
            {
                approve.error && 
                <Alert color="error">
                    <Typography>
                        {e_msg(approve.error)}
                    </Typography>
                </Alert>
            }

            {
                approve.success && 
                <Alert>
                    <Typography>
                        RequestId {approve.tx.transactionHash}
                    </Typography>
                </Alert>
            }

        {   approveBtnEnabled &&
            <LoadingButton size="large" variant="contained"
                disabled={!Boolean(approve.write)}
                loading={approve.loading}
                onClick={()=>approve.write?.()}
            >
                <span>Approve</span>
            </LoadingButton>
        }

        {
             !approve.notApproved  &&
             <SwapSendTxContainer {...{trade, getCalldata}}/>
        }
        </Stack>
    )
}


const SwapSendTxContainer = ({trade, getCalldata, enabled=true})=>{
    const swap = useSwapTrade();
    const {toggle} = useSwapModal();

    const calldata = useMemo(()=>{
        console.log("updating calldata");
        return getCalldata();
    }
    ,[getCalldata]);//[] empty to be called only on mondal creation

    const method = useSwapSendTransaction(calldata);

    const tx = useSwapTx();

    useEffect(()=>{
        if(method.success || method.error){
            tx.update(method);//save tx
            method.reset();
            toggle(method.success?"success":"error");
            if(!swap.loading)
                swap.update(true);//let refetching take place due to transaction
        }
    },[method.success, method.error, swap]);

    const btnEnabled = useMemo(()=>enabled && trade,[trade, enabled]);
    
    return (
        btnEnabled &&
            <LoadingButton size="large" variant="contained"
                disabled={!Boolean(method.sendTransaction) || method.success || method.loading}
                loading={method.loading}
                onClick={()=>method.sendTransaction?.()}
            >
                <span>Confirm Swap</span>
            </LoadingButton>
    )
}

export default ()=>{
    const {toggle} = useSwapModal();

    const toggleClose = useCallback(()=>toggle('confirm'),[toggle])

    const {trade, getCalldata} = useSwapCall();

    
    return (
        trade &&
        <Stack gap={2} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Confirm Swap</Typography>
                <IconButton onClick={toggleClose}>
                    <Close/>
                </IconButton>
            </Stack>
            <SwapRecieve trade={trade}/>
            <SwapApproveContainer {...{trade, getCalldata}}/>
        </Stack>
    );
}