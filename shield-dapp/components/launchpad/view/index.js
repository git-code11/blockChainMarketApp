import {useMemo} from 'react';
import Chip from '@mui/material/Chip'
import MuiLinearProgress from "@mui/material/LinearProgress";
import {styled} from "@mui/material/styles";

const background_image = `repeating-linear-gradient(20deg, rgba(251,75,2,0.8) 0%, rgba(42,191,255,0.8) 20%, rgba(14,33,66,0.8) 40%);`
export const StyledLinearProgress = styled(MuiLinearProgress)(({theme})=>({
    borderRadius:theme.spacing(10),
    height:theme.spacing(1),
    ".MuiLinearProgress-bar":{
        backgroundImage:background_image,
        borderRadius:'inherit',
    }
}));


const StatusChip = ({status, color})=><Chip label={status} color={color}/>
const dexChip = <StatusChip status="Dex Avail" color="success"/>
const completeChip = <StatusChip status="Completed" color="success"/>
const pendingChip = <StatusChip status="UpComing" color="info"/>
const activeChip = <StatusChip status="Active" color="primary"/>
const closeChip = <StatusChip status="Ended" color="error"/>

export const LaunchStatus = ({data})=>{

    const {preSaleCompleted, lpCompleted, startTime, endTime} = data || {};

    const status = useMemo(()=>{
        const currentTime = Math.round(Date.now()/1000);
        let value;
        if(lpCompleted)
            value = completeChip;
        else if(preSaleCompleted)
            value = dexChip;
        else if(endTime < currentTime)
            value = closeChip;
        else if(startTime < currentTime)
            value = activeChip;
        else if(startTime > currentTime)
            value = pendingChip;
        
        return value;
    },[preSaleCompleted, startTime, endTime]);
    
    return status;
}
