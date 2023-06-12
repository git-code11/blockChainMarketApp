import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";


export const ModalBox = ({open, children})=>
    open ? 
    <Backdrop open={true} invisible={true}>
        <Container maxWidth="xs" sx={{pt:2}}>
            {children}
        </Container>
    </Backdrop>:
    null;
