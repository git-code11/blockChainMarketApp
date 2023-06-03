import { useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, IconButton } from "@mui/material";
import { Close} from "@mui/icons-material";
import {LOGO} from '.'

import useSwapModal from "../../context/swap/hooks/useSwapModal";

import useSwapCall from "../../context/swap/hooks/useSwapCall";
import { amountFixed } from "../../swap/src/smart/_utils";


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

export default ()=>{
    const {toggle} = useSwapModal();

    const toggleClose = useCallback(()=>toggle('confirm'),[toggle])

    const {trade} = useSwapCall();
    
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
            <Button size="large" variant="contained">COnfirm Swap</Button>
        </Stack>
    );
}