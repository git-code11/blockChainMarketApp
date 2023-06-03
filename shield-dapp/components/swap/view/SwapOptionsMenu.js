import {useCallback, useMemo} from 'react';
import Stack from "@mui/material/Stack";
import { Button, IconButton  } from "@mui/material";
import { Info, Settings} from "@mui/icons-material";

import useSwapModal from "../../../context/swap/hooks/useSwapModal";
import useSwapTradeLock from '../../../context/swap/hooks/useSwapTradeLock';


export default ({exist})=>{
    const {toggle} = useSwapModal();
    
    const lock = useSwapTradeLock();

    const toggleSetting = useCallback(()=>{
        toggle("settings");
    }, [toggle]);

    const btnClick = useCallback(()=>{
        if(exist){
            lock();
            toggle('confirm');
        }
    },[lock, exist, toggle]);

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={toggleSetting}>
                <Settings/>
            </IconButton>
            <Button variant="contained" onClick={btnClick} disabled={!exist}>PROCEED TO SWAP</Button>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}