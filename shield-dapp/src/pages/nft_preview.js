import {useState, useContext, createContext, useCallback} from "react";

import { TableContainer, Table, TableBody, TableRow, TableCell, TextField, DialogContentText, MenuItem } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { ButtonGroup, Button } from "@mui/material";
import { Typography, Fab } from "@mui/material";
import { Container, Box, Chip, Stack, Avatar, Paper, Tabs, Tab, styled, Modal, Alert, IconButton} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Check, Info, Error, Warning, WalletOutlined, Close, CloseRounded, MenuRounded} from "@mui/icons-material"

import {Drawer as MuiDrawer, Toolbar, AppBar as MuiAppBar, List, ListItem, Divider, ListItemButton} from "@mui/material";

const DEMO_TEXT =  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error aperiam, dolor nesciunt dicta.";
const temp_c = Array(5).fill(0).map((d,i)=>`/images/collection/collection-lg-0${i+1}.jpg`);
const temp_p = Array(5).fill(0).map((d,i)=>`/images/portfolio/portfolio-0${i+1}.jpg`);


const dialogContext = createContext();

const useDialog = ()=>useContext(dialogContext); 

const initDialogState = {offer:false, purchase:false, bid:false, process:false};

export default ()=>{
    
    const [state, update] = useState(initDialogState);

    const onOffer = useCallback(val=>update({...initDialogState, offer:val}),[update]);
    const onBid  = useCallback(val=>update({...initDialogState, bid:val}),[update]);
    const onPurchase = useCallback(val=> update({...initDialogState, purchase:val}),[update]);
    const onProcess = useCallback(val=>update({...initDialogState, process:val}),[update])
    
    return (
    <>
        <MenuHeader/>
        <Container sx={{my:2}}>
             <Stack spacing={2} mb={2}>
                <Grid container>
                    <Grid xs={12} md={8} mdOffset={2}>
                        <Avatar component={Paper} variant="rounded" bgcolor="grey.300" sx={{height:"auto", maxHeight:"65vmin", width:"100%"}} src={temp_c[0]}/>
                    </Grid>
                </Grid>
                <Typography variant="h6" fontWeight="bold">Shamekkfnn #749</Typography>
                
                <Stack direction="row" spacing={2} alignItems="end">
                    <Typography fontWeight="bold">Reserve Price</Typography>
                    <Typography fontWeight="bold" variant="h5">0.4367 ETH</Typography>
                </Stack>

            
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography fontWeight="bold">Auction</Typography>
                        <Typography><b>23</b> Bid Placed</Typography>
                    </Stack>
                    <Typography fontWeight="bold" variant="h5" textAlign="end">23:37:48</Typography>
                </Stack>
                
                <Typography>{DEMO_TEXT}</Typography>

                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{fontWeight:"bold"}}>Creator</TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Avatar src={temp_c[1]}/>
                                        <Typography>0x2378abcc3884d</Typography>
                                    </Stack>    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight:"bold"}}>Owner</TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Avatar src={temp_c[2]}/>
                                        <Typography>0x2378abcc3884d</Typography>
                                    </Stack>   
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack spacing={2}>
                    <Button variant="contained" fontWeight="bold" 
                        color="primary" onClick={()=>onBid(true)}>Place a Bid</Button>
                    <Button variant="contained" color="secondary" onClick={()=>onPurchase(true)}>Buy Now</Button>
                    <Button variant="contained" color="secondary" onClick={()=>onOffer(true)}>Make an offer</Button>
                </Stack>

                <Box>
                    <Divider sx={{my:2}}/>
                    <Typography>Tags</Typography>
                    <Stack direction="row" spacing={2} mt={1}>
                        <Chip sx={{fontSize:14}} label="#nft"/>
                        <Chip sx={{fontSize:14}} label="#blockchain"/>
                        <Chip sx={{fontSize:14}} label="#most featured"/>
                    </Stack>
                </Box>
            </Stack>
            <TabSection/>
        </Container>
        
        <dialogContext.Provider value={{state, onOffer, onBid, onPurchase, onProcess}}>
            <PopUpDialog/>
        </dialogContext.Provider>

        
    </>  

    );
}

const AppBar = styled(MuiAppBar)(({theme})=>({
    backdropFilter:"blur(15px)",
    backgroundColor:"#1d1d1dd1",//"transparent",
}));


const Drawer = styled(MuiDrawer)(()=>({
    "& .MuiDrawer-paper":{
        width:"300px",
        maxWidth:"80vw",
        backgroundColor:"#fff",//"transparent",
    }
}));

