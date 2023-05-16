import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { ModalBox } from "../../components/swap";
import Main from "../../components/swap/Main";
import Success from "../../components/swap/Success";
import Failed from "../../components/swap/Failed";
import Confirm from "../../components/swap/Confirm";
import Select from "../../components/swap/Select";
import Setting from "../../components/swap/Setting";


const SwapPage = ()=>{
    return (
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
    )
}

export default SwapPage;