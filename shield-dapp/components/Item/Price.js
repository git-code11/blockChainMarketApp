import Link from 'next/link';
import { IconButton, Box, Stack, Paper, Skeleton, Button, Avatar, Typography } from "@mui/material";
import {FavoriteRounded} from "@mui/icons-material"
import { red } from '@mui/material/colors';
import {Image as ScalableImage, Box as ScalableBox} from "../Scalable";
import ElTypography from "../ElTypography";
import { formatEther } from 'ethers/lib/utils.js';

import { temp_c } from '../../temp';
import useGetTickPrice from '../../context/hook/useGetTickPrice';

export default ({loading, image, name, creator, sale, currency, tokenId })=>{
    
    const salePrice =  sale && Number(formatEther(sale?.amount));
    const sTickPrice = useGetTickPrice({currency, amount:salePrice});
    
    const salePriceStr = salePrice ?Number(salePrice.toFixed(6)):"";
    const sTickPriceStr = sTickPrice ? sTickPrice?.toFixed(2):"";

    return (
            <ScalableBox>
                <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2, pb:0.5}} spacing={1}>
                        
                    <Paper sx={{width:"100%", borderRadius:2, position:"relative"}}>
                        
                        {loading?
                            <Skeleton variant="rounded" sx={{height:"100%", minHeight:"220px", borderRadius:2}}/>:
                            <ScalableImage src={image} sx={{minHeight:"220px"}}/>
                        }

                        <Box position="absolute" top={0} right={0}>    
                            
                            {loading?
                            <Skeleton variant="circular" sx={{width:30, height:30}}/>:
                            <IconButton>
                                <FavoriteRounded size="large" sx={{color:red[600]}}/>
                            </IconButton>
                            }
                            
                        </Box>

                    </Paper>

                    <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:name}</Typography>

                    <Stack justifyContent="space-between" direction="row">
                        <Typography variant="subtitel">{loading?<Skeleton width={50}/>:"Price"}</Typography>
                        <Stack>
                            <Typography fontWeight="bold" variant="body1">{loading?<Skeleton width={95}/>:salePriceStr} {loading?'':currency?.symbol}</Typography>
                            <Typography variant="body2">{loading?<Skeleton width={100}/>:(sTickPriceStr && `~$${sTickPriceStr}`)}</Typography>
                        </Stack>
                    </Stack>

                    <Stack justifyContent="space-between" alignItems="center" direction="row">
                        <Typography variant="subtitel">{loading?<Skeleton width={75}/>:"Creator"}</Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                            {loading?<Skeleton variant="circular" width={30} height={30}/>:<Avatar sx={{width:25, height:25}} src={temp_c[2]}/>}
                            <ElTypography fontWeight="bold" variant="body2">{loading?<Skeleton width={120}/>:creator}</ElTypography>
                        </Stack>
                    </Stack>

                    <Button component={Link} href={loading?'#':`/item/${tokenId?.toString()}`}>Buy Now</Button>
                </Paper>
            </ScalableBox>
    );
}

