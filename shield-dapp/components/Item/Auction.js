import {useMemo} from 'react';
import Link from 'next/link';
import { Box, Stack, Paper, Skeleton, Button, Avatar, AvatarGroup, Typography } from "@mui/material";
import {Image as ScalableImage, Box as ScalableBox} from "../../components/Scalable";
import ElTypography from "../../components/ElTypography";
import BlurDarkBox from "../BlurBlackBox";
import { formatEther } from "ethers/lib/utils.js";
import {temp_c} from "../../temp";

import TimeBox from '../TimeBox';

export default ({tokenId, loading, name, image, auction, currency, creator})=>{

    return (
        <ScalableBox height="100%">
            <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2, height:"100%"}} spacing={1}>

                    <Paper sx={{maxHeight:{xs:"60vmin", sm:220}, overflowY:"hidden", width:"100%", borderRadius:2, position:"relative"}}>
                        
                        {loading?
                            <Skeleton variant="rounded" height={250} sx={{borderRadius:2}}/>:
                            <ScalableImage src={image}/>
                        }
                        
                        <Box position="absolute" right={0} top={0}>   
                            {loading ?
                                <Skeleton width={75} height={30}/>:
                                <BlurDarkBox component={Typography} fontWeight="bold" color="#fff" p={0.25} bgcolor="grey.200" >
                                    <TimeBox start={auction?.startTime} gap={auction?.diffTime}/>
                                </BlurDarkBox>
                            }
                        </Box>

                        <Box position="absolute" right={0} bottom={0}>   
                            {loading ?
                                <Skeleton width={30} height={30}/>:
                                <BlurDarkBox component={Typography} fontWeight="bold" color="#fff" p={0.25} bgcolor="grey.200" >
                                    {/*Number(auction?.price?.div(auction?.reserve))?.toFixed(2)*/}
                                    {Number(auction?.price/auction?.reserve)?.toFixed(2)}x
                                </BlurDarkBox>
                            }
                        </Box>
                            
                    </Paper>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <AvatarGroup>
                            {loading?
                            Array(2).fill(0).map((_, i)=>
                                <Skeleton variant="circular" width={30} height={30}/>
                                )
                            :Array(2).fill(0).map((_, i)=>
                                <Avatar key={i} sx={{width:30, height:30}} src={temp_c[i]}/>
                                )
                            }

                        </AvatarGroup>
                        <Typography>{loading?<Skeleton width={30}/>:`${auction?.total} Placed Bids`}</Typography>
                    </Stack>

                    <Stack>
                        <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:name}</Typography>
                        <ElTypography variant="subtite2">{loading?<Skeleton width={50}/>:creator}</ElTypography>
                    </Stack>

                    <Stack justifyContent="space-between" alignItems="center" direction="row">
                        <Stack>
                            <Typography variant="subtite2">{loading?<Skeleton width={75}/>:"Current Bid"}</Typography>
                            <Typography variant="h5" fontWeight="bold">{loading?<Skeleton width={75}/>:formatEther(auction?.price.gt(0)?auction?.price:auction?.reserve)}{loading?"":currency?.symbol}</Typography>
                        </Stack>

                        {loading?
                        <Skeleton variant="rounded" width={80} height={35}/>:
                        <Button variant="outlined" size="medium" component={Link} href={`/item/${tokenId}`}>Place a Bid</Button>}
                    </Stack>

            </Paper>
        </ScalableBox>
    );
}