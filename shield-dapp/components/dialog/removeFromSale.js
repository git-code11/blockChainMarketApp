import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useContractRead} from "wagmi";

import saleAbi from "../../contract/Sale.sol/MarketSales.json";
import _contract from "../../contract/address.js";


import e_msg from "../../context/lib/e_msg";

import useRemoveFromMarket from "../../context/hook/app/erc721/useRemoveFromMarket";


export default ({tokenId, toggle})=>{
    const tokenIdIsValid = Boolean(tokenId);

    const {data:item} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"ItemForSale",
        args:[tokenId],
        enabled:tokenIdIsValid
    });

    const can_remove = useMemo(()=>item && item.amount.toBigInt() > 0,[item]);
    
    const {write, error, loading, success} = useRemoveFromMarket({
        item:tokenId,
        enabled:tokenIdIsValid && can_remove
    })


    return(
        <Dialog open={true} onClose={loading?null:toggle}>
            <DialogContent>
                <Box p={2} component={Stack} spacing={2}>

                    {success && 
                        <Alert variant="outlined">
                            <Typography>Sucessfully Removed from market</Typography>
                        </Alert>
                    }

                    {error  && 
                        <Alert variant="outlined" severity="error">
                            <Typography>Error Occured:{e_msg(error)}</Typography>
                        </Alert>
                    }
                    
                    {loading && 
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
                        disabled={!write || loading || success} 
                        size="large" 
                        onClick={()=>write?.()}
                    >Remove</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
