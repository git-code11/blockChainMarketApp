import { Box, Stack, Paper, Skeleton, Button, Avatar, AvatarGroup, Typography } from "@mui/material";
import {Image as ScalableImage, Box as ScalableBox} from "../../components/Scalable";
import ElTypography from "../../components/ElTypography";
import BlurDarkBox from "../BlurBlackBox";

import {temp_c} from "../temp";

export default ({loading, title, image, creatorName, currentBidBase, last3TopBiddersImage, noOfBidPlaced})=>{

    return (
        <ScalableBox height="100%">
            <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2, height:"100%"}} spacing={1}>

                    <Paper sx={{maxHeight:{xs:"60vmin", sm:220}, overflowY:"hidden", width:"100%", borderRadius:2, position:"relative"}}>
                        
                        {loading?
                            <Skeleton variant="rounded" sx={{height:"100%", borderRadius:2}}/>:
                            <ScalableImage src={image}/>
                        }
                        
                        <Box position="absolute" right={0} top={0}>    
                            {loading ?
                                <Skeleton width={75} height={30}/>:
                                <BlurDarkBox component={Typography} fontWeight="bold" color="#fff" p={0.25} bgcolor="grey.200" >
                                    13h 22m 58s
                                </BlurDarkBox>
                            }
                        </Box>
                            
                    </Paper>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <AvatarGroup>
                            {last3TopBiddersImage.map((topBidderImage, i)=>
                                <Avatar key={i} sx={{width:30, height:30}} src={topBidderImage}/>
                                )}
                        </AvatarGroup>
                        
                        <Typography>{noOfBidPlaced} Placed Bids</Typography>
                    </Stack>

                    <Stack>
                        <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:title}</Typography>
                        <Typography variant="subtite2">{loading?<Skeleton width={50}/>:creatorName}</Typography>
                    </Stack>

                    <Stack justifyContent="space-between" alignItems="center" direction="row">
                        <Stack>
                            <Typography variant="subtite2">{loading?<Skeleton width={75}/>:"Current Bid"}</Typography>
                            <Typography variant="h5" fontWeight="bold">{loading?<Skeleton width={75}/>:currentBidBase}</Typography>
                        </Stack>

                        {loading?
                        <Skeleton variant="rounded" width={80} height={35}/>:
                        <Button variant="outlined" size="medium">Place a Bid</Button>}
                    </Stack>

            </Paper>
        </ScalableBox>
    );
}