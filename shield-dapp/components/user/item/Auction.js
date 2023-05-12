import Link from 'next/link';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ArrowUpward } from '@mui/icons-material';
import CardActionArea from "@mui/material/CardActionArea";

import ElTypography from '../../ElTypography';
import { Skeleton } from '@mui/material';
import { formatEther } from 'ethers/lib/utils.js';;

import useCurrency from '../../../context/hook/useCurrency';
import TimeBox from '../../TimeBox';

import { PunchClock } from '@mui/icons-material';

export default ({tokenId, loading, name, image, auction})=>{
    const {data:token} = useCurrency();

    return (
        <CardActionArea component={Link} href={loading?'#':`/item/${tokenId?.toString()}`}>
            
            <Paper component={Stack} direction="row-reverse" sx={{p:.5}} spacing={1}>
                    <Box position="relative">
                        {loading?
                            <Skeleton variant="rectangular" width={100} height={100}/>:
                            <Avatar variant="rounded" sx={{width:100, height:100, bgcolor:"#bbb"}} src={image}/>
                        }
                        
                        <Stack component={Box} sx={{position:"absolute", bottom:5, left:5}} direction="row" alignItems="end" spacing={0.25}>
                            <ArrowUpward color="success" fontSize="small"/>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {loading?<Skeleton width={40}/>:Number(auction?.price/auction?.reserve)?.toFixed(2)+'x'}
                            </Typography>
                        </Stack>
                    </Box>
                    <Box sx={{width:"100%"}}>
                        <Stack>
                            <Typography fontWeight="bold">{loading?<Skeleton width={80}/>:name.slice(0, 15)}</Typography>
                                <Stack direction="row" spacing={.5}>
                                    <Typography component="div" variant="body2">Top</Typography>
                                    <ElTypography variant="body2">{loading?<Skeleton width={40}/>:auction?.topBidder}</ElTypography> 
                                </Stack>
                                <Typography variant="body2">Reserve: {loading?<Skeleton width={30}/>:(+formatEther(auction?.reserve||0)).toFixed(2)}{token?.symbol}</Typography>
                                <Stack direction="row" alignItems="center">
                                    <PunchClock/>
                                    <Typography variant="body2">
                                        <TimeBox start={auction?.startTime} gap={auction?.diffTime}/>
                                    </Typography>
                                </Stack>
                        </Stack>
                    </Box>
            </Paper>
        </CardActionArea>
    );
}