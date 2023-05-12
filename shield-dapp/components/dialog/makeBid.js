import {useState, useMemo} from 'react';
import {useBalance, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import { useDebounce } from 'use-debounce';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


import { useDataContext } from "./context";
import CustomInput from "../CustomInput";

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../contract/address.json";
import useCurrency from '../../context/hook/useCurrency';
import { formatEther, parseEther } from 'ethers/lib/utils.js';

import e_msg from '../../context/lib/e_msg';


export default ({id})=>{
    const {address} = useAccount();
    const {data:balance} = useBalance({
        address
    });

    const {data:currency} = useCurrency();
    
    const [_value, setValue] = useState("");
    
    const [m_Value] = useDebounce(_value, 500);
    const value = useMemo(()=>m_Value.match(/^[0-9]+(?:\.[0-9]+)?$/)?parseEther(m_Value):0,[m_Value]);


    const {globalData,visible, hide} = useDataContext();
    const {tokenId} = globalData;

    const isVisible = !!visible[id];

    const {data:auction} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"auctions",
        args:[tokenId],
        enabled:!!tokenId,
        watch:true
    });

    const can_proceed = !!(balance?.value?.gte(value) && auction?.reserve?.lte(value) && auction?.price?.lt(value));
    
    
    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.auction,
        abi:auctionAbi.abi,
        functionName:"placeBid",
        args:[tokenId],
        enabled:isVisible && !!tokenId && can_proceed,
        overrides:{
            value
        }
    });

    const {write, ...writeOpts} = useContractWrite(config);
    //console.log({write, writeOpts, prepare});
    const wait =  useWaitForTransaction({
        hash:writeOpts.data?.hash
    });
    const _error = prepare.error || writeOpts.error || wait.error;
    const _loading = writeOpts.isLoading || wait.isLoading;

    return(
        <Dialog open={isVisible} onClose={()=>hide(id)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>BID AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00" defaultValue={_value} onChange={e=>setValue(e.target.value)}/>
                        <Typography fontWeight={600}>{currency?.symbol}</Typography>
                    </Stack>
                </Box>
                <Typography>Last Bid Amount: <b>{auction?.price?.gt(0)?formatEther(auction?.price):formatEther(auction?.reserve||0)}{currency?.symbol}</b></Typography>
                <Typography>Account Balance: <b>{balance?.formatted}{currency?.symbol}</b></Typography>
                <Alert variant="outlined" severity="info">
                    <Typography>
                        Amount placed can only be resolved after auction and 
                        amount placed would be sent back to you in respect of higher amount bid placed
                    </Typography>
                </Alert>

                {_error &&
                    <Alert severity='error'>{e_msg(_error)}</Alert>
                }

                {wait.isSuccess &&
                    <Alert>Successful</Alert>
                }

                {_loading && 
                    <Alert variant="outlined" severity="info">
                        <Stack px={1} direction="row" spacing={1} alignItems="center">
                            <Typography>Processing </Typography>
                            <CircularProgress/>
                        </Stack>
                    </Alert>
                }     
                
                <Button variant="outlined" disabled={!write || _loading || wait.isSuccess} size="large" onClick={()=>write?.()}>Place Bid</Button>
            </Box>     
        </Dialog>
    )
}





