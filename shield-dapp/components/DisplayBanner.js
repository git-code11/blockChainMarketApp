import {useRef, useEffect} from "react";

import { Typography } from "@mui/material";
import {  Box, Stack, Paper, Button, styled, useMediaQuery } from "@mui/material";


const BackGroundPlay = styled('video',{shouldForwardProp:prop=>prop!="invert"})(({invert, theme})=>({
    height:"100%",
    position:"absolute",
    [theme.breakpoints.down('md')]: {
        left:"50%"
    },
    [theme.breakpoints.up('md')]: {
        left: invert?"auto":0
    },
    right:invert?0:"auto",
    zIndex:-1,
    transform:`translate(${invert?50:-50}%)`
}));

const Screen = styled(Paper)(({theme})=>({
    minHeight:"65vmin",
    padding:theme.spacing(2),
    position:"relative",
    zIndex:1,
    backgroundColor:"#000",
    color:"#fff",
    overflow:"hidden",
    "&:before":{
        content:'""',
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor:"#0033444a",
        
    }
}))

const DisplayScreen = ()=>{
    const vRef = useRef();
    const vRef2 = useRef();

    const isMd = useMediaQuery(theme=>theme.breakpoints.up("md"));

    useEffect(()=>{
        vRef.current?.play(-1);
        vRef2.current?.play(-1);
    },[isMd]);

    return (
        <Screen component={Stack} justifyContent="center" alignItems="center" textAlign="center">
            <BackGroundPlay ref={vRef} src="/images/vedio/banner01.mp4" muted loop/>
            {isMd && <BackGroundPlay invert ref={vRef2} src="/images/vedio/banner01.mp4" muted loop/>}
            <Box position="relative" mb={6}>
                <Typography variant={isMd?"h3":"h4"} mb={3}>Discover Digital Art,<br/>Collect and Sell Your Specific NFTs.</Typography>
                <Typography variant={isMd?"h5":"body1"}>Partner with one of the world’s largest retailers to showcase your brand and products.</Typography>
            </Box>
            
            <Button size="large" color="secondary" variant="contained">Explore</Button>
            
        </Screen>
    );
}


export default DisplayScreen;