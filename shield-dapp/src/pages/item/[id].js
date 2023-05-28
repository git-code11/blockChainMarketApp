import {useState, useEffect, useCallback} from 'react';
import {useRouter} from "next/router";

import { TableContainer, Table, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";

import Button from "@mui/material/Button";
import { Typography, Fab } from "@mui/material";
import { Container, Box, Chip, Stack, Avatar, Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

import {useAccount, useContractRead, useContractReads,  useNetwork, useToken} from "wagmi";
import nftAbi from "../../../contract/NFT.sol/NFT.json";
import saleAbi from "../../../contract/Sale.sol/MarketSales.json";
import auctionAbi from "../../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../../contract/address.json";

import { useIpfsData } from "../../../context/lib/ipfs";
import useCurrency from "../../../context/hook/useCurrency";

import {temp_c} from "../../../temp";
import { formatEther } from "ethers/lib/utils.js";

import Provider,{useDataContext} from '../../../components/dialog/context';
import DialogPurchase from '../../../components/dialog/purchase';
import DialogRemoveFromSale from '../../../components/dialog/removeFromSale';
import DialogAddToSale from '../../../components/dialog/addToSale';
import DialogCreationAuction from '../../../components/dialog/createAuction';
import DialogMakeBid from '../../../components/dialog/makeBid';
import DialogCloseAuction from '../../../components/dialog/closeAuction';
import DialogExtendAuction from '../../../components/dialog/extendAuction';

import e_msg from "../../../context/lib/e_msg";
import { constants } from "ethers";

import useSetTimeout from '../../../context/hook/useSetTimeout';

import Backdrop from '@mui/material/Backdrop';

import TimeBox from '../../../components/TimeBox';


const ContainerWrapper =  ()=>{
    
    const {globalData, show} = useDataContext();
    const {tokenId} = globalData;
    const {address:userAddress} = useAccount();

    const {data:uri, error, isLoading, refetch} = useContractRead({
        abi:nftAbi.abi,
        address:_contract.nft,
        functionName:"tokenURI",
        args:[tokenId],
        enabled:!!tokenId
    });
    
    const {data:idata, ...info} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"itemCreator",
                args:[tokenId]
            },
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"ownerOf",
                args:[tokenId]
            },
            {
                abi:saleAbi.abi,
                address:_contract.sale,
                functionName:"ItemForSale",
                args:[tokenId]
            },
            {
                abi:auctionAbi.abi,
                address:_contract.auction,
                functionName:"auctions",
                args:[tokenId]
            }
           
        ],
        enabled:!!tokenId,
        watch:true
    });

    const {data:tokenDetails} = useCurrency(idata?.[2]?.currency);
    const {data:nativeCurrency} = useCurrency();

    const iLoading = info.isLoading || !idata;

    const {data:fdata, ...ipfs} = useIpfsData(uri);

    
    const [auctionClose] = useSetTimeout(
        (_cb, close)=>{
            
            if(idata?.[3]?.startTime?.gt(0)){
                let result = Date.now() > idata[3].startTime?.add(idata[3].diffTime)?.mul(1000);
                if(result)
                    close();
                _cb(result);
                return;
            }

            if(idata?.[3]?.startTime?.eq(0))
                close();
            _cb(false);
        }, 2000, false, idata?.[3]?.startTime
    );

    if(!tokenId || isLoading){
        return (    
            <Backdrop in={true}>
                <CircularProgress size={50}/>
            </Backdrop>
                );
    }
    
    if(error || ipfs.error){
        return (
            <Backdrop in={true}>
            <Typography color="error">
                {error?
                    e_msg(error)||"An Error Occured Reloading required":
                    e_msg(ipfs.error)||"An Error Occured While Fetching Ipfs Data"
                }
            </Typography>
            {
                error?
                <Button disabled={!tokenId} onClick={()=>refetch()} variant="outlined">Retry</Button>:
                <Button disabled={!tokenId} onClick={()=>ipfs.mutate()} variant="outlined">Reload</Button>
            }
        </Backdrop>
        );
    }
    
    return (
            
    <Stack spacing={2} mb={2}>
        <Grid container>
            <Grid xs={12} md={8} mdOffset={2}>
                <Paper>
                    {ipfs.isLoading?
                        <Skeleton variant="rectangular" height="50vmin" width="100%"/>:
                        <Avatar variant="rounded" bgcolor="grey.300" sx={{height:"auto", maxHeight:"65vmin", width:"100%"}} src={fdata?.image}/>
                    }
                </Paper>
            </Grid>
        </Grid>
        <Typography variant="h6" fontWeight="bold">{ipfs.isLoading?<Skeleton width={300}/>:fdata?.name}</Typography>
        
        {idata?.[2]?.amount?.gt(0) && _contract.auction !== idata?.[1] &&
        <Stack direction="row" spacing={2} alignItems="end">
            <Typography fontWeight="bold">Sale Price</Typography>
            <Typography fontWeight="bold" variant="h5">{iLoading?<Skeleton width={100}/>:formatEther(idata[2]?.amount||0)}
                    {iLoading || tokenDetails?.symbol}
                    </Typography>
        </Stack>}

        {!iLoading && idata[3] && _contract.auction === idata?.[1] && 
        <Stack direction="row" spacing={2} alignItems="end">
            <Typography fontWeight="bold">Reserve Price</Typography>
            <Typography fontWeight="bold" variant="h5">{formatEther(idata[3]?.reserve?.toString()||0)} {nativeCurrency.symbol}</Typography>
        </Stack>
        }

    
        {!iLoading && idata[3] && _contract.auction === idata?.[1] && 
            <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
                <Typography fontWeight="bold">Auction</Typography>
                <Typography><b>{idata?.[3]?.total?.toString()}</b> Bid Placed</Typography>
            </Stack>
            <Typography fontWeight="bold" variant="h5" textAlign="end">
                <TimeBox start={idata?.[3]?.startTime} gap={idata?.[3]?.diffTime}/>
            </Typography>
        </Stack>
        }
        
        <Typography>{ipfs.isLoading?<Skeleton width="100%" height={100}/>:(fdata?.description)}</Typography>
        
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Creator</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[1]}/>
                                <Typography>{iLoading?<Skeleton width={100}/>:idata[0]}</Typography>
                            </Stack>    
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Owner</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[2]}/>
                                <Typography>{iLoading?<Skeleton width={100}/>:idata[1]}</Typography>
                            </Stack>   
                        </TableCell>
                    </TableRow>
                    {_contract.auction === idata?.[1] && idata?.[3]?.topBidder !== constants.AddressZero &&
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Top Bidder</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[2]}/>
                                <Typography>{iLoading?<Skeleton width={100}/>:idata?.[3]?.topBidder}</Typography>
                            </Stack>   
                        </TableCell>
                    </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>

        

        { userAddress === idata?.[1] ?

        <Stack spacing={2}>
            {idata?.[2]?.amount?.gt(0) && <Button variant="contained" onClick={()=>show("removeFromSale")}>Clear Market Value</Button>}
            <Button variant="contained" onClick={()=>show("addToSale")}>Set MarketValue</Button>
            <Button variant="contained" onClick={()=>show("createAuction")}>Create Auction</Button>
        </Stack>
        :
        <Stack spacing={2}>
            {_contract.auction === idata?.[1] &&
                <>
                <Button variant="contained" fontWeight="bold" 
                    color="primary" onClick={()=>show('makeBid')}>Place a Bid</Button>
                
                {!idata?.[3]?.scheduled && idata?.[3]?.creator === userAddress && 
                    <Button variant="contained" color="secondary" onClick={()=>show("extendAuction")}>Extend Auction</Button>
                }

                {(idata?.[3]?.creator === userAddress || 
                    (idata?.[3]?.topBidder !== constants.AddressZero && idata?.[3]?.topBidder === userAddress)) &&
                    auctionClose &&
                    <Button variant="contained" color="secondary" onClick={()=>show("closeAuction")}>Close Auction</Button>
                    }
                </>
                    
            }
            {_contract.auction !== idata?.[1] && idata?.[2]?.amount?.gt(0) &&
                <Button variant="contained" color="secondary" onClick={()=>show("purchase")}>Buy Now</Button>
            }

            {_contract.auction !== idata?.[1] && idata?.[2]?.amount?.eq(0) &&
                <Button variant="contained" color="secondary" onClick={()=>show("offer")}>Make an offer</Button>
            }
        </Stack>
        }

        <Box>
            <Divider sx={{my:2}}/>
            <Typography>Tags</Typography>
            <Stack direction="row" spacing={2} mt={1}>
                <Chip sx={{fontSize:14}} label="#nft"/>
                <Chip sx={{fontSize:14}} label="#blockchain"/>
                <Chip sx={{fontSize:14}} label="#most featured"/>
            </Stack>
        </Box>
    </Stack>
    );
}


export default ()=>{
    const router = useRouter();
    
    return (
    <Container sx={{my:2}}>
        <Provider globalData={{tokenId:+router.query.id}}>
            <ContainerWrapper/>
            <div>
                <DialogPurchase id="purchase"/>
                <DialogRemoveFromSale id="removeFromSale"/>
                <DialogAddToSale id="addToSale"/>
                <DialogCreationAuction id="createAuction"/>
                <DialogMakeBid id="makeBid"/>
                <DialogCloseAuction id="closeAuction"/>
                <DialogExtendAuction id="extendAuction"/>
            </div>
        </Provider>
    </Container>
    )
}
