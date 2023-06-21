import {useCallback, useState} from 'react';
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import TokenForm from './form/TokenForm';
import LaunchForm from './form/LaunchForm';
import LaunchInfoForm from './form/LaunchInfoForm';

import { yupResolver } from "@hookform/resolvers/yup";

import { createLaunchPadSchema } from './data/schema';
import { createLaunchDefValue } from './data/defaultValues';
import LaunchFormStep from './form/LaunchFormStep';


const FormContainer = ()=>{
    const [open, setOpen] = useState(false);
    const toggleClose = useCallback(()=>setOpen(e=>!e),[]);
    
    const {handleSubmit} = useFormContext();

    const onSubmit = useCallback((data, e)=>{
        e.preventDefault();
        toggleClose();
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
                <LoadingButton  size="large" variant='contained'
                    type="submit"
                >
                    <span>Create LaunchPad</span>
                </LoadingButton>
            </Stack>

            {open && <LaunchFormStep onClose={toggleClose}/>}
        </Container>
    )
}

export default ()=>{
    const methods = useForm({
        resolver:yupResolver(createLaunchPadSchema),
        mode:"onChange",
        defaultValues:createLaunchDefValue
    });

    return (
        <FormProvider {...methods}>
            <FormContainer/>
        </FormProvider>
    )
}