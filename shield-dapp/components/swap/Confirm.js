
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, IconButton } from "@mui/material";
import { Close} from "@mui/icons-material";
import {LOGO} from '.'


const SwapRecieveToken = ()=>{

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack gap={1} direction="row" alignItems="center">
                <Avatar src={LOGO} sx={{bgcolor:"#444"}}/>
                <Typography fontFamily="monospace" fontSize="24px" fontWeight="bold">0.23</Typography>
            </Stack>
            <Typography fontSize="20px" fontWeight="bold">DAI</Typography>
        </Stack>
    );
}

const SwapRecieve = ()=>{
    return (
        <Stack gap={2}>
            <SwapRecieveToken/>
            <SwapRecieveToken/>            
            <Typography fontStyle="italic">
                Output is estimated.
                You will recieve at least 74.7232 DAI or 
                transaction will revert
            </Typography>
        </Stack>
    );
}

export default ()=>{
    return (
        <Stack gap={2} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Confirm Swap</Typography>
                <IconButton>
                    <Close/>
                </IconButton>
            </Stack>
            <SwapRecieve/>
            <Button size="large" variant="contained">COnfirm Swap</Button>
        </Stack>
    );
}