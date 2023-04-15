import {styled, Box} from "@mui/material";

const Overlay = styled(Box)(()=>({
    '&::after':{
        content:'""',
        display:"block",
        width:"100%",
        height:"100%",
        backgroundColor:"#00000066"
    }
}));

export default Overlay;