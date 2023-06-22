import {useMemo} from 'react';
import {useBalance, useAccount, useContractRead} from "wagmi";
import { useDebounce } from 'use-debounce';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


import CustomInput from "../CustomInput";

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../contract/address.json";
import useCurrency from '../../context/hook/useCurrency';
import { formatEther, parseEther } from 'ethers/lib/utils.js';

import e_msg from '../../context/lib/e_msg';

import { useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import usePlaceBid from '../../context/hook/app/erc721/usePlaceBid';

const schema = yup.object({
    amount:yup.number().min(0).required()
}).required();

export default ({tokenId, toggle})=>{

    const methods = useForm({
        mode:"onChange",
        defaultValues:{
            amount:1
        },
        resolver: yupResolver(schema)
    });

    const {address} = useAccount();
    const {data:balance} = useBalance({
        address
    });

    const {data:currency} = useCurrency();
    
    const {amount:_value} = methods.getValues();
    const _isValid = methods.formState.isValid;
    
    const [[d_Value, isValid]] = useDebounce([_value, _isValid], 500);
    const value = useMemo(()=>isValid && parseEther(d_Value.toString()),[isValid, d_Value]);


    const {data:auction} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"auctions",
        args:[tokenId],
        enabled:Boolean(tokenId),
        watch:true
    });

    const can_proceed = useMemo(()=>{
        if(balance && auction && value){
            const _balance = balance.value;
            const _reserve = auction.reserve;
            const _price = auction.price;
            //const _value = value;
            return _balance >= value && _reserve <= _value && _price < value;
        }
        return false;
    }
    ,[balance, auction, value]);
        
    const placeBidEnabled = Boolean(tokenId) && can_proceed;

    const {error:_error, loading:_loading, ...bid} = usePlaceBid({
        item:tokenId,
        value,
        enabled:placeBidEnabled
    });

    return(
        <Dialog open={true} onClose={_loading?null:toggle}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>BID AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput {...methods.register('amount')} placeholder="0.00"/>
                        <Typography fontWeight={600}>{currency?.symbol}</Typography>
                    </Stack>
                </Box>
                <Typography>Last Bid Amount: <b>{auction?.price > 0?formatEther(auction?.price):formatEther(auction?.reserve||0)}{currency?.symbol}</b></Typography>
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

                {bid.success &&
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
                
                <Button variant="outlined" disabled={!bid.write || _loading || bid.success} size="large" onClick={()=>bid.write?.()}>Place Bid</Button>
            </Box>     
        </Dialog>
    )
}





