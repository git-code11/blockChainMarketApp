import {useCallback, useMemo} from 'react';
import Stack from "@mui/material/Stack";
import { Button, IconButton  } from "@mui/material";
import { Info, Settings} from "@mui/icons-material";

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapTradeLock from '../../../context/swap/hooks/useSwapTradeLock';
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';
import { useAccount } from 'wagmi';
import { LoadingButton } from '@mui/lab';

export default ({trade})=>{
    const {toggle} = useSwapModal();
    
    const {lock} = useSwapTradeLock();

    const toggleSetting = useCallback(()=>{
        toggle("settings");
    }, [toggle]);

    const btnClick = useCallback(()=>{
        if(trade.exist){
            lock();
            toggle('confirm');
        }
    },[lock, trade.exist, toggle]);
    
    const {result} = useSwapBalance(trade?.data?.inputAmount?.currency);
    
    const insufficientBalance = useMemo(()=>
                Boolean(trade.data) && Boolean(result) && 
                Boolean(result.value) && 
                result.value < trade.data.inputAmount.quotient,[trade, result])

    const {isConnected} = useAccount()

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={toggleSetting} sx={{color:"common.white"}} >
                <Settings/>
            </IconButton>
            <LoadingButton color="secondary" loading={trade.loading} variant="contained" onClick={btnClick} disabled={!trade.exist||insufficientBalance||!isConnected}>
                {trade.exist ? 
                (insufficientBalance?"INSUFFICIENT BALANCE":"PROCEED TO SWAP"):
                "SWAP QUOTING"
                }
            </LoadingButton>
            <IconButton sx={{color:"common.white"}}>
                <Info/>
            </IconButton>
        </Stack>
    );
}