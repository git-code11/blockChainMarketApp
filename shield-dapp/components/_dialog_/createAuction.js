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
import { useDataContext } from "./context";

import MuiTextField from "@mui/material/TextField";
import {DialogActions, DialogContent} from "@mui/material";
import { useForm, FormProvider, useController, useFormContext} from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { parseEther } from 'ethers/lib/utils.js';

import {useDebounce} from 'use-debounce';

import Switch from '@mui/material/Switch';


const schema = yup.object({
    reserve: yup.number().positive().required("Set Reserve Price"),
    startTime: yup.date(),
    endTime:yup.date().required("End Date Required"),
    scheduled:yup.boolean()
}).required();

const TextField = ({name, ...props})=>{
    const {field, fieldState:{error}} = useController({name})

    return (
        <MuiTextField {...props}
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


const ScheduledField = ()=>{
    const methods = useFormContext();

    return <Switch value={methods.getValues('scheduled')} onChange={(e)=>methods.setValue('scheduled', e.target.checked)}/>
}


const FormSection = ()=>{

    return (
        <Stack spacing={3}>
            <TextField name="reserve" type="number" label="Reserve amount"/>
            <TextField name="startTime" label="Start Time" type="date"/>
            <TextField name="endTime" label="End Time" type="date"/>
            <Stack direction="row">
                <Typography varaint="caption">scheduled</Typography>
                <ScheduledField/>
            </Stack>
        </Stack>
    );
}

const DIFFTIME = 7 * 24 * 60 * 60 * 1000///7days

export default ({id})=>{
    
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;

    const isVisible = !!visible[id];

    const methods = useForm({
        mode:"onChange",
        defaultValues:()=>new Promise(resolve=>resolve({
            reserve:1,
            scheduled:false,
            startTime:(new Date).toISOString().split('T')[0],
            endTime:(new Date(Date.now() + DIFFTIME)).toISOString().split('T')[0]
        })),
        resolver: yupResolver(schema)
    });

    const formValid = /*methods.formState.isDirty &&*/ methods.formState.isValid;

    const _formValue = methods.getValues();
    const f_reserve = useMemo(()=>_formValue.reserve?parseEther(_formValue.reserve?.toString()):0,[_formValue.reserve]);
    const f_startTime = useMemo(()=>Math.round(Date.parse(_formValue.startTime)/1000),[_formValue.startTime]);
    const f_endTime =   useMemo(()=>Math.round(Date.parse(_formValue.endTime)/1000),[_formValue.endTime])
    const f_diffTime = useMemo(()=> _formValue.scheduled?Math.abs(f_endTime - f_startTime):Math.abs(Math.round(Date.now()/1000) - f_endTime),[f_endTime, f_startTime, _formValue.scheduled]);
 
    const _rformValue = [   tokenId,
                            f_reserve,
                            [
                                _formValue.scheduled?f_startTime:0,
                                f_diffTime
                            ],
                            _formValue.scheduled
                        ];

    const [formValue] = useDebounce(_rformValue, 500);

    const {data:_isApproved} = useContractRead({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"getApproved",
        args:[tokenId],
        enabled:!!tokenId && isVisible,
        watch:true
    });

    const isApproved = _isApproved === _contract.auction;
    
    const {config:approveConfig} = usePrepareContractWrite({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"approve",
        args:[_contract.auction, tokenId],
        enabled:!(!tokenId || isApproved) && isVisible
    });

    const {write:approve, ...approveWriteOpts} = useContractWrite(approveConfig);
    const waitApprove = useWaitForTransaction({
        hash:approveWriteOpts.data?.hash
    });

    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.auction,
        abi:auctionAbi.abi,
        functionName:"createAuction",
        args:formValue,
        enabled:!!tokenId && formValid && isApproved &&  isVisible
    });

    
    const {write, ...writeOpts} = useContractWrite(config);
    const waitWrite = useWaitForTransaction({
        hash:writeOpts.data?.hash
    });


    const _error = approveWriteOpts.error || writeOpts.error || waitApprove.error || waitWrite.error;
    
    const _loading = approveWriteOpts.isLoading || writeOpts.isLoading || waitApprove.isLoading || waitWrite.isLoading;
 

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

                    {waitWrite.isSuccess && 
                        <Alert>Successfully</Alert>
                    }

                </Stack>

            </DialogContent>
           
            
            <DialogActions>
                <Button disabled={waitWrite.isSuccess || !approve || _loading || isApproved} 
                onClick={()=>approve?.()}>Approve</Button>
                <Button disabled={waitWrite.isSuccess || !(write && isApproved) || _loading || waitWrite.isSuccess || prepare.isLoading} 
                onClick={()=>write?.()}>Proceed</Button>
            </DialogActions> 
        </Dialog>
    )
}



