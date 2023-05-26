
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
;

import saleAbi from "../../contract/Sale.sol/MarketSales.json";
import _contract from "../../contract/address.json";


import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";
import { saleStruct } from "../../context/lib/struct";


export default ({id})=>{
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;

    const isVisible = !!visible[id];

    const {data:item, ...itemRead} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"ItemForSale",
        args:[tokenId],
        enabled:!!tokenId && isVisible,
        select:saleStruct
    });
    

    const {config, ...prepare} = usePrepareContractWrite({
        address:_contract.sale,
        abi:saleAbi.abi,
        functionName:"removeFromMarket",
        args:[tokenId],
        enabled:item?.amount > 0n && isVisible,
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

                    {
                    wait.isSuccess && 
                        <Alert variant="outlined">
                            <Typography>Sucessfully Removed from market</Typography>
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
                <DialogContentText>Proceed to remove item from market</DialogContentText>
                <DialogActions>
                    <Button variant="outlined" 
                        disabled={!write || _loading || wait.isSuccess} 
                        size="large" 
                        onClick={()=>write?.()}
                    >Remove</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
