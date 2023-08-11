import {useState, createContext, useContext, forwardRef} from "react";

import NLink from "next/link";
import { Box, Stack, Avatar,styled, IconButton, Typography} from "@mui/material";

import {CloseRounded, MenuRounded} from "@mui/icons-material"

import {Drawer as MuiDrawer, Toolbar, AppBar as MuiAppBar, List, Divider, ListItemButton} from "@mui/material";

import ConnectIcon from "./ConnectIcon";
import BalanceBar from "./BalanceBar";
import VerifyWalletModal from './VerifyWalletModal';

import {useAccount} from 'wagmi'

const TITLE = "ShieldDapp";


const AppBar = styled(MuiAppBar)(({theme})=>({
    backdropFilter:"blur(15px)",
}));


const Drawer = styled(MuiDrawer)(()=>({
    "& .MuiDrawer-paper":{
        width:"300px",
        maxWidth:"80vw",
        //backgroundColor:"#fff",//"transparent",
    }
}));

const drawerContext = createContext();
const useDrawer = ()=>useContext(drawerContext);


const NavBarUI = ()=>{
    const {open, setOpen} = useDrawer();

    return (
        <Box>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Avatar variant="square" src="/logo.png"/>
                    <Typography mx={1} flexGrow={1} fontSize="large" fontWeight="bold" color="secondary" fontStyle="italic">{TITLE}</Typography>
                    <ConnectIcon/>
                    <IconButton sx={{color:"common.white"}} onClick={()=>setOpen(true)}>
                        <MenuRounded fontSize="large" />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Drawer open={open} onClose={()=>setOpen(false)}>
                <Stack justifyContent="space-between" height="100%">
                    <Box>
                        <Toolbar sx={{bgcolor:"primary.dark", pr:2}} disableGutters>
                            <Avatar variant="square" src="/logo.png"/>
                            <Typography mx={1} flexGrow={1} fontSize="large" fontWeight="bold" color="secondary" fontStyle="italic">{TITLE}</Typography>
                            <IconButton color="error" onClick={()=>setOpen(false)}>
                                <CloseRounded fontSize="large"/>
                            </IconButton>
                        </Toolbar>
                        <Divider/>
                        <MenuList/>
                    </Box>
                    <BalanceBar/>
                </Stack>
            </Drawer>
            <VerifyWalletModal/>
        </Box>
    )
}




export default ()=>{
    const [open, setOpen] = useState(false);

    return (
        <drawerContext.Provider value={{open, setOpen}}>
            <NavBarUI/>
        </drawerContext.Provider>
    )
}

const Link = forwardRef((props, ref)=>{
    const {setOpen} = useDrawer();

    const onClick = ()=>{
        setOpen(false);
    };

    return (
        <NLink {...props} ref={ref} onClick={onClick}/>
    )
});

const MenuList = ()=>{

    

    return (
        <List sx={{"& .MuiListItemButton-root":{cursor:"pointer"}}}>
            <ListItemButton component={Link} href="/home">Home</ListItemButton>
            <Divider variant="middle"/>
            <ListItemButton component={Link} href="/explore/0/0">Explore</ListItemButton>
            <Divider variant="middle"/> 
            <ListItemButton component={Link} href="/swap">Swap Exchange</ListItemButton>
            <Divider variant="middle"/>
            <ListItemButton component={Link} href="/launch/list">Launch List</ListItemButton>
            <Divider variant="middle"/>
            <AccountNeededMenu/>
        </List>
    )
}


const AccountNeededMenu = ()=>{
   const {isConnected} = useAccount();

    return isConnected?
        <>
            <ListItemButton component={Link} href="/nft_create">Create NFT</ListItemButton>
            <Divider variant="middle"/>
            <ListItemButton component={Link} href="/launch/list/created">Created Launch</ListItemButton>
            <Divider variant="middle"/>
            <ListItemButton component={Link} href="/launch/create">Create Pad</ListItemButton>
            <Divider variant="middle"/>
            <ListItemButton component={Link} href="/launch/token">Create Token</ListItemButton>
        </>
       :null;
      
}
