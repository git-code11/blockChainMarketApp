import {Box as MuiBox, Avatar as MuiAvatar, styled} from "@mui/material";


const Image = styled((props)=><MuiAvatar data-scalable variant="rounded" {...props}/>)(({theme})=>({
    width:"100%",
    height:"auto",
    cursor:"pointer",

    "& img":{
        transition: theme.transitions.create("transform",{duration:500})
    },

    "&:hover img":{
        transform:"scale(1.1)",
    }
}));

const Box = styled(MuiBox)(({theme})=>({
    position:"relative",
    cursor:"pointer",
    
    "&:before":{
        content:`""`,
        display:"block",
        width:"100%",
        height:"100%",
        position:"absolute",
        transition:theme.transitions.create('transform',{duration:500}),
        backgroundImage:`linear-gradient(100deg, #13131d, #0398ed)`,
        backgroundRepeat:"repeat-x",
        borderRadius:theme.spacing(2),
    },
    
    "&:hover:before":{
        transform:"rotate(2deg) translateX(-10px) translateY(10px)",
    },

    "& [data-scalable]>img":{
        transition: theme.transitions.create("transform",{duration:500})
    },

    "&:hover [data-scalable]>img":{
        transform:"scale(1.1)",
    },

    "& > *":{
        position:"relative"
    },


}));


export {Box, Image};