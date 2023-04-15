import {useState, useMemo, useRef} from "react";
import { Tabs, Tab, Button, ButtonGroup, Typography, CardActionArea } from "@mui/material";

import { Container, Box, Stack, Avatar, Paper} from "@mui/material";
import { ArrowUpwardRounded as ArrowUpIcon} from "@mui/icons-material"

import Grid from "@mui/material/Unstable_Grid2";
import {Slide, List, ListItem, ListItemText} from "@mui/material";

import { keyframes, styled } from "@mui/material";

import Ripple from "../../../components/Ripple";

import UserInfo from "../../../components/UserInfo";

const temp_p = Array(5).fill(0).map((d,i)=>`/images/portfolio/portfolio-0${i+1}.jpg`);
const temp_c = Array(5).fill(0).map((d,i)=>`/images/collection/collection-lg-0${i+1}.jpg`);



export default ()=>{

    return (
        <Box>
            <UserInfo/>
            <Container>
               <TabSection/>
            </Container>
           
        </Box>
    );
}

const TransactionTabPanel = ()=>{

    return (
        <Box>
           <List>
                {Array(5).fill(0).map((d,i)=>(
                    <ListItem key={i}>
                        <ListItemText primary="@precious bought car from frank" secondary="#4 days ago"/>
                    </ListItem>
                ))}
           </List>
        </Box>
    )
}


const BidTabPanel = ()=>{
    return (
        <Grid container spacing={2}>    
            {temp_p.concat(temp_c).map((d, k)=>
            <Grid xs={12} sm={6} md={4} lg={3}>
                <ItemAuctionBid image={d} key={k} name="Esponiage" addr="0x33884294ccee378"/>
            </Grid>
                )}
        </Grid>
    );
}

const OfferTabPanel = ()=>{
    return (
        <Grid container spacing={2}>    
            {temp_p.concat(temp_c).map((d, k)=>
            <Grid xs={12} sm={6} md={4} lg={3}>
                <ItemOffer image={d} key={k} name="Esponiage" addr="0x33884294ccee378" isOfferFrom={k%4 == 1}/>
            </Grid>
                )}
        </Grid>
    );
}

const OwnedTabPanel = ()=>{

    return (
        <Grid container spacing={2}>    
                {temp_p.concat(temp_c).map((d, k)=>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <Item image={d} key={k} name="Esponiage" addr="0x33884294ccee378"/>
                </Grid>
                    )}
           
        </Grid>
    );
}

const CreatedTabPanel = ()=>{

    return (
        <Grid container spacing={2}>    
                {temp_p.concat(temp_c).map((d, k)=>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <Item image={d} key={k} name="Esponiage" addrLabel="Owner" addr="0x33884294ccee378"/>
                </Grid>
                    )}
           
        </Grid>
    );
}

const TabMenu = ({value, setValue})=>{
   
    return (
        <Tabs sx={{position:"sticky", top:0, zIndex:1, backdropFilter:"blur(15px)", pb:1}} variant="scrollable" fullWidth value={value} onChange={(e, v)=>setValue(v)}>
            <Tab selected label="Created"/>
            <Tab label="Owned"/>
            <Tab label="Offer"/>
            <Tab label="Auction"/>
            <Tab label="Transaction"/>
        </Tabs>
    )
}

const panelList = [CreatedTabPanel, OwnedTabPanel, OfferTabPanel, BidTabPanel, TransactionTabPanel];

const TabPanel = ({value})=>{
    const panel = useMemo(()=>{
        const index = (value && value < panelList.length)?value:0;
        const Panel =  panelList[index];
        return <Panel/> 
    },[value]);

    return panel
}

const TabSection = ()=>{
    const containerRef = useRef(null);
    const [value, setValue] = useState(0);
    return (
        
            <Box ref={containerRef}>
                <TabMenu {...{value, setValue}}/>
                <Slide direction="up" key={value} in={true} container={containerRef.current}>
                    <div>
                        <TabPanel value={value}/>
                    </div>
                </Slide>
            </Box>
    );
}

const ItemAuctionBid = ({name, image, addr})=>{

    return (
        <Paper component={Stack} direction="row-reverse" sx={{p:.5}} spacing={1}>
            <Box position="relative">
                <Avatar variant="rounded" sx={{width:100, height:100, bgcolor:"#bbb"}} src={image}/>
                <Typography sx={{position:"absolute", top:2, right:5}} fontWeight="bold" variant="subtitle2">24:34:67</Typography>
                <Stack sx={{position:"absolute", bottom:5, left:5}} direction="row" alignItems="end" spacing={0.25}>
                    <ArrowUpIcon color="success" fontSize="small"/>
                    <Typography variant="subtitle2" fontWeight="bold">0.35</Typography>
                </Stack>
            </Box>
           <Box sx={{width:"100%"}}>
                <Stack>
                        <Typography fontWeight="bold">{name}</Typography>
                        <Stack direction="row" spacing={.5}>
                            <Typography component="div" variant="body2">Top Bidder</Typography>
                            <ElTypography variant="body2">{addr}</ElTypography> 
                        </Stack>
                        <Typography variant="body2">Reserve: 0.375ETH</Typography>
                        <Typography variant="body2">Rank: 13/25</Typography>
                </Stack>
           </Box>
        </Paper>
    );
}

const ItemOffer = ({name, image, isOfferFrom, addr})=>{

    return (
        <Paper component={Stack} direction="row" sx={{p:.5}} spacing={1}>
            <Avatar variant="rounded" sx={{width:120, height:120, bgcolor:"#bbb"}} src={image}/>
            <Box sx={{width:"100%"}}>
                <Stack>
                        <Typography fontWeight="bold">{name}</Typography>
                        <Stack direction="row" spacing={.5}>
                            <Typography component="div" variant="body2">{isOfferFrom?"To:":"From:"}</Typography>
                            <ElTypography variant="body2">{addr}</ElTypography> 
                        </Stack>
                        <Typography variant="body2">Reserve: 0.375ETH</Typography>
                    
                        <Stack alignItems="end" spacing={.5}>
                        <Typography variant="body2" fontStyle="italic" alignSelf="center" color="info">{"pending"}</Typography>
                        {isOfferFrom?
                        <Button size="small" variant="outlined" color="error">Cancel</Button>:
                        <ButtonGroup>
                            <Button size="small" variant="outlined" color="success">Accept</Button>
                            <Button size="small" variant="outlined" color="error">Reject</Button>
                        </ButtonGroup>}
                        </Stack>
                </Stack>
           </Box>
        </Paper>
    );
}

const ElTypography = styled(Typography)(()=>({
    overflow:"hidden",
    maxWidth:"10ch",
    textOverflow:"ellipsis"
}));

const Item = ({name, image, addr, addrLabel})=>{

    return (
        <Paper component={CardActionArea} sx={{height:"100%"}}>
            <Stack sx={{p:1, minHeight:250, height:"100%"}} spacing={1}>
                <Box component="img" sx={{width:"100%", height:"100%", bgcolor:"#bbb", borderRadius:1, objectFit:"cover"}} src={image}/>
                <Typography fontWeight="bold">{name}</Typography>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{addrLabel??"Creator"}</Typography>
                    <ElTypography>{addr}</ElTypography>
                </Stack>
            </Stack>
        </Paper>
    );
}