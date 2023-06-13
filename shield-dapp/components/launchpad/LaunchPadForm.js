import {useCallback} from 'react';
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import TokenForm from './form/TokenForm';
import LaunchForm from './form/LaunchForm';
import LaunchInfoForm from './form/LaunchInfoForm';

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { utils } from "ethers";

const FormContainer = ()=>{
    const {handleSubmit} = useFormContext();

    const onSubmit = useCallback((data, e)=>{
        e.preventDefault();
        console.log({data})
    },[]);

    return (
        <Container 
            sx={{
                my:4
            }}
            maxWidth="md"
            component="form" 
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mb={4}>
                <TokenForm/>
                <LaunchForm/>
                <LaunchInfoForm/>
            </Stack>
            <Stack alignItems="center">
                <LoadingButton loadingPosition="end" size="large" variant='contained'
                    type="submit"
                >
                    <span>Create LaunchPad</span>
                </LoadingButton>
            </Stack>
        </Container>
    )
}

const tokenSchema = yup.object({
    address:yup.string().test({
        name:"validate Token",
        message:"Invalid Token Address Checksum",
        test:(value)=>utils.isAddress(value)
    })
});

const detailSchema = yup.object({
    logoUrl:yup.string().required(),
    web:yup.string().required(),
    social:yup.string(),
    desc:yup.string().required(),
    hash:yup.string()//to hold uploaded cid
}).required();

const launchSchema = yup.object({
    preSale:yup.number().required(),
    dexSale:yup.number().required(),
    capped:yup.number().required(),
    minBuy:yup.number().required(),
    maxBuy:yup.number().required(),
    swapLiquidityPercent:yup.number().required(),
    startTime:yup.date().required(),
    endTime:yup.date().required(),
    lockUp:yup.number().required(),
}).required();


const schema = yup.object({
    token:tokenSchema,
    launch:launchSchema,
    detail:detailSchema,
}).required();


export default ()=>{
    const methods = useForm({
        resolver:yupResolver(schema),
        reValidateMode:"onChange"
    });

    return (
        <FormProvider {...methods}>
            <FormContainer/>
        </FormProvider>
    )
}