
import { Stack } from "@mui/material";
import { Avatar } from "@mui/material";
import { Typography } from "@mui/material";
import { Container, Box, Paper, Skeleton} from "@mui/material";

import {styled} from "@mui/system";
import {WalletTwoTone} from "@mui/icons-material"


const ColoredPaper = styled(Paper)(({theme})=>({
    backgroundImage:"linear-gradient(137deg, #6c5bb1, #5badb1, #5bb15e, #a0b15b, transparent)",
    borderRadius:theme.spacing(1),
    color:"#fff"
}));




export default ()=>{

    return (
        <Container component={Stack} spacing={4} sx={{py:3, px:3}} maxWidth="xs">
            <AccountInfoHeader/>

            <BalanceCard/>
            
            <Stack direction="row" justifyContent="space-between">
                <ActionOption/>
                <ActionOption/>
                <ActionOption/>
                <ActionOption/>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <ActionButton/>
                <ActionButton/>
            </Stack>

        </Container>

    );
}

const AccountInfoHeader = ()=>{

    const loading = true; 
    
    return (
        <Stack alignItems="center" justifyContent="space-between" direction="row">
            <Stack>
                <Typography fontSize={16} fontWeight={500}>{loading?<Skeleton width={50}/>:"Hello,"}</Typography>
                <Typography fontSize={20} fontWeight={600}>{loading?<Skeleton width={150}/>:"Benmia Johnson"}</Typography>
            </Stack>
            {loading?<Skeleton variant="circular" width={50} height={50}/>:<Avatar sx={{width:50, height:50}}/>}
        </Stack>
    );
}


const BalanceCard = ()=>{

    const loading = true;

    return (
        loading?
        <Skeleton variant="rounded" height={150} sx={{borderRadius:1}}/>:
        <ColoredPaper component={Stack} justifyContent="center" sx={{px:3, height:150}}>
            <Stack>
                <Typography fontSize={30}>$27,340</Typography>
                <Typography fontSize={16}>Total balance</Typography>
            </Stack>
        </ColoredPaper>
    );
}


const ActionOption = ()=>{
    const loading = true;

    return (
        <Stack spacing={1} alignItems="center">
            {loading?
            <Skeleton variant="rounded" width={60} height={60}/>:
            <Avatar variant="rounded" sx={{width:60, height:60}} color="#f00">
                <WalletTwoTone fontSize="large"/>
            </Avatar>}
            <Typography fontWeight="bold">{loading?<Skeleton width={50}/>:"Wallet"}</Typography>
        </Stack>
    );
}

const ActionButton = ()=>{
    const loading = true;

    return (
        loading?
        <Skeleton variant="rounded" height={55} width={120}/>:
        <Paper component={Stack} direction="row" alignItems="center" spacing={1} sx={{p:1, color:"#fff", bgcolor:"#000"}}>
            <WalletTwoTone fontSize="large"/>
            <Typography fontWeight="bold" fontSize={18}>Deposit</Typography>
        </Paper>
    );
}