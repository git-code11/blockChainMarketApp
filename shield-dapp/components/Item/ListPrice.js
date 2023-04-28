import Link from 'next/link';
import { IconButton, Box, Stack, Paper, Skeleton, Button, Avatar, Typography } from "@mui/material";
import {FavoriteRounded} from "@mui/icons-material"
import { red } from '@mui/material/colors';
import {Image as ScalableImage, Box as ScalableBox} from "../../components/Scalable";
import ElTypography from "../../components/ElTypography";
import { useContractReads } from "wagmi";
import { useIpfsData } from "../../context/lib/ipfs";
import { utils } from "ethers";

import nftAbi from '../../contract/NFT.sol/NFT.json';
import saleAbi from '../../contract/Sale.sol/MarketSales.json';
import _contract from '../../contract/address.json';

export default ({tokenId, creatorImage})=>{

    const {data, isLoading} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"tokenURI",
                args:[tokenId]
            },
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"itemCreator",
                args:[tokenId]
            },
            {
                abi:saleAbi.abi,
                address:_contract.sale,
                functionName:"ItemForSale",
                args:[tokenId]
            }
        ]
    });

    const {data:idata, ...ipfs} = useIpfsData(data?.[0]);
    

    const loading = isLoading || ipfs.isLoading;
     
    return (
        <Link href={`/item/${tokenId.toString()}`} style={{textDecoration:"none"}}>
            <ScalableBox>
                <Paper component={Stack} sx={{p:1.5, pb:2, borderRadius:2, pb:0.5}} spacing={1}>
                        
                    <Paper sx={{width:"100%", borderRadius:2, position:"relative"}}>
                        
                        {loading?
                            <Skeleton variant="rounded" sx={{height:"100%", minHeight:"220px", borderRadius:2}}/>:
                            <ScalableImage src={idata?.image} sx={{minHeight:"220px"}}/>
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

                    <Typography variant="body1" fontWeight="bold">{loading?<Skeleton width={200}/>:idata?.name}</Typography>

                    <Stack justifyContent="space-between" direction="row">
                        <Typography variant="subtitel">{loading?<Skeleton width={50}/>:"Price"}</Typography>
                        <Stack>
                            <Typography fontWeight="bold" variant="body1">{loading?<Skeleton width={95}/>:Number(utils.formatUnits(data[2].amount)).toFixed(6)+'BNB'}</Typography>
                            <Typography variant="body2">{loading?<Skeleton width={100}/>:`~$${(data[2]?.amount||0)/200}`}</Typography>
                        </Stack>
                    </Stack>

                    <Stack justifyContent="space-between" alignItems="center" direction="row">
                        <Typography variant="subtitel">{loading?<Skeleton width={75}/>:"Creator"}</Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                            {loading?<Skeleton variant="circular" width={30} height={30}/>:<Avatar sx={{width:25, height:25}} src={creatorImage}/>}
                            <ElTypography fontWeight="bold" variant="body2">{loading?<Skeleton width={120}/>:data[1]}</ElTypography>
                        </Stack>
                    </Stack>

                    <Button>Buy Now</Button>

                </Paper>
            </ScalableBox>
        </Link>
    );
}

