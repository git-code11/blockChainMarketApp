import {useEffect, useMemo} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import {useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import nftAbi from "../../contract/NFT.sol/NFT.json";
import _contract from "../../contract/address.json";
import { constants, BigNumber } from "ethers";

import e_msg from "../../context/lib/e_msg";
import {DialogActions, DialogContent} from "@mui/material";
import { useForm, FormProvider, useFormContext} from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { parseEther } from 'ethers/lib/utils.js';

import {useDebounce} from 'use-debounce';

import Switch from '@mui/material/Switch';
import useApprove from '../../context/hook/app/erc721/useApprove';
import useCreateAuction from '../../context/hook/app/erc721/useCreateAuction';
import TextField from '../ControlledTextField';

const schema = yup.object({
    reserve: yup.number().positive().required("Set Reserve Price"),
    startTime: yup.date(),
    endTime:yup.date().required("End Date Required"),
    diffTime: yup.number().positive().required("invalid"),//for unscheduled mode
    scheduled:yup.boolean()
}).required();


const ScheduledField = ()=>{
    const methods = useFormContext();

    return <Switch value={methods.getValues('scheduled')} onChange={(e)=>methods.setValue('scheduled', e.target.checked)}/>
}


const FormSection = ()=>{
    const methods = useFormContext();
    const isScheduled = methods.getValues('scheduled');

    return (
        <Stack spacing={3}>
            <TextField name="reserve" type="number" label="Reserve amount"/>
            {isScheduled?
                <>
                    <TextField name="startTime" label="Start Time" type="date"/>
                    <TextField name="endTime" label="End Time" type="date"/>
                </>:
                <TextField name="diffTime" label="Duration Period (hrs)"/>
            }
            <Stack direction="row">
                <Typography varaint="caption">scheduled</Typography>
                <ScheduledField/>
            </Stack>
        </Stack>
    );
}

const DIFFTIME = 7 * 24 * 60 * 60 * 1000///7days

export default ({tokenId, toggle})=>{
    
    const tokenIdIsValid = Boolean(tokenId);

    const methods = useForm({
        mode:"onChange",
        defaultValues:()=>new Promise(resolve=>resolve({
            reserve:1,
            scheduled:false,
            startTime:(new Date).toISOString().split('T')[0],
            endTime:(new Date(Date.now() + DIFFTIME)).toISOString().split('T')[0],
            diffTime:24//24hrs default
        })),
        resolver: yupResolver(schema)
    });

    const formValid = /*methods.formState.isDirty &&*/ methods.formState.isValid;

    const _formValue = formValid?methods.getValues():{};
    
    const _rformValue = useMemo(()=>{
        if(formValid){
            const f_startTime = Math.round(Date.parse(_formValue.startTime)/1000);
            const f_endTime = Math.round(Date.parse(_formValue.endTime)/1000);
            const f_diffTime = _formValue.scheduled?
                                    Math.abs(f_endTime - f_startTime):
                                    (_formValue.diffTime??24)*3600//hrs to secs
            return (
             [   
                [ 
                    parseEther(_formValue.reserve.toString()),
                    [
                        _formValue.scheduled?f_startTime:0,
                        f_diffTime
                    ],
                    _formValue.scheduled
                ],
            formValid
            ]
            );
        }
        return [[], formValid]
    },[_formValue, formValid]);

    
    const [[formValue, dformValid]] = useDebounce(_rformValue, 500);


    const approve = useApprove({
        item:tokenId,
        spender:_contract.auction,
        enabled:tokenIdIsValid
    });
    
    const createAuctionEnabled = tokenIdIsValid && dformValid && approve.isApproved;
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



