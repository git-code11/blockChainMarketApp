
import {useMemo, useCallback} from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useAccount, useDisconnect } from 'wagmi';

import useToken from "../context/hook/user/useToken";

import CircularProgress from "@mui/material/CircularProgress";

import Alert from "@mui/material/Alert";

export default ()=>{
    const {isConnected} = useAccount();
    const {disconnect} = useDisconnect();
    const {data, error, isLoading, refresh} = useToken();
    //console.log("verifyWallet", data, isConnected);
    const open = useMemo(()=>isConnected && !data,[isConnected, data]);
    
    const _disconnect = useCallback(()=>{
        disconnect();
    },[disconnect]);

    return (
        open?<Dialog open={open}>
            <DialogContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            Verification Standpoint Action require
                        </Typography>
                        {isLoading && <CircularProgress size={30}/>}
                    </Stack>
                    
                    {error && <Alert variant="outlined" severity="error">{error.message}</Alert>}
                    <Button onClick={refresh} disabled={isLoading}>Verify</Button>
                    <Button onClick={_disconnect} disabled={isLoading}>Disconnect</Button>
                </Stack>
            </DialogContent>
        </Dialog>:<></>
    )
}