const MenuHeader = ()=>{
    const [open, setOpen] = useState(false);

    return (
        <>
            <AppBar position="fixed" color="secondary">
                <Toolbar>
                    <Avatar variant="square" src="/images/logo.png"/>
                    <Typography mx={1} flexGrow={1} fontSize="large" fontWeight="bold" color="common.white" fontStyle="italic">ShieldPact</Typography>
                    <IconButton>
                        <WalletOutlined fontSize="large" sx={{color:"#fff"}}/>
                    </IconButton>
                    <IconButton onClick={()=>setOpen(true)}>
                        <MenuRounded fontSize="large" sx={{color:"#fff"}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Drawer open={open} onClose={()=>setOpen(false)}>
                <Stack justifyContent="space-between" height="100%">
                    <Box>
                        <Toolbar sx={{bgcolor:"common.black", pr:2}} disableGutters>
                            <Avatar variant="square" src="/images/logo.png"/>
                            <Typography mx={1} flexGrow={1} fontSize="large" fontWeight="bold" color="common.white" fontStyle="italic">ShieldPact</Typography>
                            <IconButton color="error" onClick={()=>setOpen(false)}>
                                <CloseRounded fontSize="large"/>
                            </IconButton>
                        </Toolbar>
                        <Divider/>
                        <List sx={{"& .MuiListItemButton-root":{cursor:"pointer"}}}>
                            <ListItemButton>Home</ListItemButton>
                            <Divider variant="middle"/>
                            <ListItemButton>Explore</ListItemButton>
                            <Divider variant="middle"/>
                            <ListItemButton>Create NFT</ListItemButton>
                        </List>
                    </Box>
                    <Stack p={1} direction="row" bgcolor="#000" justifyContent="space-between" alignItems="center">
                        <Avatar src={temp_c[2]}/>
                        <Box>
                            <Typography fontWeight="bold" color="#fff">23.55ETH</Typography>
                            <Typography variant="body2" fontStyle="italic" color="#fff">0x3743993</Typography>                            
                        </Box>
                    </Stack>
                </Stack>
            </Drawer>
        </>
    )
}



const TabSection = ()=>{
    const [state, setState] = useState(0)
    
    return (
        <Box>
            <Tabs value={state} onChange={(e,v)=>setState(v)}>
                <Tab value={0} label="Transaction"/>
                <Tab value={1} label="Auction"/>
            </Tabs>

            <Box>
                <CommentList spacing={2} mt={2}>
                    {Array(5).fill(0).map((d,i)=>
                        <Comment key={i} uName="Kelvin_34s" uImage={temp_p[i%4]} time="3 days ago"
                            text={DEMO_TEXT}/>
                    )}
                </CommentList>
            </Box>

        </Box>
    );
}

const Comment = ({uImage, uName, time, text})=>{

    return (
        <Stack direction="row" spacing={1} position="relative" data-comment>
            <Avatar src={uImage}/>
            <Stack>
                <Typography>@{uName}</Typography>
                <Typography pl={4} pr={2}>{text}</Typography>
                <Typography alignSelf="end">{time}</Typography>
            </Stack>
        </Stack>
    )
}

const CommentList = styled(Stack)(({theme})=>({
    position:"relative",
    zindex:1,
    "&:before, & [data-comment]:last-child:before":{
        content:'""',
        position:"absolute",
        display:"block",
        width:4,
        borderRadius:10,
        height:"100%",
        backgroundColor:"#cccccccc",
        transform:"translate(18px)"
    },

    "& [data-comment]:last-child:before":{
        backgroundColor:theme.palette.background.paper,
    }
    
}));

const PopUpDialog = ()=>{

    return (
        <>
            <DialogBid/>
            <DialogPurchase/>
            <DialogOffer/>
            <DialogStepProcess/>
        </>
    )
}


const CustomInput = styled('input')(({theme})=>({
    display:"block",
    height:"80px",
    width:"100%",
    outline:"none",
    border:"none",
    backgroundColor:"transparent",
    textAlign:"end",
    fontSize:theme.spacing(5),
    margin:0,
    fontFamily:"consolas",
    paddingTop:"30px"
}));

const DialogBid = ()=>{

    const {state, onBid} = useDialog();

    return(
        <Dialog open={state.bid} onClose={()=>onBid(false)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>BID AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00"/>
                        <Typography fontWeight={600}>ETH</Typography>
                    </Stack>
                </Box>
                <Typography>Last Bid Amount: <b>45.33ETH</b></Typography>
                <Typography>Account Balance: <b>100.45ETH</b></Typography>
                <Alert variant="outlined" severity="info">
                    <Typography>
                        Amount placed can only be resolved after auction and 
                        amount placed would be sent back to you in respect of higher amount bid placed
                    </Typography>
                </Alert>
                <Typography color="warning">Estimated Gas Fee ~ <i><b>0.344ETH</b></i></Typography>
                <Button variant="outlined" size="large">Place Bid</Button>
            </Box>     
        </Dialog>
    )
}

const DialogPurchase = ()=>{
    const {state, onPurchase, onProcess} = useDialog();

    return(
        <Dialog open={state.purchase} onClose={()=>onPurchase(false)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>PRICE AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00" value={45.33} disabled/>
                        <Typography fontWeight={600}>ETH</Typography>
                    </Stack>
                </Box>
                <Typography>Account Balance: <b>100.45ETH</b></Typography>
                <Alert variant="outlined" severity="info">
                    <Typography>
                        Amount would be withdrawn from account
                    </Typography>
                </Alert>
                <Typography color="warning">Estimated Gas Fee ~ <i><b>0.344ETH</b></i></Typography>
                <Button variant="outlined" size="large" onClick={()=>onProcess(true)}>Purchase</Button>
            </Box>     
        </Dialog>
    )
}


const DialogOffer = ()=>{
    const {state, onOffer} = useDialog();
    return(
        <Dialog open={state.offer} onClose={()=>onOffer(false)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>OFFER AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00"/>
                        <Typography fontWeight={600}>ETH</Typography>
                    </Stack>
                </Box>
                <Typography>Last Bid Amount: <b>45.33ETH</b></Typography>
                <Typography>Account Balance: <b>100.45ETH</b></Typography>
                <Alert variant="outlined" severity="info">
                    <Typography>
                        Offer can be cancelled before been accepted or rejected
                    </Typography>
                </Alert>
                <Typography color="warning">Estimated Gas Fee ~ <i><b>0.344ETH</b></i></Typography>
                <Button variant="outlined" size="large">Make Offer</Button>
            </Box>     
        </Dialog>
    )
}

const DialogCreatePrice = ()=>{
    const {state} = useDialog();

    return(
        <Dialog open={true} onClose={()=>{}}>
            <Box p={2} component={Stack} spacing={2} minWidth="80vmin">
                <TextField placeholder="Price Amount" fullWidth/>
                <TextField placeholder="Currency" select fullWidth>
                    <MenuItem value="0x00">ETH</MenuItem>
                    <MenuItem value="0x01">BUSD</MenuItem>
                </TextField>
                <TextField placeholder="Deadline(hours)" fullWidth defaultValue={0}/>
                <Typography>
                    List Price Amount: 234.45ETH
                </Typography>
                <Button>Grant Permission</Button>
                <Button>Set Price</Button>
            </Box>
        </Dialog>
    )
}

const ProcessItem = styled(Stack)(({theme})=>({
    position:"relative",
    paddingBottom:"30px",
    "&:before":{
        content:'""',
        position:"absolute",
        display:"block",
        width:"4px",
        height:"calc(100% - 44px)",
        bottom:"2px",
        backgroundColor:"#cccccccc",
        transform:"translate(18px)"
    },

    "&:last-child":{
        paddingBottom:"0px",
        "&:before":{
            backgroundColor:"transparent"
        }
        
    }
}));

const StepProcess = ({loading, status, text})=>{

    return (
        <ProcessItem alignItems="center" spacing={2} direction="row">
            <Avatar sx={{bgcolor:theme=>loading?"transparent":(theme.palette[status]||theme.palette["info"]).main}} src={loading?"/ajax-loader.gif":""}>
                {
                    (status === "success" && <Check/>) ||
                    (status === "error" && <Error/>) ||
                    (status === "warning" && <Warning/>) ||
                    <Info/>
                }
            </Avatar>
            <Typography flexGrow={1}>{text}</Typography>
        </ProcessItem>
    )
}


const DialogStepProcess = (processing)=>{
    const {state, onProcess} = useDialog();

    return(
        <Dialog open={state.process} onClose={()=>onProcess(false)} fullWidth>
            <DialogActions>
                <Button component="a" href="#">Visit Explorer</Button>
            </DialogActions>
            <Stack p={2}>
                <StepProcess status="success" text="Get payment Details"/>
                <StepProcess status="info" text="Permission For Token Transfer"/>
                <StepProcess status="error" text="Payment for Item"/>
                <StepProcess status="warning" text="Waiting for Transaction"/>
                <StepProcess status="secondary" text="Getting Reciept"/>
                <StepProcess loading={true} text="finalizing"/>
            </Stack>
        </Dialog>
    )
}


