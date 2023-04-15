
import {styled, keyframes} from "@mui/material";

const rippleEffect = keyframes`
    from {
        transform:scale(0);
        opacity:0;
    }

    to {
        transform:scale(1.3);
        opacity:1;
    }
`;

const Ripple = styled("span")(({theme})=>({
    position:"relative",
    display:"grid",
    placeItems:"center",
    
    "&:before, &:after":{
        position:"absolute",
        display:"block",
        width:"100%",
        height:"100%",
        animation:`${rippleEffect} 1.2s infinite`
    },
    "&before":{
        backgroundColor:"purple",
    },
    "&after":{
        border:"solid 10px purple"
    }
}));

export default Ripple;