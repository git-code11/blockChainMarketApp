import Link from 'next/link'
import {useMemo, useCallback} from 'react'
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, Divider, Link as MuiLink} from "@mui/material";
import { Check} from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import useSwapModal from "../../context/swap/hooks/useSwapModal";

import useSwapCall from "../../context/swap/hooks/useSwapCall";
import { amountFixed } from "../../swap/src/smart/_utils";
import useSwapTx from '../../context/swap/hooks/useSwapTx';
import useTokenLogo from '../../token_info/useTokenLogo';
import {lightGreen} from '@mui/material/colors'

const SwapMiniAmount = ({amount})=>{
    const token_logo = useTokenLogo(amount.currency);
    const value = useMemo(()=>amountFixed(amount),[amount]);
    return (
        <Stack direction="row" alignItems="center">
            <Avatar src={token_logo} sx={{width:"30px", height:"30px"}}/>
            <Typography color="grey.400">{value} {amount.currency.symbol}</Typography>
        </Stack>
    )
}

export default ()=>{

    const {toggle} = useSwapModal();
    const {trade} = useSwapCall();
    
    const toggleClose = useCallback(()=>toggle('success'),[toggle]);
    const {data:{explorer}} = useSwapTx();

    return (
        <Stack gap={1} p={2} bgcolor="primary.main" component={Paper}>
            <Stack gap={1} alignItems="center">
                <Check color="success" sx={{fontSize:"5rem"}}/>
                <Typography color="grey.400">Transaction Submitted</Typography>
                <Stack direction="row" gap={1} alignItems="center">
                    <SwapMiniAmount amount={trade.inputAmount}/>
                    <ArrowForward/>
                    <SwapMiniAmount amount={trade.outputAmount}/>
                </Stack>
            </Stack>
            <Divider/>
            <Stack alignItems="end">
                <Typography
                    component={Link}
                    href={explorer?.url}
                    target="_blank"
                    sx={{
                        color:lightGreen[500],
                        cursor:"pointer",
                        "&:hover":{
                            textDecoration:"underline"
                        },
                        "&:active":{
                            color:lightGreen[700]
                        }
                    }}
                    variant="subtitle2"
                >
                    View on {explorer?.name||"explorer"}
                </Typography>
            </Stack>
            <Button size="large" variant="contained" onClick={toggleClose}>Close</Button>
        </Stack>
    );
}

