import {useCallback} from 'react';
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import CreateTokenForm from './form/CreateTokenForm';

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const FormContainer = ()=>{
    const {handleSubmit} = useFormContext();

    const onSubmit = useCallback((data, e)=>{
        e.preventDefault();
        console.log({data})
    },[]);

    return (
        <Container 
            sx={{
                my:3
            }}
            component="form"
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}>
            <CreateTokenForm/>
            <Stack alignItems="center" mt={2}>
                <LoadingButton
                type="submit"
                loadingPosition="end" size="large" variant='contained'>
                    <span>Create Token</span>
                </LoadingButton>
            </Stack>
        </Container>
    )
}

const schema = yup.object({
    name:yup.string().required(),
    symbol:yup.string().required(),
    decimals:yup.number().required(),
    totalSupply:yup.number().required()
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