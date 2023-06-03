import {useCallback, useMemo} from 'react';
import Stack from "@mui/material/Stack";
import { Button, IconButton  } from "@mui/material";
import { Info, Settings} from "@mui/icons-material";

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapTradeLock from '../../../context/swap/hooks/useSwapTradeLock';
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';

export default ({trade})=>{
    const {toggle} = useSwapModal();
    
    const lock = useSwapTradeLock();

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
    
    const canSwap = useMemo(()=>result && trade.data && result.value.toBigInt()>= trade.data.inputAmount.quotient ,[result, trade.data])

    console.log([result?.value?.toBigInt(), trade?.data?.inputAmount?.quotient])
    
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={toggleSetting}>
                <Settings/>
            </IconButton>
            <Button variant="contained" onClick={btnClick} disabled={!trade.exist}>
                {canSwap ? 
                "PROCEED TO SWAP":
                (trade.data ? "INSUFFIECIENT BALANCE":"LOADING TRADE")
                }
            </Button>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}