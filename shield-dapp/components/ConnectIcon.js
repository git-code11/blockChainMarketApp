import {useMemo, useCallback} from "react";

import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack"
import WalletOutlined from '@mui/icons-material/WalletOutlined';
//import LoginOutlined from "@mui/icons-material/LoginOutlined";
//import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
//import { useWeb3Modal } from "@web3modal/react";

import { useAccount, useDisconnect, useConnect } from 'wagmi';

import useToken from "../context/hook/user/useToken";

import {hardhat} from 'wagmi/chains';


export default ()=>{
    //const { isOpen, open} = useWeb3Modal();
    const {connect, connectors} = useConnect();
    
    const {data, clear} = useToken();
    const { status, isConnected } = useAccount({onDisconnect:clear});
    const {disconnect} = useDisconnect();

    //console.log("my token", data, error, isLoading);
    
    const _onClick = useCallback(async ()=>{
        if(!isConnected){
            await connect({chainId:hardhat.id,connector:connectors[0]});
        }else{
            disconnect();
        }
    },[isConnected, connect, disconnect]);

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
    </Stack>
    )
}