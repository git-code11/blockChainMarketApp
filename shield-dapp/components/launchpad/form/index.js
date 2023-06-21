import {useMemo} from 'react'
import { useController, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useDebounce } from 'use-debounce';
import usePredictAmount,{predictAmountParams} from '../../../context/hook/app/factory/launch/usePredictAmount';
import { formatUnits } from 'ethers/lib/utils.js';
import useCurrency from '../../../context/hook/useCurrency';

export const Input =  ({name, ...props})=>{
    const {field, fieldState:{error}} = useController({name});
    
    return (
        <TextField 
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value??""}
            name={field.name}
            inputRef={field.ref}
            error={Boolean(error)}
            helperText={error?.message ?? props.helperText}
        />
    )
}

export const CheckInput = ({name, label, disabled, ...props})=>{
    const {field} = useController({name});

    return (
        <FormControlLabel 
            label={label}
            disabled={disabled}
            control={
                <Checkbox
                    {...props}
                    checked={field.value??false}
                    onChange={field.onChange}
                    />
            }
        />
    )
    
}

export const RadioInput = ({name, data, disabled, ...props})=>{
    const {field} = useController({name});
    
    return(
        <RadioGroup
            value={field.value??""}
            name={field.name}
            onChange={field.onChange}
        >
            {
                Object.entries(data).map(([value, label])=>
                    <FormControlLabel
                        key={value}
                        label={label}
                        disabled={disabled}
                        control={
                            <Radio
                                value={value}
                                />
                        }
                    />
                )
            }
        </RadioGroup>
    )
}


export const useFormTokenDetails = (name)=>{
    const {watch} = useFormContext();
    const address = watch(name);
    const [tokenAddr] = useDebounce(address, 500);

    const method = useCurrency(tokenAddr);

    return method;
}


export const InputWithSymbol = ({tokenField, ...props})=>{
    const {data} = useFormTokenDetails(tokenField);
    
    return(
        <Input {...props}
            InputProps={{endAdornment:<InputAdornment position="end">
                {data?.symbol??"- - -"}
            </InputAdornment>}}/>
    )
}

export const InputWithBuySymbol = props=><InputWithSymbol tokenField={"token.buyToken"} {...props}/>

export const InputWithLaunchSymbol = props=><InputWithSymbol tokenField={"token.address"} {...props}/>

export const useFormPredictAmount = ()=>{
    const {watch} = useFormContext();
    const data = watch(["launch.capped", "launch.preSale","launch.dexSale", "launch.swapLiquidityPercent", "token.feeTier"]);
    const [debounceData] = useDebounce(data, 500);
    const {data:tk, isSuccess} = useFormTokenDetails("token.address");

    const params = useMemo(()=>
    debounceData.slice(0, 4).every(d=>Number(d)>0) ? predictAmountParams({
            capped:debounceData[0],
            saleRate:debounceData[1],
            dexRate:debounceData[2],
            dexBps:debounceData[3],
            feeTier:debounceData[4],
            decimals:tk?.decimals
        }):{}
        ,[debounceData, tk?.decimals])
    
    const {data:raw, ...method} = usePredictAmount({
        params,
        enabled:isSuccess && Boolean(params)
    });

    const result = useMemo(()=>raw && formatUnits(raw, tk?.decimals),[raw, tk?.decimals]);

    return {data:result, raw, token: tk,...method};
}