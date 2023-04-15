import {useMemo, useCallback} from "react";

import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack"
import WalletOutlined from '@mui/icons-material/WalletOutlined';
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect } from 'wagmi';

import useUserToken,{useClearToken} from "../context/hook/useUserToken";



export default ()=>{
    const { isOpen, open} = useWeb3Modal();
    const {data, error, isLoading, clear} = useUserToken();
    const { status, isConnected } = useAccount({onDisconnect:clear});

    console.log("my token", data, error, isLoading);
    
    const _onClick = useCallback(async ()=>{
        if(!isOpen){
            await open();
        }
    },[open, isOpen]);

    const statusColor = useMemo(()=>{
        let color;
        switch(status){
            case "connected":
                color= data?"success":"info";
                break;
            case "disconnected":
                color="error";
                break
            default:
                color="warning";
        }
        return color;
    },[status, data]);


    return (
    <Stack direction="row">
        <IconButton sx={{cursor:{xs:"default", md:"pointer"}}} onClick={_onClick}>
            <Badge color={statusColor} variant="dot">
                <WalletOutlined fontSize="large" sx={{color:"#fff"}}/>
            </Badge>
        </IconButton>

        {isConnected &&
        <IconButton sx={{cursor:{xs:"default", md:"pointer"}}} onClick={clear}>
            <LoginOutlined fontSize="large" sx={{color:"#fff"}}/>
        </IconButton>
        }
    </Stack>
    )
}