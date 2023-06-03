import {useCallback} from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Input,
    Typography, IconButton, InputAdornment, CircularProgress} from "@mui/material";
import {AllOut, Update} from "@mui/icons-material";
import {LOGO} from '..'

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapInput from '../../../context/swap/hooks/useSwapInput';
import useSwapOutput from '../../../context/swap/hooks/useSwapOutput';
import { useSwapCurrency } from '../../../context/swap/hooks/currency';
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';


const SwapCurrencyBalance = ({currency})=>{
    const {value} = useSwapBalance(currency)
    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography>$2,301.05</Typography>
            <Typography>Bal: {value?value:'- - -'}</Typography>
        </Stack>
    )
}

export const SwapFieldOutput = ({trade})=>{
    const {toggle} = useSwapModal();
    const toggleSelect = useCallback(()=>toggle("select", 2),[toggle]);

    const {data} = useSwapOutput();
    const {loading, outputValue} = trade;

    const currency = useSwapCurrency(data.currency);

    const updateClick = useCallback(()=>{
        if(trade.loading)
            return;
        trade.update(true);
    },[trade]);

    return <SwapFieldBase
                currency={currency}
                value={outputValue}
                disabled={true}
                onSelect={toggleSelect}
                endIcon={
                    loading?
                    <CircularProgress size={25}/>:
                    <IconButton onClick={updateClick}>
                        <Update/>
                    </IconButton>
                }
            /> 
}

export const SwapFieldInput = ()=>{
    const {toggle} = useSwapModal();
    const toggleSelect = useCallback(()=>toggle("select", 1),[toggle]);

    const {data, update} = useSwapInput();

    const currency = useSwapCurrency(data.currency);

    const onInput = useCallback(e=>update({amount:e.target.value.trim()}),[update]);

    return <SwapFieldBase
                value={data.amount}
                currency={currency}
                disabled={false}
                onInput={onInput}
                onSelect={toggleSelect}
                endIcon={
                    <IconButton>
                        <AllOut/>
                    </IconButton>
                }
            /> 
}


const SwapFieldBase = ({currency, value, disabled, onInput, onSelect, endIcon})=>{

    return (
        <Stack gap={2} p={1} direction="row" component={Paper} alignItems="end">
            <Stack component={Button} alignItems="center" gap={0.5} onClick={onSelect}>
                <Box 
                    sx={{
                        borderRadius:1,
                        boxShadow:"0 0 0 2px #454545",
                        bgcolor:"orange"
                    }}>
                    <Avatar src={LOGO} sx={{width:"50px", height:"50px"}}/>
                </Box>
                <Typography fontWeight="bold">{currency?.symbol??"- - -"}</Typography>
            </Stack>
            <Stack flex={1} justifyContent="space-between">
                <Input 
                    disabled={disabled}
                    value={value}
                    onChange={onInput}
                    placeholder={"0.0"}
                    align="end"
                    margin="dense"
                    sx={{
                        fontFamily:"monospace",
                        fontWeight:"800",
                        fontSize:"2.5rem",
                        ".MuiInput-input":{
                            textAlign:"end"
                        }
                    }}
                    fullWidth
                    endAdornment={
                    <InputAdornment position="end">
                            {endIcon}
                    </InputAdornment>
                    }/>
                <SwapCurrencyBalance currency={currency}/>
            </Stack>
        </Stack>
    );
}