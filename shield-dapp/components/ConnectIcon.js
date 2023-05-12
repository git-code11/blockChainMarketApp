import {useMemo, useCallback} from "react";

import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack"
import WalletOutlined from '@mui/icons-material/WalletOutlined';
//import LoginOutlined from "@mui/icons-material/LoginOutlined";
//import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
//import { useWeb3Modal } from "@web3modal/react";

import { useAccount} from 'wagmi';
import { useWeb3Modal } from "@web3modal/react";
import useAuth from "../context/hook/user/useAuth";
;


export default ()=>{
    const { isOpen, open} = useWeb3Modal();
    
    const {connect, disconnect, connected} = useAuth();
    const { status, isConnected } = useAccount();

    //console.log("my token", data, error, isLoading);
    const onClick = useCallback(async ()=>{
        if(!isOpen){
            await open();
        }
    },[isOpen, open]);

    /* const _onClick = useCallback(()=>{
        if(!isConnected){
            connect();
        }else{
            disconnect();
        }
    },[isConnected, connect, disconnect]); */

    const statusColor = useMemo(()=>{
        let color;
        switch(status){
            case "connected":
                color= connected?"success":"info";
                break;
            case "disconnected":
                color="error";
                break
            default:
                color="warning";
        }
        return color;
    },[status, connected]);


    return (
    <Stack direction="row">
        <IconButton sx={{cursor:{xs:"default", md:"pointer"}}} onClick={onClick}>
            <Badge color={statusColor} variant="dot">
                <WalletOutlined fontSize="large" sx={{color:"#fff"}}/>
            </Badge>
        </IconButton>
    </Stack>
    )
}