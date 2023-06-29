import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import _contract from "../../contract/address.js";
import { constants, BigNumber } from "ethers";

import e_msg from "../../context/lib/e_msg";

import { TextField as MuiTextField, MenuItem, DialogActions, DialogContent} from "@mui/material";
import { useForm, FormProvider, useController} from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';

import { parseEther } from 'ethers/lib/utils.js';
import exchangeCurrency from'../../currency-list';

import {useDebounce} from 'use-debounce';
import useApprove from '../../context/hook/app/erc721/useApprove';
import useAddToMarket from '../../context/hook/app/erc721/useAddToMarket';
import TextField from '../ControlledTextField';
import { addToSaleSchema } from "./data/schema";
import { addToSaleDefValue } from "./data/defaultValues";

//TODO:fix addToSale

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
                <TextField name="duration" label="duration (in hours)" type="number"/>
                <Typography varaint="caption">use &#34;0&#34; to represent infinty</Typography>
            </Stack>
        </Stack>
    );
}


const prepareFormValue = (formValid, formValue)=>{
    let value = [];
    const _formValid = Boolean(formValid && formValue.amount)
    if(_formValid){
        value = [
            formValue.currency,
            parseEther(formValue.amount.toString()),
            formValue.duration && BigNumber.from(formValue.duration*3600)
        ]
    }
    return [value, _formValid];
}


export default ({tokenId, toggle})=>{
    
    const tokenIdIsValid = Boolean(tokenId);

    const methods = useForm({
        mode:"onChange",
        defaultValues:addToSaleDefValue,
        resolver: yupResolver(addToSaleSchema)
    });

    const _formValue = methods.watch();
    const _formValid = methods.formState.isValid;
    
    const _prepFormValue = useMemo(()=>prepareFormValue(_formValid, _formValue),[_formValue, _formValid]);

    const [[formValue, formValid]] = useDebounce(_prepFormValue, 500);

    const approve = useApprove({
        item:tokenId,
        spender:_contract.sale,
        enabled:tokenIdIsValid
    });
    
    const addToMarketEnabled = approve.isApproved && tokenIdIsValid && formValid;
   
    const market = useAddToMarket({
        item:tokenId,
        formArgs:formValue,
        enabled:addToMarketEnabled
    });

    
    const _error = approve.error || market.error;
    
    const _loading = approve.loading|| market.loading;
 

    return (
        <Dialog open={true} onClose={_loading?null:toggle} fullWidth>
           <DialogContent>
                <FormProvider {...methods}>
                    <FormSection/>
                </FormProvider>

                <Alert severity='info'>
                    <Typography>
                    {
                        approve.isApproved?
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

                    {market.success && 
                        <Alert>Successfully</Alert>
                    }

                </Stack>

            </DialogContent>
           
            
            <DialogActions>
                <Button disabled={!approve.write || _loading || approve.isApproved} 
                onClick={()=>approve.write?.()}>Approve</Button>
                <Button disabled={!(market.write && approve.isApproved) || _loading || market.success} 
                onClick={()=>market.write?.()}>Proceed</Button>
            </DialogActions> 
        </Dialog>
    )
}



