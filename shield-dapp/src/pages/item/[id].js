import { useMemo} from 'react';
import {useRouter} from "next/router";

import { TableContainer, Table, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";

import Button from "@mui/material/Button";
import { Typography, Fab } from "@mui/material";
import { Container, Box, Chip, Stack, Avatar, Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

import {useAccount, useContractReads} from "wagmi";
import nftAbi from "../../../contract/NFT.sol/NFT.json";
import saleAbi from "../../../contract/Sale.sol/MarketSales.json";
import auctionAbi from "../../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../../contract/address.js";

import { useIpfsData } from "../../../context/hook/ipfs";
import useCurrency from "../../../context/hook/useCurrency";

import {temp_c} from "../../../temp";
import { formatEther } from "ethers/lib/utils.js";

import ModalProvider,{useModal} from '../../../context/modal';

import DialogPurchase from '../../../components/dialog/purchase';
import DialogRemoveFromSale from '../../../components/dialog/removeFromSale';
import DialogAddToSale from '../../../components/dialog/addToSale';
import DialogCreationAuction from '../../../components/dialog/createAuction';
import DialogMakeBid from '../../../components/dialog/makeBid';
import DialogCloseAuction from '../../../components/dialog/closeAuction';
import DialogExtendAuction from '../../../components/dialog/extendAuction';

import e_msg from "../../../context/lib/e_msg";
import { constants, BigNumber } from "ethers";

import useSetTimeout from '../../../context/hook/useSetTimeout';

import Backdrop from '@mui/material/Backdrop';

import TimeBox from '../../../components/TimeBox';


const useAuctionClose = (startTime, diffTime)=>{
    const [closed] = useSetTimeout(
        (_cb, close)=>{
            if(startTime && diffTime && startTime > 0){
                let result = Date.now() > (startTime + diffTime)*1000;
                if(result)
                    close();
                _cb(result);
                return;
            }

            if(startTime === 0)
                close();
            _cb(false);
        }, 2000, false, [startTime, diffTime]
    );

    return closed;
}

const ContainerWrapper =  ({tokenId})=>{
    
    const {toggleId} = useModal();

    const {address:user} = useAccount();

    // const {data:uri, error, isLoading, refetch} = useContractRead({
    //     abi:nftAbi.abi,
    //     address:_contract.nft,
    //     functionName:"tokenURI",
    //     args:[tokenId],
    //     enabled:Boolean(tokenId)
    // });
    
    const {data:idata, isLoading, error, ...info} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"tokenURI",
                args:[tokenId],
            },
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
        enabled:Boolean(tokenId),
        watch:true
    });

    const [uri, creator, owner, saleData, auctionData] = idata||[];

    const {data:token} = useCurrency(saleData?.currency);
    const {data:native} = useCurrency();
    
    //console.log({uri, owner});
    const {data:fdata, ...ipfs} = useIpfsData(uri);
    const ipsLoading = !fdata || ipfs.isLoading;

    const [auctionStartTime, auctionDiffTime] = useMemo(()=>
        Boolean(auctionData) ? [auctionData.startTime.toNumber(), auctionData.diffTime.toNumber()]:[]
        ,[auctionData]);

    const auctionClosed = useAuctionClose(auctionStartTime, auctionDiffTime);

    if(!Boolean(tokenId) || isLoading){
        return (    
            <Backdrop open={true}>
                <CircularProgress size={50}/>
            </Backdrop>
                );
    }
    
    if(error || ipfs.error){
        return (
            <Backdrop open={true}>
                <Typography color="error">
                    {error?
                        e_msg(error)||"An Error Occured Reloading required":
                        e_msg(ipfs.error)||"An Error Occured While Fetching Ipfs Data"
                    }
                </Typography>
                {
                    error?
                    <Button disabled={!tokenId} onClick={()=>info.refetch()} variant="outlined">Retry</Button>:
                    <Button disabled={!tokenId} onClick={()=>ipfs.mutate()} variant="outlined">Reload</Button>
                }
            </Backdrop>
        );
    }
    
    const itemOnSale = saleData && saleData.amount.toBigInt() > 0 && owner !== _contract.auction;
    const salePrice = saleData && formatEther(saleData.amount);

    const itemOnAuction = auctionData && owner === _contract.auction;
    const auctionPrice = auctionData && formatEther(auctionData.reserve);

    const hasTopBidder = auctionData && _contract.auction === owner && auctionData && auctionData.topBidder !== constants.AddressZero;
    const numberOfBidPlaced = auctionData && auctionData.total.toNumber();

    const allowedToCloseAuction = auctionClosed && auctionData && (auctionData.creator === user || 
        (auctionData.topBidder !== constants.AddressZero && auctionData.topBidder === user))
    
    const allowedToExtendAuction = auctionData && !auctionData.scheduled && auctionData.creator === user;

    return (
            
    <Stack spacing={2} mb={2}>
        <Grid container>
            <Grid md={8} mdOffset={2}>
                <Paper>
                    {ipsLoading?
                        <Skeleton variant="rectangular" height="50vmin" width="100%"/>:
                        <Avatar variant="rounded" bgcolor="grey.300" sx={{height:"auto", maxHeight:"65vmin", width:"100%"}} src={fdata?.image}/>
                    }
                </Paper>
            </Grid>
        </Grid>
        <Typography variant="h6" fontWeight="bold">{ipsLoading?<Skeleton width={300}/>:fdata?.name}</Typography>
        
        {itemOnSale &&
        <Stack direction="row" spacing={2} alignItems="end">
            <Typography fontWeight="bold">Sale Price</Typography>
            <Typography fontWeight="bold" variant="h5">{isLoading?<Skeleton width={100}/>:salePrice}
                    {isLoading || token?.symbol}
                    </Typography>
        </Stack>}

        {!isLoading && itemOnAuction && 
        <Stack direction="row" spacing={2} alignItems="end">
            <Typography fontWeight="bold">Reserve Price</Typography>
            <Typography fontWeight="bold" variant="h5">{auctionPrice} {native.symbol}</Typography>
        </Stack>
        }

    
        {!isLoading && itemOnAuction && 
            <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
                <Typography fontWeight="bold">Auction</Typography>
                <Typography><b>{numberOfBidPlaced}</b> Bid Placed</Typography>
            </Stack>
            <Typography component="div" fontWeight="bold" variant="h5" textAlign="end">
                <TimeBox start={auctionStartTime} gap={auctionDiffTime}/>
            </Typography>
        </Stack>
        }
        
        <Typography>{ipsLoading?<Skeleton width="100%" height={100}/>:(fdata?.description)}</Typography>
        
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Creator</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[1]}/>
                                <Typography>{isLoading?<Skeleton width={100}/>:creator}</Typography>
                            </Stack>    
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Owner</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[2]}/>
                                <Typography>{isLoading?<Skeleton width={100}/>:owner}</Typography>
                            </Stack>   
                        </TableCell>
                    </TableRow>
                    {hasTopBidder &&
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Top Bidder</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Avatar src={temp_c[2]}/>
                                <Typography>{isLoading?<Skeleton width={100}/>:auctionData?.topBidder}</Typography>
                            </Stack>   
                        </TableCell>
                    </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>

        

        { 
            user === owner && 
            <Stack spacing={2}>
                {itemOnSale && 
                    <Button variant="contained" onClick={()=>toggleId("removeFromSale")}>Clear Market Value</Button>}
                <Button variant="contained" onClick={()=>toggleId("addToSale")}>Set MarketValue</Button>
                <Button variant="contained" onClick={()=>toggleId("createAuction")}>Create Auction</Button>
            </Stack>
        }
        
        {
            user !== owner &&
            <Stack spacing={2}>
                {itemOnAuction &&
                    <>
                    <Button variant="contained" fontWeight="bold" 
                        color="primary" onClick={()=>toggleId('makeBid')}>Place a Bid</Button>
                    
                    {allowedToExtendAuction && 
                        <Button variant="contained" color="secondary" onClick={()=>toggleId("extendAuction")}>Extend Auction</Button>
                    }

                    {allowedToCloseAuction &&
                        <Button variant="contained" color="secondary" onClick={()=>toggleId("closeAuction")}>Close Auction</Button>
                        }
                    </>
                        
                }
                {itemOnSale &&
                    <Button variant="contained" color="secondary" onClick={()=>toggleId("purchase")}>Buy Now</Button>
                }

                {/* !itemOnAuction &&
                    <Button variant="contained" color="secondary" onClick={()=>toggleId("offer")}>Make an offer</Button>
                */}
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

const ModalGroup = ({tokenId})=>{
    const {state, toggleId} = useModal();

    const cb = id=>()=>toggleId(id);

    return (
        <>
            {state.purchase && <DialogPurchase toggle={cb("purchase")} tokenId={tokenId}/> }
            {state.removeFromSale && <DialogRemoveFromSale toggle={cb("removeFromSale")} tokenId={tokenId}/>}
            {state.addToSale && <DialogAddToSale toggle={cb("addToSale")} tokenId={tokenId}/>}
            {state.createAuction && <DialogCreationAuction toggle={cb("createAuction")} tokenId={tokenId}/>}
            {state.makeBid && <DialogMakeBid toggle={cb("makeBid")} tokenId={tokenId}/>}
            {state.closeAuction && <DialogCloseAuction toggle={cb("closeAuction")} tokenId={tokenId}/>}
            {state.extendAuction && <DialogExtendAuction toggle={cb("extendAuction")} tokenId={tokenId}/>}
        </>
    )
}

export default ()=>{
    const router = useRouter();
    
    const tokenId = useMemo(()=>router.query.id?BigNumber.from(router.query.id):null, [router.query.id])

    return (
    <Container sx={{my:2}}>
        <ModalProvider>
            <ContainerWrapper tokenId={tokenId}/>
            <ModalGroup tokenId={tokenId}/>
        </ModalProvider>
    </Container>
    )
}
