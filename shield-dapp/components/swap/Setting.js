
import {useCallback} from 'react';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Button, Input as MuiInput, Typography, IconButton, InputAdornment } from "@mui/material";
import { Close, Edit} from "@mui/icons-material";
import useSwapSettings from '../../context/swap/hooks/useSwapSettings';
import useSwapModal from '../../context/swap/hooks/useSwapModal';

import { red, grey } from "@mui/material/colors"
import {styled} from "@mui/material/styles"

const Input = styled(props=><MuiInput color='basic' {...props}/>)(({theme})=>({
    
    /* "&.MuiInput-root":{
        "&:before":{
            borderBottom:`1px solid ${grey[400]}`
        },
        "&:hover:before":{
            borderBottom:`2px solid ${grey[400]}`
        },
        "&:after":{
            borderBottom:`2px solid ${theme.palette.basic.main}`
        }
    },
 */
    ".MuiInput-input":{
        color:theme.palette.basic.main,
        textAlign:"center",
    },
   
    ".MuiInputAdornment-root":{
        color:grey[400],
    }
}));


const bpsToPercent = d=>d/100;
const percentToBps = d=>d*100;

const Tolerance = ()=>{
    const {data, update} = useSwapSettings();
    const updateSlip = useCallback((tolerance)=>{
        tolerance ||= 0;
        update({tolerance});
    },[update]);



    return (
        <Stack gap={1}>
            <Typography color="grey.400">Slippage Tolerance <i>(bips&lt; 0.01% &gt;)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {[3, 5, 10, 15, 20].map(i=>//1bps = 0.01 
                            <Button key={i} variant="outlined"
                                    onClick={()=>updateSlip(percentToBps(i))}
                                    color={bpsToPercent(data.tolerance) === i?"basic":"secondary"}
                                    >{i}
                                </Button>
                        )}
            </Stack>
            <Input
                value={data.tolerance}
                onChange = {e=>updateSlip(+e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <Typography variant='subtitle2'
                        >{bpsToPercent(data.tolerance)?.toFixed(2)}%</Typography>
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
            <Typography color="grey.400">Transaction Deadline<i>(minutes)</i></Typography>
            <Stack direction="row" justifyContent="space-between">
                {[5, 10, 15, 20].map(i=>
                    <Button key={i} variant="outlined"
                    onClick={()=>updateSlip(i)}
                    color={data.deadline === i?"basic":"secondary"}
                >{i}</Button>)}
            </Stack>
            <Input
                value={data.deadline}
                onChange = {e=>updateSlip(+e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <Typography variant='subtitle2'>
                        {(data.deadline/60)?.toFixed(2)}hr
                        </Typography>
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
            <Typography color="grey.400">Pool Tier</Typography>
            <Stack direction="row" justifyContent="space-between">
                {["V2", "V3", "STABLE"].map(i=>
                    <Button key={i} variant="outlined" 
                    onClick={()=>updateSlip(i)}
                    color={data.pool[i]?"basic":"secondary"}
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
        <Stack gap={2} p={2} bgcolor="primary.dark" component={Paper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold" color="grey.400">Configuration</Typography>
                <IconButton onClick={toggleClose} sx={{color:red[500]}}>
                    <Close/>
                </IconButton>
            </Stack>
            <Tolerance/>
            <Deadline/>
            <PoolTier/>
        </Stack>
    );
}

