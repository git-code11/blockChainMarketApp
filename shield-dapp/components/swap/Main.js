import {useEffect} from 'react';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import {IconButton } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import useSwapReverse from '../../context/swap/hooks/useSwapReverse';
import useSwapTrade from '../../context/swap/hooks/useSwapTrade';
import { SwapFieldInput, SwapFieldOutput } from './view/SwapField';
import {SwapBasicInfo, SwapTradeInfo} from './view/SwapInfo';
import SwapOptionsMenu from './view/SwapOptionsMenu';

export default ()=>{
    const reverse = useSwapReverse();
    const trade = useSwapTrade();
    const {loading, error} = trade;
    
    useEffect(()=>{
        console.log("calling trade update");
        trade.update();
    },[trade.update])

    useEffect(()=>{
        console.log("Output", {error, loading})
    },[loading, error]);

    console.log("My Trade", trade.data);

    return (
        <Stack component={Paper} gap={1} p={2} bgcolor="#536269">
            <Stack gap={1}>
                <SwapFieldInput data-inputField trade={trade}/>
                    <Stack alignItems="center">
                        <IconButton 
                        onClick={reverse}
                        sx={{
                            fontWeight:"bold"
                        }}>
                            <ArrowDownward/>
                        </IconButton>
                    </Stack>
                <SwapFieldOutput data-outputField trade={trade}/>
            </Stack>
            <SwapBasicInfo trade={trade}/>
            <SwapTradeInfo trade={trade}/>
            {loading && 
            <Alert color="info" variant='outlined'>
                <Typography fontStyle="italic" textAlign="center">Fetching Swap Status . . .</Typography>
            </Alert>
            }

            {error && 
                <Alert color="error" variant='outlined'>
                    <Typography fontStyle="italic" textAlign="center">{error.shortMessage?error.shortMessage:error.message?.split('/n')[0]}</Typography>
                </Alert>
            }
            <SwapOptionsMenu trade={trade}/>
        </Stack>
    );
}