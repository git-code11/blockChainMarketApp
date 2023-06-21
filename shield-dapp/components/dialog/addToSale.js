import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import _contract from "../../contract/address.json";
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

export default ({tokenId, toggle})=>{
    
    const tokenIdIsValid = Boolean(tokenId);

    const methods = useForm({
        mode:"onChange",
        defaultValues:addToSaleDefValue,
        resolver: yupResolver(addToSaleSchema)
    });

    const formValid = methods.formState.isValid;

    const _formValue = formValid?methods.getValues():{};
    
    const _rformValue = useMemo(()=>
        formValid ? [[_formValue.currency, _formValue.amount && parseEther(_formValue.amount.toString()),
                    _formValue.duration && BigNumber.from(_formValue.duration*3600)], formValid]:[[], formValid],
        [_formValue, formValid]);

    const [[formValue, dformValid]] = useDebounce(_rformValue, 500);

    const approve = useApprove({
        item:tokenId,
        spender:_contract.sale,
        enabled:tokenIdIsValid
    });
    
    const addToMarketEnabled = approve.isApproved && tokenIdIsValid && dformValid;
    const market = useAddToMarket({
        item:tokenId,
        formArgs:formValue,
        enabled:addToMarketEnabled
    });

    
    const _error = approve.error || (addToMarketEnabled && market.error);
    
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

                    {market.isSuccess && 
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



