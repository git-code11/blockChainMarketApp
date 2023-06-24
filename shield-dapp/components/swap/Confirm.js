import { useCallback, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, IconButton, Alert } from "@mui/material";
import { Close} from "@mui/icons-material";

import useSwapModal from "../../context/swap/hooks/useSwapModal";

import useSwapCall from "../../context/swap/hooks/useSwapCall";
import { amountFixed } from "../../swap/src/smart/_utils";
import useSwapApprove from "../../context/swap/hooks/useSwapApprove";
import useSwapSendTransaction from "../../context/swap/hooks/useSwapSendTransaction";
import useSwapRouterAddress from "../../context/swap/hooks/useSwapRouterAddress";
import e_msg from "../../context/lib/e_msg";
import {LoadingButton} from "@mui/lab";
import useSwapTx from "../../context/swap/hooks/useSwapTx";
import useSwapTrade from "../../context/swap/hooks/trade";
import useTokenLogo from "../../token_info/useTokenLogo";
import {red} from "@mui/material/colors"

const SwapRecieveToken = ({amount})=>{

    const value = useMemo(()=>amountFixed(amount),[amount]);
    const token_logo = useTokenLogo(amount.currency);

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack gap={1} direction="row" alignItems="center">
                <Avatar src={token_logo} sx={{bgcolor:"#444"}}/>
                <Typography fontFamily="monospace" fontSize="24px" fontWeight="bold" color="grey.400">{value}</Typography>
            </Stack>
            <Typography fontSize="20px" fontWeight="bold" color="grey.400">{amount.currency.symbol}</Typography>
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
            <Typography fontStyle="italic" color="grey.400">
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
        trade.inputAmount.currency,
        trade.inputAmount.quotient,
        spender
    );

    const approveBtnEnabled = useMemo(()=>!approve.isApproved && trade.inputAmount.currency.isToken,[trade, approve]);

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
                        Approval Successful
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

        <SwapSendTxContainer {...{trade, getCalldata}} enabled={approve.isApproved || trade.inputAmount.currency.isNative}/>
        
        </Stack>
    )
}


const SwapSendTxContainer = ({trade, getCalldata, enabled=true})=>{
    const swap = useSwapTrade();
    const {toggle} = useSwapModal();

    const calldata = useMemo(()=>{
        
        if(enabled)
            return getCalldata();
        else
            return null;
    }
    ,[getCalldata, enabled]);//[] empty to be called only on mondal creation



    const method = useSwapSendTransaction(calldata, enabled);

    const tx = useSwapTx();

    useEffect(()=>{
        if(method.success || method.error){
            tx.update({...method, chainId:trade?.inputAmount?.currency?.chainId});//save tx
            //method.reset();
            toggle(method.success?"success":"failed");
            
            if(!swap.loading){
                setTimeout(()=>swap.update(true),0);//let refetching take place due to transaction after 5sec
            }
        }
    },[method.success, method.error, swap]);

    const btnEnabled = useMemo(()=>enabled && trade,[trade, enabled]);
    
    return (
        btnEnabled &&
            <LoadingButton size="large" variant="contained"
                color="basic"
                disabled={!Boolean(method.sendTransaction) || method.success || method.loading}
                loading={method.loading}
                onClick={()=>method.sendTransaction?.()}
            >
                <b>Confirm Swap</b>
            </LoadingButton>
    )
}

export default ()=>{
    const {toggle} = useSwapModal();

    const toggleClose = useCallback(()=>toggle('confirm'),[toggle])

    const {trade, getCalldata} = useSwapCall();

    
    return (
        trade &&
        <Stack gap={2} p={2} bgcolor="primary.main" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold" color="grey.400">Confirm Swap</Typography>
                <IconButton onClick={toggleClose} sx={{color:red[500]}}>
                    <Close/>
                </IconButton>
            </Stack>
            <SwapRecieve trade={trade}/>
            <SwapApproveContainer {...{trade, getCalldata}}/>
        </Stack>
    );
}