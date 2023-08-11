import {useCallback, useMemo} from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Input,
    Typography, IconButton, InputAdornment, CircularProgress} from "@mui/material";
import {AllOut, Update} from "@mui/icons-material";

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapInput from '../../../context/swap/hooks/useSwapInput';
import useSwapOutput from '../../../context/swap/hooks/useSwapOutput';
import { useSwapCurrency } from '../../../context/swap/hooks/currency';
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';
import useTokenLogo from '../../../token_info/useTokenLogo';
import SwapCurrencyBalance from './SwapCurrencyBalance';

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
                    <CircularProgress size={25} color="basic"/>:
                    <IconButton onClick={updateClick} sx={{color:"grey.300"}}>
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
    const {result} = useSwapBalance(currency);

    const onInput = useCallback(e=>update({amount:e.target.value.trim()}),[update]);

    const inputMaxDisabled = !Boolean(result);
    
    const inputMax = useCallback(()=>{
        if(Boolean(result)){
            update({
                amount:result.formatted,
            })
        }
    },[inputMaxDisabled, result, update]);

    return <SwapFieldBase
                value={data.amount}
                currency={currency}
                disabled={false}
                onInput={onInput}
                onSelect={toggleSelect}
                endIcon={
                    <IconButton disabled={inputMaxDisabled} onClick={inputMax} sx={{color:"grey.300"}}>
                        <AllOut/>
                    </IconButton>
                }
            /> 
}

const SwapFieldAvatar = ({currency})=>{
    const token_logo = useTokenLogo(currency);
    return (
        <Avatar src={token_logo} sx={{width:"50px", height:"50px"}}/>
    )
}


const SwapFieldBase = ({currency, value, disabled, onInput, onSelect, endIcon})=>{
    
    return (
        <Stack gap={2} p={1} direction="row" component={Paper} bgcolor="transparent" alignItems="end">
            <Stack component={Button} alignItems="center" gap={0.5} onClick={onSelect}>
                <SwapFieldAvatar currency={currency}/> 
                <Typography color="secondary" fontWeight="bold">{currency?.symbol??"- - -"}</Typography>
            </Stack>
            <Stack flex={1} justifyContent="space-between">
                <Input 
                    color="secondary"
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
                            textAlign:"end",
                            color:"basic.light",
                            "&.Mui-disabled":{
                                "WebkitTextFillColor":"unset"
                            }
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