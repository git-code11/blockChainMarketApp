import {useCallback, useMemo, useState} from 'react';
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, Alert } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import CreateTokenForm from './form/CreateTokenForm';

import { yupResolver } from "@hookform/resolvers/yup";
import useCreateERC20 from '../../context/hook/app/factory/erc20/useCreateERC20';
import { parseAddress } from '../../context/hook/app/factory/utils';
import e_msg from '../../context/lib/e_msg';
import { useAccount } from 'wagmi';
import { createTokenSchema } from './data/schema';
import { createTokenDefValue } from './data/defaultValues';



const getCreatedTokenAddress = reciept => parseAddress(reciept.logs[1].topics[2]);

const FormContainer = ()=>{

    const {handleSubmit, watch, formState:{isValid}} = useFormContext();

    const {isConnected} = useAccount();
    const params = watch();
    const {write, loading, error, success, reciept} = useCreateERC20({params});

    const createdTokenAddress = useMemo(()=>reciept && getCreatedTokenAddress(reciept), [reciept]);

    const onSubmit = useCallback((data, e)=>{
        e.preventDefault();
        console.log({data})
        write();
    },[write]);

    
    

    return (
        <form
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}>
            <CreateTokenForm disabled={loading}/>
            <Stack alignItems="center" mt={2} spacing={3}>
                {
                    error && <Alert variant="error">{e_msg(error)}</Alert>
                }

                {   success &&
                    <Alert variant="success">
                        <Typography color="success">
                            SuccessFul: <small>{createdTokenAddress}</small>
                        </Typography>
                    </Alert>
                }
                <LoadingButton
                loading={loading}
                disabled={!isConnected}
                type="submit"
                size="large" variant='contained'>
                    <span>Create Token</span>
                </LoadingButton>
            </Stack>
        </form>
    )
}

export default ()=>{
    const methods = useForm({
        resolver:yupResolver(createTokenSchema),
        mode:"onChange",
        defaultValues:createTokenDefValue
    });

    return (
        <FormProvider {...methods}>
            <FormContainer/>
        </FormProvider>
    )
}