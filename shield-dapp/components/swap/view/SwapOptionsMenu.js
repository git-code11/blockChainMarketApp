import {useCallback, useMemo} from 'react';
import Stack from "@mui/material/Stack";
import { Button, IconButton  } from "@mui/material";
import { Info, Settings} from "@mui/icons-material";

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapTradeLock from '../../../context/swap/hooks/useSwapTradeLock';
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';

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
                !isNaN(Number(result.value.toBigInt())) && 
                result.value.toBigInt() < trade.data.inputAmount.quotient,[trade, result])

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={toggleSetting}>
                <Settings/>
            </IconButton>
            <LoadingButton loading={trade.loading} variant="contained" onClick={btnClick} disabled={!trade.exist||insufficientBalance}>
                {trade.exist ? 
                (insufficientBalance?"INSUFFICIENT BALANCE":"PROCEED TO SWAP"):
                "SWAP QUOTING"
                }
            </LoadingButton>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}