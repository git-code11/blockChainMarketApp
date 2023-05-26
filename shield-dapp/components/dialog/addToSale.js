import {useEffect} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import {useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";

import saleAbi from "../../contract/Sale.sol/MarketSales.json";
import nftAbi from "../../contract/NFT.sol/NFT.json";
import _contract from "../../contract/address.json";
import { constants } from "ethers";

import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";


import { TextField as MuiTextField, MenuItem, DialogActions, DialogContent} from "@mui/material";
import { useForm, FormProvider, useController} from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { parseEther } from 'viem';
import exchangeCurrency from'../../currency-list';

import {useDebounce} from 'use-debounce';


const schema = yup.object({
    amount: yup.number().moreThan(0, "Invalid Price").required("Set Price"),
    currency: yup.string().required("required"),
    duration: yup.number().moreThan(-1, "Can not be negative").required("required"),
}).required();

const TextField = ({name, ...props})=>{
    const {field, fieldState:{error}} = useController({name})

    return (
        <MuiTextField
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            inputRef={field.ref}
            //error={!!error}
            helperText={error?.message}
            FormHelperTextProps={{error:!!error}}
        />
    )
}


const FormSection = ()=>{

    return (
        <Stack spacing={3}>
            <TextField name="amount" type="number" label="Price"/>
            <TextField name="currency" select label="Buying Token">
                {
                Object.entries(exchangeCurrency).map(([key, value])=>
                    <MenuItem key={key} value={value}>{key}</MenuItem>
                )
                }
            </TextField>
            <Stack>
                <TextField name="duration" label="duration (in hours)"/>
                <Typography varaint="caption">use &#34;0&#34; to represent infinty</Typography>
            </Stack>
        </Stack>
    );
}

export default ({id})=>{
    
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;

    const isVisible = !!visible[id];

    const methods = useForm({
        mode:"onChange",
        defaultValues:{
            amount:1,
            currency:constants.AddressZero,
            duration:0
        },
        resolver: yupResolver(schema)
    });

    const formValid = methods.formState.isDirty && methods.formState.isValid;

    const _formValue = methods.getValues();
    
    const _rformValue = [_formValue.currency, _formValue.amount && parseEther(_formValue.amount.toString()), _formValue.duration && BigInt(_formValue.duration)*3600n];

    const [formValue] = useDebounce(_rformValue, 500);

    const {data:_isApproved} = useContractRead({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"getApproved",
        args:[tokenId],
        enabled:!!tokenId,
        watch:true
    });

    const isApproved = _isApproved === _contract.sale;
    
    const {config:approveConfig} = usePrepareContractWrite({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"approve",
        args:[_contract.sale, tokenId],
        enabled:!(!tokenId || isApproved) && isVisible
    });

    
    const {write:approve, ...approveWriteOpts} = useContractWrite(approveConfig);
    const waitApprove = useWaitForTransaction({
        hash:approveWriteOpts.data?.hash
    })
    //console.log({approveConfig, approveWriteOpts});
    
    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.sale,
        abi:saleAbi.abi,
        functionName:"addToMarket",
        args:[tokenId, ...formValue],
        enabled:!!tokenId && formValid && isApproved && isVisible
    });

    
    const {write, ...writeOpts} = useContractWrite(config);
    const waitWrite = useWaitForTransaction({
        hash:writeOpts.data?.hash
    })

    const _error = approveWriteOpts.error || writeOpts.error || waitApprove.error || waitWrite.error;
    
    const _loading = approveWriteOpts.isLoading|| waitApprove.isLoading || writeOpts.isLoading || waitWrite.isLoading;
 

    return (
        <Dialog open={isVisible} onClose={()=>hide(id)} fullWidth>
           <DialogContent>
                <FormProvider {...methods}>
                    <FormSection/>
                </FormProvider>

                <Alert severity='info'>
                    <Typography>
                    {
                        isApproved?
                        "Market is Approved to set Price on Item":
                        "Market needs approval to set Price"
                    }    
                    </Typography>
                </Alert>
                <Stack>
                    {_error &&
                        <Alert severity='error'>{e_msg(_error)}</Alert>
                    }

                    {_loading && 
                        <Alert variant="outlined" severity="info">
                            <Stack px={1} direction="row" spacing={1} alignItems="center">
                                <Typography>Processing </Typography>
                                <CircularProgress/>
                            </Stack>
                        </Alert>
                    }       

                    {writeOpts.isSuccess && 
                        <Alert>Successfully</Alert>
                    }

                </Stack>

            </DialogContent>
           
            
            <DialogActions>
                <Button disabled={!approve || _loading || isApproved} 
                onClick={()=>approve?.()}>Approve</Button>
                <Button disabled={!(write && isApproved) || _loading || writeOpts.isSuccess || prepare.isLoading} 
                onClick={()=>write?.()}>Proceed</Button>
            </DialogActions> 
        </Dialog>
    )
}



