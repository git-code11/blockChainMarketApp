
import {useCallback} from 'react';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Button, Input, Typography, IconButton, InputAdornment } from "@mui/material";
import { Close} from "@mui/icons-material";
import useSwapSettings from '../../context/swap/hooks/useSwapSettings';
import useSwapModal from '../../context/swap/hooks/useSwapModal';

const Tolerance = ()=>{
    const {data, update} = useSwapSettings();
    const updateSlip = useCallback((tolerance)=>{
        tolerance ||= 0;
        update({tolerance});
    },[update]);

    return (
        <Stack gap={1}>
            <Typography>Slippage Tolerance <i>(bips&lt; 0.1% &gt;)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {[1, 10, 20, 30].map(i=>
                            <Button key={i} variant="outlined"
                                    onClick={()=>updateSlip(i)}
                                    color={data.tolerance === i?"success":"warning"}
                                    >{i}
                                </Button>
                        )}
            </Stack>
            <Input
                sx={{
                    ".MuiInput-input":{
                        textAlign:"center"
                    }
                }}
                value={data.tolerance}
                onChange = {e=>updateSlip(+e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <b>{(0.01 * data.tolerance)?.toFixed(2)}%</b>
                    </InputAdornment>
                }
                />
        </Stack>
    );
}

const Deadline = ()=>{

    const {data, update} = useSwapSettings();
    
    const updateSlip = useCallback((deadline)=>{
        deadline ||= 0;
        update({deadline});
    },[update]);

    return (
        <Stack gap={1}>
            <Typography>Transaction Deadline<i>(minutes)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {[5, 10, 15, 20].map(i=>
                    <Button key={i} variant="outlined"
                    onClick={()=>updateSlip(i)}
                    color={data.deadline === i?"success":"warning"}
                >{i}</Button>)}
            </Stack>
            <Input
                sx={{
                    ".MuiInput-input":{
                        textAlign:"center"
                    }
                }}
                value={data.deadline}
                onChange = {e=>updateSlip(+e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <b>{(data.deadline/60)?.toFixed(2)}hr</b>
                    </InputAdornment>
                }
                />
        </Stack>
    );
}

const PoolTier = ()=>{

    const {data, update} = useSwapSettings();
    
    const updateSlip = useCallback((key)=>{
        if(key)
            update({
                pool:{
                    [key]:!data.pool[key]
                }
            });
    },[update, data]);

    return (
        <Stack gap={1}>
            <Typography>Pool Tier</Typography>
            <Stack direction="row" justifyContent="space-between">
                {["V2", "V3", "STABLE"].map(i=>
                    <Button key={i} variant="outlined" 
                    onClick={()=>updateSlip(i)}
                    color={data.pool[i]?"success":"warning"}
                    >{i}</Button>)}
            </Stack>
        </Stack>
    );
}

export default ()=>{
    const {toggle} = useSwapModal();

    const toggleClose = useCallback(()=>{
        toggle('settings');
    },[])

    return (
        <Stack gap={2} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Configuration</Typography>
                <IconButton onClick={toggleClose}>
                    <Close/>
                </IconButton>
            </Stack>
            <Tolerance/>
            <Deadline/>
            <PoolTier/>
        </Stack>
    );
}

