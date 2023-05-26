import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { ModalBox } from "../../components/swap";
import Main from "../../components/swap/Main";
import Success from "../../components/swap/Success";
import Failed from "../../components/swap/Failed";
import Confirm from "../../components/swap/Confirm";
import Select from "../../components/swap/Select";
import Setting from "../../components/swap/Setting";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

const schema = yup.object({
    input:{
        amount:0.0,
        currency:"0x0"
    },
    output:{
        amount:0.0,
        currency:"0x0"
    },
    enabledPool:{
        v2:true,
        v3:true,
        stable:true
    },
    deadline:2, //minute
    slippageBips:100 //1%

}).required();


const init = {
    input:{
        amount:0.0,
        currency:"0x0"
    },
    output:{
        amount:0.0,
        currency:"0x0"
    },
    enabledPool:{
        v2:true,
        v3:true,
        stable:true
    },
    deadline:2, //minute
    slippageBips:100 //1%
};

const SwapPage = ()=>{
    const methods = useForm({
        defaultValues:init
    });

    return (
        <FormProvider {...methods}>
            <Container maxWidth="xs" sx={{pt:2}}>
                <Stack gap={1}>
                    <Main/>
                    <Success/>
                    <Failed/>
                    <Select/>
                    <Setting/>
                    <Confirm/>
                </Stack>
                <ModalBox open={true}>
                    <Setting/>
                </ModalBox>
            </Container>
        </FormProvider>
    )
}

export default SwapPage;