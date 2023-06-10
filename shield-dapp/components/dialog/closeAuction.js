
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import e_msg from "../../context/lib/e_msg";

import useCloseAuction from "../../context/hook/app/erc721/useCloseAuction";


export default ({tokenId, toggle})=>{
   
    const {loading:_loading, error:_error,success:_success, write} = useCloseAuction({
        item:tokenId,
        enabled:Boolean(tokenId)
    })

    return(
        <Dialog open={true} onClose={_loading?null:toggle}>
            <DialogContent>
                <Box p={2} component={Stack} spacing={2}>

                    {
                    _success && 
                        <Alert variant="outlined">
                            <Typography>Sucessfully Close Auction</Typography>
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
                <DialogContentText>Proceed to close auction</DialogContentText>
                <DialogActions>
                    <Button variant="outlined" 
                        disabled={!write || _success || _loading} 
                        size="large" 
                        onClick={()=>write?.()}
                    >Proceed</Button>
                </DialogActions>
            </DialogContent>
                 
        </Dialog>
    )
}
