
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useContractRead, useContractWrite, usePrepareContractWrite} from "wagmi";
;

import auctionAbi from "../../contract/Auction.sol/MarketAuction.json";
import _contract from "../../contract/address.json";


import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";


export default ({id})=>{
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;

    /*const {data:auction} = useContractRead({
        abi:auctionAbi.abi,
        address:_contract.auction,
        functionName:"auctions",
        args:[tokenId],
        watch:true
    });*/
    
    const isVisible = !!visible[id];

    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.auction,
        abi:auctionAbi.abi,
        functionName:"closeAuction",
        args:[tokenId],
        enabled:isVisible && !!tokenId,
    });
    
    const {write, ...writeOpts} = useContractWrite(config);

    const _error = prepare.error || writeOpts.error;

    return(
        <Dialog open={isVisible} onClose={()=>hide(id)}>
            <DialogContent>
                <Box p={2} component={Stack} spacing={2}>

                    {
                    writeOpts.isSuccess && 
                        <Alert variant="outlined">
                            <Typography>Sucessfully Close Auction</Typography>
                        </Alert>
                    }

                    {_error  && 
                        <Alert variant="outlined" severity="error">
                            <Typography>Error Occured:{e_msg(_error)}</Typography>
                        </Alert>
                    }
                    
                    {writeOpts.isLoading && 
                        <Alert variant="outlined" severity="info">
                            <Stack px={1} direction="row" spacing={1} alignItems="center">
                                <Typography>Processing </Typography>
                                <CircularProgress/>
                            </Stack>
                        </Alert>
                    }

                   
                </Box>
                <DialogContentText>Proceed to close auction</DialogContentText>
                <DialogActions>
                    <Button variant="outlined" 
                        disabled={!write || writeOpts.isLoading || writeOpts.isSuccess} 
                        size="large" 
                        onClick={()=>write?.()}
                    >Proceed</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
