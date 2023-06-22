import {useRef, useEffect} from "react";

import {useRouter} from 'next/router';
import Link from 'next/link';

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
    transform:`translate(${invert?/* 50:-50 */45:-45}%)`
}));

const Screen = styled(/* Paper */Box)(({theme})=>({
    minHeight:"90vmin",
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
        backgroundColor:"#00222e42"/* "#0033444a" */,
        
    }
}))

const BANNER_TEXT = "Partner with us to create and showcase your NFT!"
//Partner with one of the world’s largest retailers to showcase your brand and products.


const DisplayScreen = ()=>{
    const vRef = useRef();
    const vRef2 = useRef();

    const isMd = useMediaQuery(theme=>theme.breakpoints.up("md"));
    const {isReady} = useRouter();

    useEffect(()=>{
        if(isReady){
            vRef.current?.play(-1);
            vRef2.current?.play(-1);
        }
    },[isMd, isReady]);

    return (
        <Screen component={Stack} justifyContent="center" alignItems="center" textAlign="center">
            <BackGroundPlay ref={vRef} src="/banner.mp4" muted loop/>
            {isMd && <BackGroundPlay invert ref={vRef2} src="/banner.mp4" muted loop/>}
            <Stack position="relative" spacing={4}>
                <Typography variant={isMd?"h3":"h4"}>
                    Discover Digital Art,<br/>Collect and Sell Your Specific NFTs.
                </Typography>
                <Typography variant={isMd?"h5":"h6"}>
                    {BANNER_TEXT}
                </Typography>
                <Button sx={{alignSelf:"center"}} component={Link} href="/explore/0" size="large" color="primary" variant="contained">Explore</Button>
            </Stack>
        </Screen>
    );
}


export default DisplayScreen;