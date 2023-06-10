import {useState} from "react";

import Link from "next/link";
import { Box, Stack, Avatar,styled, IconButton, Typography} from "@mui/material";

import {CloseRounded, MenuRounded} from "@mui/icons-material"

import {Drawer as MuiDrawer, Toolbar, AppBar as MuiAppBar, List, Divider, ListItemButton} from "@mui/material";

import ConnectIcon from "./ConnectIcon";
import BalanceBar from "./BalanceBar";
import VerifyWalletModal from './VerifyWalletModal';

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

export default ()=>{
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <AppBar position="fixed" color="secondary">
                <Toolbar>
                    <Avatar variant="square" src="/logo.png"/>
                    <Typography mx={1} flexGrow={1} fontSize="large" fontWeight="bold" color="common.white" fontStyle="italic">ShieldPact</Typography>
                    <ConnectIcon/>
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
                            <ListItemButton component={Link} href="/home">Home</ListItemButton>
                            <Divider variant="middle"/>
                            <ListItemButton component={Link} href="/explore/0">Explore</ListItemButton>
                            <Divider variant="middle"/>
                            <ListItemButton component={Link} href="/nft_create">Create NFT</ListItemButton>
                            <Divider variant="middle"/>
                            <ListItemButton component={Link} href="/swap">Swap Exchange</ListItemButton>
                        </List>
                    </Box>
                    <BalanceBar/>
                </Stack>
            </Drawer>
            <VerifyWalletModal/>
        </Box>
    )
}