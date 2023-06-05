import Link from 'next/link'
import {useMemo, useCallback} from 'react'
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, Divider, Link as MuiLink} from "@mui/material";
import { Check} from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { LOGO} from '.'
import useSwapModal from "../../context/swap/hooks/useSwapModal";

import useSwapCall from "../../context/swap/hooks/useSwapCall";
import { amountFixed } from "../../swap/src/smart/_utils";
import useSwapTx from '../../context/swap/hooks/useSwapTx';

const SwapMiniAmount = ({amount})=>{
    const value = useMemo(()=>amountFixed(amount),[amount]);
    return (
        <Stack direction="row" alignItems="center">
            <Avatar src={LOGO} sx={{bgcolor:"#333", width:"30px", height:"30px"}}/>
            <Typography>{value} {amount.currency.symbol}</Typography>
        </Stack>
    )
}

export default ()=>{

    const {toggle} = useSwapModal();
    const {trade} = useSwapCall();
    
    const toggleClose = useCallback(()=>toggle('success'),[toggle]);
    const {data:{explorer}} = useSwapTx();

    return (
        <Stack gap={1} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack gap={1} alignItems="center">
                <Check color="success" sx={{fontSize:"5rem"}}/>
                <Typography>Transaction Submitted</Typography>
                <Stack direction="row" gap={1} alignItems="center">
                    <SwapMiniAmount amount={trade.inputAmount}/>
                    <ArrowForward/>
                    <SwapMiniAmount amount={trade.outputAmount}/>
                </Stack>
            </Stack>
            <Divider/>
            <Stack alignItems="end">
                <MuiLink
                    component={Link}
                    href={explorer?.url}
                    target="_blank"
                    sx={{
                        color:"#3333ff",
                        cursor:"pointer",
                        "&:hover":{
                            textDecoration:"underline"
                        },
                        "&:active":{
                            color:"#ff8888"
                        }
                    }}
                    variant="subtitle2"
                >
                    View on {explorer?.name||"explorer"}
                </MuiLink>
            </Stack>
            <Button size="large" variant="contained" onClick={toggleClose}>Close</Button>
        </Stack>
    );
}

