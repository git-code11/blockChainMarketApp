import Link from 'next/link';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Button, Typography, Alert } from "@mui/material";
import { Warning } from "@mui/icons-material";
import useSwapModal from "../../context/swap/hooks/useSwapModal";
import { useCallback } from "react";
import useSwapTx from "../../context/swap/hooks/useSwapTx";
import { red } from "@mui/material/colors"

export default ()=>{

    const {toggle} = useSwapModal();
    const {data} = useSwapTx();

    const toggleClose = useCallback(()=>toggle('failed'),[toggle]);

    return (
        <Stack gap={2} p={2} bgcolor="primary.main" component={Paper}>
            <Stack gap={2} alignItems="center">
                <Warning color="error" sx={{fontSize:"5rem"}}/>
                <Typography color="grey.400">Transaction Failed</Typography>
                <Alert severity="error" variant="outlined">
                    <Typography color="error" variant="body2" fontStyle="italic">
                        {data.error||"Unable to prepare Transaction"}
                    </Typography>
                </Alert>
                <Typography variant="subtitle2" color="grey.400">
                    Try Increasing your slippage tolerance.<br/>
                    Note: fee on transfer and rebase are incompatible with PancakeSwap V3.
                </Typography>
                {data.explorer && 
                        <Typography 
                            sx={{
                                color:red[700]
                            }} 
                            component={Link} 
                                href={data.explorer.url}>
                                    view on {data.explorer.name}
                        </Typography>
                }
            </Stack>
            <Button size="large" variant="contained" onClick={toggleClose}>Dismiss</Button>
        </Stack>
    );
}