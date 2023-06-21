import Link from "next/link";
import {Box, Stack, Avatar, Divider, Paper as MuiPaper,
    Button, Typography, Skeleton} from "@mui/material"
import {styled} from "@mui/material/styles";

import { temp_c } from "../../../temp"
import useFmtTime from "../../../context/hook/useFmtTime";

import {StyledLinearProgress} from '.';

const Paper = styled(MuiPaper)(({theme})=>({
    borderRadius: "10px",
    background: `linear-gradient(145deg, #e6e6e6, ${theme.palette.background.default})`,
    boxShadow:  `20px 20px 60px #d9d9d9,
                 -20px -20px 60px ${theme.palette.background.default}`
}));


export default ({
    address,
    detail,
    data,
    loading
    })=>{

    const {name, capped, saleRate, launchSym, buySym, 
        totalParticipant, startTime, endTime, tokenSold, tokenTotal, percent
    } = data;

    const currentTime = Math.round(Date.now()/1000);
    const started = currentTime > startTime;
    const startFmtTime = useFmtTime(currentTime - startTime);
    const endFmtTime = useFmtTime(endTime - currentTime);
    const percentStr = isNaN(percent)?'':percent.toFixed(2);

    return (
    
    <Stack component={Paper} p={3} spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
            {loading?<Skeleton variant="circular" width={60} height={60}/>:
            
            <Avatar src={detail?.logoUrl || temp_c[0]} sx={{
                width:60,
                height:60
            }}/>}
            
            <Typography variant="h6" fontWeight="bold">{loading?<Skeleton width={50}/>:(detail?.name || name)}</Typography>
        </Stack>

        <Stack>
            <Typography variant="body2">{loading?<Skeleton width={50}/>:"Swap Rate"}</Typography>
            <Typography  fontWeight="bold">{loading?<Skeleton width={50}/>:`1 ${buySym} = ${saleRate} ${launchSym}`}</Typography>
        </Stack>
        
        <Stack spacing={0.25}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{loading?<Skeleton width={50}/>:`Progress(${percentStr}%)`}</Typography>
                <Typography variant="subtitle2">{loading?<Skeleton width={50}/>:`Participants ${totalParticipant}`}</Typography>
            </Stack>

            <StyledLinearProgress value={percent} variant="determinate" sx={{visibility:loading?'hidden':'visible'}}/>

            <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{loading?<Skeleton width={50}/>:`${tokenSold} ${launchSym}`}</Typography>
                <Typography variant="subtitle2">{loading?<Skeleton width={50}/>:`${tokenTotal} ${launchSym}`}</Typography>
            </Stack>
        </Stack>

        <Box>
            <Divider/>
            <Stack direction="row" mt={1} justifyContent="space-between">
                {
                    started?
                    <Stack>
                        <Typography fontWeight="bold" variant="body2">{loading?<Skeleton width={50}/>:"Sale Ends In:"}</Typography>
                        <Typography fontFamily="monospace">{loading?<Skeleton width={50}/>:endFmtTime}</Typography>
                    </Stack>:
                    <Stack>
                        <Typography fontWeight="bold" variant="body2">{loading?<Skeleton width={50}/>:"Sale Starts In:"}</Typography>
                        <Typography fontFamily="monospace">{loading?<Skeleton width={50}/>:startFmtTime}</Typography>
                    </Stack>
                }

                    <Stack alignItems="center">
                        <Typography fontWeight="bold" variant="body2">{loading?<Skeleton width={50}/>:"Capped:"}</Typography>
                        <Typography fontFamily="monospace">{loading?<Skeleton width={50}/>:`${capped} ${buySym}`}</Typography>
                    </Stack>

                {loading?<Skeleton width={50}/>:<Button color="secondary" disableElevation variant="contained" component={Link} href={`/launch/info/${address}`}>View</Button>}
            </Stack>
        </Box>
    </Stack>
    )
}