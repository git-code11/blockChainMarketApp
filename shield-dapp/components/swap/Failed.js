
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";


export default ()=>{
    return (
        <Stack gap={2} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack gap={2} alignItems="center">
                <Warning color="error" sx={{fontSize:"5rem"}}/>
                <Typography>Transaction Failed</Typography>
                <Typography variant="subtitle2">
                    Try Increasing your slippage tolerance.
                    Note: fee on transfer and rebase are incompatible with PancakeSwap V3.
                </Typography>
            </Stack>
            <Button size="large" variant="contained">Dismiss</Button>
        </Stack>
    );
}