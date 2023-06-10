import Container from "@mui/material/Container";

import { ModalBox } from "../../components/swap";
import Main from "../../components/swap/Main";
import Success from "../../components/swap/Success";
import Failed from "../../components/swap/Failed";
import Confirm from "../../components/swap/Confirm";
import Select from "../../components/swap/Select";
import Setting from "../../components/swap/Setting";

import useSwapModal from "../../context/swap/hooks/useSwapModal";
import {SwapTradeProvider} from "../../context/swap/hooks/trade";

const SwapModal = ()=>{
    const {data} = useSwapModal();

    return (
        <>
            <ModalBox open={data.select}>
                <Select/>
            </ModalBox>

            <ModalBox open={data.settings}>
                <Setting/>
            </ModalBox>

            <ModalBox open={data.confirm}>
                <Confirm/>
            </ModalBox>

            <ModalBox open={data.success}>
                <Success/>
            </ModalBox>

            <ModalBox open={data.failed}>
                <Failed/>
            </ModalBox>
        </>
    )
}

const SwapContainer = ()=>{

    return (
        <Container maxWidth="xs" sx={{pt:2}}>
            <Main/>
            <SwapModal/>
        </Container>
    );
}

const SwapPage = ()=>{
    return (
    <SwapTradeProvider>
        <SwapContainer/>
    </SwapTradeProvider>
    )
}

export default SwapPage;