import {useEffect} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import useAuth from "../context/hook/user/useAuth";

import CircularProgress from "@mui/material/CircularProgress";

import Alert from "@mui/material/Alert";

import e_msg from "../context/lib/e_msg";

export default ()=>{
    const {showVerify:open, disconnect, verify, loading, 
                error, isAuthenticated, session, address, reset} = useAuth();

    //to signout on address change
    useEffect(()=>{
        if(address && isAuthenticated && address !== session.data.user.uid){
            reset();
        }
    },[address, isAuthenticated, session.data]);

    return (
        open?<Dialog open={open}>
            <DialogContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            Verification Standpoint Action require
                        </Typography>
                        {loading && <CircularProgress size={30}/>}
                    </Stack>
                    
                    {error && <Alert variant="outlined" severity="error">{e_msg(error)}</Alert>}
                    <Button onClick={()=>verify()} disabled={loading}>Verify</Button>
                    <Button onClick={disconnect} disabled={loading}>Disconnect</Button>
                </Stack>
            </DialogContent>
        </Dialog>:<></>
    )
}