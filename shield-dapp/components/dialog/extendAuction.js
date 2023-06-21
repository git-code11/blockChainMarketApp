import {useMemo} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useContractRead} from "wagmi";

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../contract/address.json";
import { useDebounce } from 'use-debounce';

import e_msg from "../../context/lib/e_msg";

import { useForm, FormProvider} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import TextField from '../ControlledTextField';
import useExtendAuction from '../../context/hook/app/erc721/useExtendAuction';
import { extendAuctionSchema } from './data/schema';
import { extendAuctionDefValue } from './data/defaultValues';


const schema = yup.object({
    extendTime:yup.number().min(1).required()
}).required();


export default ({tokenId, toggle})=>{
    
    const methods = useForm({
        mode:"onChange",
        defaultValues:extendAuctionDefValue,
        resolver: yupResolver(extendAuctionSchema)
    });
    const _formValid = methods.formState.isValid;
    const {extendTime:_value} = _formValid?methods.getValues():{};
    const [[value, formValid]] = useDebounce([_value, _formValid], 500);
    const timeDuration = useMemo(()=>value * 3600, [value]);

    const {data:auction} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"auctions",
        args:[tokenId],
        enabled:Boolean(tokenId),
        watch:true
    });

    const auctionExist = useMemo(()=>auction && auction.reserve.toBigInt() > 0,[]);
    const auctionEnabled = Boolean(tokenId) && formValid && auctionExist;
    const {error, loading:_loading, ...extend} = useExtendAuction({
        item:tokenId,
        duration:timeDuration,
        enabled:auctionEnabled
    });

    const _error = auctionEnabled && error;
       
    return(
        <Dialog open={true} onClose={_loading?null:toggle}>
            <DialogContent>
                <Box p={2} component={Stack} spacing={2}>
                    <FormProvider {...methods}>
                        <TextField name="extendTime" label="extendTime (in hour)"/>
                    </FormProvider>
                    {
                    extend.success && 
                        <Alert variant="outlined">
                            <Typography>Sucessful</Typography>
                        </Alert>
                    }

                    {_error  && 
                        <Alert variant="outlined" severity="error">
                            <Typography>Error Occured:{e_msg(_error)}</Typography>
                        </Alert>
                    }
                    
                    {_loading && 
                        <Alert variant="outlined" severity="info">
                            <Stack px={1} direction="row" spacing={1} alignItems="center">
                                <Typography>Processing </Typography>
                                <CircularProgress/>
                            </Stack>
                        </Alert>
                    }

                   
                </Box>
                <DialogContentText>Proceed to Extend auction</DialogContentText>
                <DialogActions>
                    <Button variant="outlined" 
                        disabled={!extend.write || _loading || extend.success} 
                        size="large" 
                        onClick={()=>extend.write?.()}
                    >Proceed</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
