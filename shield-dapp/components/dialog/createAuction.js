import {useEffect, useMemo} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import _contract from "../../contract/address.js";


import e_msg from "../../context/lib/e_msg";
import {DialogActions, DialogContent} from "@mui/material";
import { useForm, FormProvider, useFormContext} from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';

import { parseEther } from 'ethers/lib/utils.js';

import {useDebounce} from 'use-debounce';

import Switch from '@mui/material/Switch';
import useApprove from '../../context/hook/app/erc721/useApprove';
import useCreateAuction from '../../context/hook/app/erc721/useCreateAuction';
import TextField from '../ControlledTextField';

import { createAuctionSchema } from './data/schema';
import { createAuctionDefValue } from './data/defaultValues';

const ScheduledField = ()=>{
    const methods = useFormContext();

    return <Switch value={methods.getValues('scheduled')} onChange={(e)=>methods.setValue('scheduled', e.target.checked)}/>
}


const FormSection = ()=>{
    const methods = useFormContext();
    const isScheduled = methods.getValues('scheduled');

    return (
        <Stack spacing={3}>
            <TextField name="reserve" type="number" label="Reserve Amount (bnb)"/>
            
            {
                isScheduled?
                <>
                    <TextField  name="startTime" label="Start Time" type="datetime-local"/>
                    <TextField name="endTime" label="End Time" type="datetime-local"/>
                </>:
                <TextField name="diffTime" type="number" label="Duration Period (hrs)"/>
            }
        
            <Stack direction="row">
                <Typography varaint="caption">scheduled</Typography>
                <ScheduledField/>
            </Stack>
        </Stack>
    );
}



const prepareFormValue = (formValid, formValue)=>{
    let value = [];
    const _formValid = Boolean(formValid && formValue.reserve && formValue.diffTime);
    if(_formValid){
        const f_startTime = Math.round(Date.parse(formValue.startTime)/1000);
        const f_endTime = Math.round(Date.parse(formValue.endTime)/1000);
        const f_diffTime = formValue.scheduled?
                                Math.abs(f_endTime - f_startTime):
                                formValue.diffTime*3600//hrs to secs
        
        value = [ 
                parseEther(formValue.reserve.toString()),
                [
                    formValue.scheduled?f_startTime:0,
                    f_diffTime
                ],
                formValue.scheduled
            ];
    }

    return [value, _formValid];
}

export default ({tokenId, toggle})=>{
    
    const tokenIdIsValid = Boolean(tokenId);

    const methods = useForm({
        mode:"onChange",
        defaultValues:createAuctionDefValue,
        resolver: yupResolver(createAuctionSchema)
    });
    const _formValue = methods.watch();

    const _formValid = /*methods.formState.isDirty &&*/ methods.formState.isValid;

    const _prepFormValue = useMemo(()=>prepareFormValue(_formValid, _formValue),[_formValue, _formValid]);

    
    const [[formValue, formValid]] = useDebounce(_prepFormValue, 500);


    const approve = useApprove({
        item:tokenId,
        spender:_contract.auction,
        enabled:tokenIdIsValid
    });
    
    const createAuctionEnabled = tokenIdIsValid && formValid && approve.isApproved;
    const create = useCreateAuction({
        item:tokenId,
        formArgs:formValue,
        enabled:createAuctionEnabled
    });

   
    const _error = (create.success?null:approve.error) || (createAuctionEnabled && create.error);
    
    const _loading = approve.loading || create.loading;
 

    return (
        <Dialog open={true} onClose={_loading?null:toggle} fullWidth>
           <DialogContent>
                <FormProvider {...methods}>
                    <FormSection/>
                </FormProvider>

                <Alert severity='info'>
                    <Typography>
                    {
                        (approve.isApproved || create.success)?
                        "Market is approved":
                        "Market needs approval"
                    }{" to auction item"}
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

                    {create.success && 
                        <Alert>Successfully</Alert>
                    }

                </Stack>

            </DialogContent>
           
            
            <DialogActions>
                <Button disabled={create.success || !approve.write || _loading || approve.isApproved} 
                onClick={()=>approve.write?.()}>Approve</Button>
                <Button disabled={create.success || !(create.write && approve.isApproved) || _loading || create.success} 
                onClick={()=>create.write?.()}>Proceed</Button>
            </DialogActions> 
        </Dialog>
    )
}



