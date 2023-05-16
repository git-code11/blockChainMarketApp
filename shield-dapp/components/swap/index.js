import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";

export const LOGO = "/images/logo.png";

export const TOKEN_LIST = ["ETH", "DAI", "USDC", "WBTC", "WETH", "FRK", "MATIC"];

export const ModalBox = ({open, children})=>
    <Backdrop open={open}>
        <Container maxWidth="xs" sx={{pt:2}}>
            {children}
        </Container>
    </Backdrop>;
