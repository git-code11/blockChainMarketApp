

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Button, Input, Typography, IconButton, InputAdornment } from "@mui/material";
import { Close} from "@mui/icons-material";


const Tolerance = ()=>{

    return (
        <Stack gap={1}>
            <Typography>Slippage Tolerance <i>(%)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {["0.5", "1", "5", "10"].map(i=><Button variant="outlined">{i}</Button>)}
            </Stack>
            <Input
                sx={{
                    ".MuiInput-input":{
                        textAlign:"center"
                    }
                }}
                defaultValue="1"
                endAdornment={
                    <InputAdornment position="end">
                        <b>%</b>
                    </InputAdornment>
                }
                />
        </Stack>
    );
}

const Deadline = ()=>{

    return (
        <Stack gap={1}>
            <Typography>Transaction Deadline<i>(minutes)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {["5", "10", "15", "20"].map(i=><Button variant="outlined">{i}</Button>)}
            </Stack>
            <Input
                sx={{
                    ".MuiInput-input":{
                        textAlign:"center"
                    }
                }}
                defaultValue="10"
                endAdornment={
                    <InputAdornment position="end">
                        <b>minutes</b>
                    </InputAdornment>
                }
                />
        </Stack>
    );
}

const PoolTier = ()=>{

    return (
        <Stack gap={1}>
            <Typography>Pool Fee Tier</Typography>
            <Stack direction="row" justifyContent="space-between">
                {["0.25", "0.50", "0.75", "1.00"].map(i=><Button variant="outlined">{i}</Button>)}
            </Stack>
            <Input
                sx={{
                    ".MuiInput-input":{
                        textAlign:"center"
                    }
                }}
                defaultValue="0.50"
                endAdornment={
                    <InputAdornment position="end">
                        <b>tier</b>
                    </InputAdornment>
                }
                />
        </Stack>
    );
}

export default ()=>{
    
    return (
        <Stack gap={2} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Configuration</Typography>
                <IconButton>
                    <Close/>
                </IconButton>
            </Stack>
            <Tolerance/>
            <Deadline/>
            <PoolTier/>
            <Button size="large" variant="contained">Save</Button>
        </Stack>
    );
}

