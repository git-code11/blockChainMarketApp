import {useState, useRef, useEffect} from "react";
import { Avatar, AvatarGroup, MenuItem, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { Container, Box, Stack, Paper, Skeleton, Button } from "@mui/material";
import { styled } from "@mui/system";

import Grid from "@mui/material/Unstable_Grid2";

import {FavoriteRounded, FilterAltOffRounded, FilterAltRounded} from "@mui/icons-material"

import { red } from '@mui/material/colors';

import {IconButton, Slider, Collapse, useMediaQuery, MobileStepper} from "@mui/material";

import SwipeableViews from 'react-swipeable-views';
import { autoPlay, virtualize } from 'react-swipeable-views-utils';
import { useTheme } from "@emotion/react";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


const temp_p = Array(5).fill(0).map((d,i)=>`/images/portfolio/portfolio-0${i+1}.jpg`);
const temp_c = Array(5).fill(0).map((d,i)=>`/images/collection/collection-lg-0${i+1}.jpg`);



export default ()=>{

    return (
        <Container sx={{mt:4, mb:3}}>
            <DisplayScreen/>
            <DisplayFaq/>
            {/*<SwipeableDisplay/>*/}
            <FilterContainer/>

            <Grid container spacing={2} rowSpacing={3}>
            
                {Array(6).fill(0).map((d,i)=>
                    <Grid key={i} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                        <Item image={temp_p[i%5]} name="Futuristic Tunnel #205" price="34.5BNB" 
                                basePrice="$34.56" creator="0xe843882488347738826688"
                                creatorImage={temp_c[i%5]}/>
                    </Grid>
                )}

                {Array(6).fill(0).map((d,i)=>
                    <Grid key={i} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                        <ItemBid image={temp_p[i%5]} name="Futuristic Tunnel #205" currentBidBase="$34.56" noOfBidPlaced={(i+34*i%33)}
                        creatorName="Angelina Franca" last3TopBiddersImage={temp_c.slice(i%2, i%2 + 3)}/>
                    </Grid>
                )}

            </Grid>

        </Container>

    );
}

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

const FaqData = [
    {
        text1:"Set Up Your Wallet",
        text2:"Powerful features and inclusions, which makes ShieldPact standout, easily customizable and scalable.",
        icon:"/images/icon/wallet.png"
    },
    {
        text1:"Add your NFT's",
        text2:"We've made the template fully responsive, so it looks great on all devices: desktop, tablets and.",
        icon:"/images/icon/save.png"
    },
    {
        text1:"Sell Your NFT's",
        text2:"I throw myself down among the tall grass by the stream as I lie close to the earth NFT's.",
        icon:"/images/icon/share.png"
    }
]

const DisplayFaq = ()=>{

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Create and Sell Your NFT</Typography>
            <Grid container spacing={4} justifyContent="center">
                {FaqData.map((d, i)=>
                    <Grid sx={12} md={4} lg={3} key={d.text1}>
                        <FaqBox text0={`STEP-0${i+1}`}
                            {...d}
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}


const FaqImage = styled("img")(()=>({
    position:"absolute",
    top:-30,
    right:-15,
    width:"auto",
    height:90
}));

const FaqBox = ({text1, text2, text0, icon})=>{
    return (
        <Box height="100%" py={4} px={3} position="relative" bgcolor="#010e14" color="#fff" borderRadius={3}
            sx={{
                cursor:"pointer",
                "&:hover > *":{
                    transform:"translateY(0px)"
                },
                "& > *":{
                    transition:theme=>theme.transitions.create('transform',{duration:700, easing:"cubic-bezier(0.17, 0.67, 0, 1.01)"}),
                    transform:"translateY(10px)"
                }
            }}
            >
            <FaqImage src={icon}/>
            <Box>
                <Typography variant="subtitle1">{text0}</Typography>
                <Typography mt={4} mb={3} variant="h5">{text1}</Typography>
                <Typography lineHeight={1.8}>{text2}</Typography>
            </Box>
        </Box>
    )
}


const ListSlideRender = ({key, index})=>{
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const totalRecord = 5;
    const _size = isMdUp?3:(isSmUp?2:1);
    const base = index * _size;
   
    return(
        <Box px={4} pb={4} >
            <Grid container justifyContent="space-evenly" spacing={2}>
                
                    {Array(_size).fill(0).map((d,_i)=>{
                        const i = (_i + base)%totalRecord;
                        return  (
                        <Grid xs={12} sm={6} md={4} lg={3}>
                            <ItemBid image={temp_p[i]} name="Futuristic Tunnel #205" currentBidBase="$34.56" noOfBidPlaced={(i+34*i%33)}
                                creatorName="Angelina Franca" last3TopBiddersImage={temp_c.slice(i%2, i%2 + 3)}/>
                        </Grid>
                        )}
                        )}
                
            </Grid>
        </Box>
    )
}

const SwipeableDisplay = ()=>{

    const [activeStep, updateStep] = useState(0);

    return (
    <Box>
        <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={updateStep}
        enableMouseEvents
      >
            {Array(5).fill(0).map((d,i)=>ListSlideRender({key:i, index:i}))}
        </AutoPlaySwipeableViews>
        <Stack alignItems="center">
            <MobileStepper variant="dots" steps={5} activeStep={activeStep} position="static"/>
        </Stack>
    </Box>
    );
}

const filter_categoryTag = "Art, Photography".split(',');
const filter_saleType = "Fixed Price, Live Auction, Open for Offer".split(',');


const FilterContainer = ()=>{
    const [open, setOpen] = useState(false);

    return (
        <Box py={2}>
            <Stack alignItems="end">
                <IconButton onClick={()=>setOpen(e=>!e)} color="primary">
                    {open?<FilterAltOffRounded/>:<FilterAltRounded/>}
                </IconButton>
            </Stack>
            <Collapse in={open}>
                <FilterMenu/>
            </Collapse>
        </Box>
    );
}

const FilterMenu = ()=>{
    return (

            <Grid container py={4} spacing={3}>
                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">CATEGORY TAG</Typography>
                    <TextField select fullWidth defaultValue={filter_categoryTag[0]}>
                        {filter_categoryTag.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">SALE TYPE</Typography>
                    <TextField select fullWidth defaultValue={filter_saleType[0]}>
                        {filter_saleType.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
                    <Box>
                        <Typography pb={1} variant="caption">PRICE RANGE</Typography>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            defaultValue={[23, 56]}
                        />
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">Price $230 - $300</Typography>
                        <Button size="small" variant="contained">filter</Button>
                    </Stack>
                </Grid>

            </Grid>

    );
}

const ElTypography = styled(Typography)(()=>({
    overflow:"hidden",
    maxWidth:"10ch",
    textOverflow:"ellipsis"
}));


const ItemBid = ({title, image, creatorName, currentBidBase, last3TopBiddersImage, noOfBidPlaced})=>{

    const loading = true&&false;
    return (
        <ScalableBox>
            <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2}} spacing={1}>

                    <Paper sx={{maxHeight:{xs:"60vmin", sm:220}, overflowY:"hidden", width:"100%", borderRadius:2, position:"relative"}}>
                        
                        {loading?
                            <Skeleton variant="rounded" sx={{height:"100%", borderRadius:2}}/>:
                            <ScalableImage src={image}/>
                        }
                        
                        <Box position="absolute" right={0} top={0}>    
                            {loading ?
                                <Skeleton width={75} height={30}/>:
                                <BlurDarkBox component={Typography} fontWeight="bold" color="#fff" p={0.25} bgcolor="grey.200" >
                                    13h 22m 58s
                                </BlurDarkBox>
                            }
                        </Box>
                            
                    </Paper>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <AvatarGroup>
                            {last3TopBiddersImage.map(topBidderImage=>
                                <Avatar sx={{width:30, height:30}}src={topBidderImage}/>
                                )}
                        </AvatarGroup>
                        
                        <Typography>{noOfBidPlaced} Placed Bids</Typography>
                    </Stack>

                    <Stack>
                        <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:title}</Typography>
                        <Typography variant="subtite2">{loading?<Skeleton width={50}/>:creatorName}</Typography>
                    </Stack>

                    <Stack justifyContent="space-between" alignItems="center" direction="row">
                        <Stack>
                            <Typography variant="subtite2">{loading?<Skeleton width={75}/>:"Current Bid"}</Typography>
                            <Typography variant="h5" fontWeight="bold">{loading?<Skeleton width={75}/>:currentBidBase}</Typography>
                        </Stack>

                        {loading?
                        <Skeleton variant="rounded" width={80} height={35}/>:
                        <Button variant="outlined" size="medium">Place a Bid</Button>}
                    </Stack>

            </Paper>
        </ScalableBox>
    );
}

const BlurDarkBox = styled(Box)(()=>({
    backgroundColor:"#2424354d",
    backdropFilter: "blur(16px)"
}))

const ScalableImage = styled((props)=><Avatar data-scalable variant="rounded" {...props}/>)(({theme})=>({
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

const ScalableBox = styled(Box)(({theme})=>({
    position:"relative",
    cursor:"pointer",
    
    "&:before":{
        content:`""`,
        display:"block",
        width:"100%",
        height:"100%",
        position:"absolute",
        transition:theme.transitions.create('transform',{duration:500}),
        backgroundImage:"linear-gradient(100deg, #13131d, #0398ed)",
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

const Item = ({title, image, creator, price, basePrice, creatorImage})=>{

    const loading = true&&false;
    return (
        <ScalableBox data-sal="slide-up" data-sal-duration="500" data-sal-delay="200">
            <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2, pb:0.5}} spacing={1}>
                    
                <Paper sx={{width:"100%", borderRadius:2, position:"relative"}}>
                    
                    {loading?
                        <Skeleton variant="rounded" sx={{height:"100%", borderRadius:2}}/>:
                        <ScalableImage src={image}/>
                    }

                    <Box position="absolute" top={0} right={0}>    
                        
                        {loading?
                        <Skeleton variant="circular" sx={{width:30, height:30}}/>:
                        <IconButton>
                            <FavoriteRounded size="large" sx={{color:red[600]}}/>
                        </IconButton>
                        }
                        
                    </Box>

                </Paper>

                <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:title}</Typography>

                <Stack justifyContent="space-between" direction="row">
                    <Typography variant="subtitel">{loading?<Skeleton width={50}/>:"Price"}</Typography>
                    <Stack>
                        <Typography fontWeight="bold" variant="body1">{loading?<Skeleton width={95}/>:price}</Typography>
                        <Typography variant="body2">{loading?<Skeleton width={100}/>:`~${basePrice}`}</Typography>
                    </Stack>
                </Stack>

                <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="subtitel">{loading?<Skeleton width={75}/>:"Creator"}</Typography>
                    <Stack spacing={1} direction="row" alignItems="center">
                        {loading?<Skeleton variant="circular" width={30} height={30}/>:<Avatar sx={{width:25, height:25}} src={creatorImage}/>}
                        <ElTypography fontWeight="bold" variant="body2">{loading?<Skeleton width={120}/>:creator}</ElTypography>
                    </Stack>
                </Stack>

                <Button>Buy Now</Button>

             </Paper>
        </ScalableBox>
        
    );
}