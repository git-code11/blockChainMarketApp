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
    
    const canSwap = useMemo(()=>result && trade.data && result.value.toBigInt()>= trade.data.inputAmount.quotient ,[result, trade.data])
    
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={toggleSetting}>
                <Settings/>
            </IconButton>
            <LoadingButton loading={trade.loading} variant="contained" onClick={btnClick} disabled={!(trade.exist&&canSwap)}>
                {canSwap ? 
                "PROCEED TO SWAP":
                "INSUFFIECIENT BALANCE"
                }
            </LoadingButton>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}