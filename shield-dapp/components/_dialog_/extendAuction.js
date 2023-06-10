import {useState, useMemo} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
;

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../contract/address.json";
import { useDebounce } from 'use-debounce';

import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";


export default ({id})=>{
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;

    const [_value, setValue] = useState("");
    const [value] = useDebounce(_value, 500);
    
    const valueCorrect = useMemo(()=>!!value.match(/^[0-9]+$/),[value]);

    const isVisible = !!visible[id];

    const {data:auction} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"auctions",
        args:[tokenId],
        enabled:!!tokenId,
        watch:true
    });

    const auctionExist = auction?.reserve?.gt(0);

    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.auction,
        abi:auctionAbi.abi,
        functionName:"extendAuction",
        args:[tokenId, +value * 3600],
        enabled:isVisible && !!tokenId && valueCorrect && auctionExist,
    });
    
    const {write, ...writeOpts} = useContractWrite(config);
    const wait =  useWaitForTransaction({
        hash:writeOpts.data?.hash
    });
    const _error = prepare.error || writeOpts.error || wait.error;
    const _loading = writeOpts.isLoading || wait.isLoading;

    return(
        <Dialog open={isVisible} onClose={()=>hide(id)}>
            <DialogContent>
                <Box p={2} component={Stack} spacing={2}>

                    <TextField label="extendTime (in hour)" value={_value} onChange={e=>setValue(e.target.value)}/>

                    {
                    wait.isSuccess && 
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
                        disabled={!write || _loading || wait.isSuccess} 
                        size="large" 
                        onClick={()=>write?.()}
                    >Proceed</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
