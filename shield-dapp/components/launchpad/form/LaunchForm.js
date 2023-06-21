import { Box, Stack, Typography, FormLabel} from "@mui/material";
import { useFormContext } from "react-hook-form";

import {CheckInput, Input, InputWithBuySymbol, InputWithLaunchSymbol, useFormPredictAmount} from '.'

const LaunchTokenAmountPredict = ({})=>{
    const {data, token} = useFormPredictAmount();

    return (
        data && <FormLabel>
            Amount of token required: {data}{token?.symbol}
        </FormLabel>
    )
}


export default ()=>{
    
    return (
        <Box>
            <Typography variant="h6" mb={1}>LaunchPad Information</Typography>
            <Stack spacing={2}>
               {/*  <CheckInput label="Enable WhiteList" name="launch.enablewhitelist"/> */}
                
                <InputWithBuySymbol label="Capped Amount" name="launch.capped" type="number"/>
                
                <InputWithLaunchSymbol label="Presale rate" name="launch.preSale" type="number"/>

                <LaunchTokenAmountPredict/>

                <InputWithLaunchSymbol label="Dexsale rate" name="launch.dexSale" type="number"/>

                <InputWithBuySymbol label="Minimum Buy" name="launch.minBuy" type="number"/>
                <InputWithBuySymbol label="Maximum Buy" name="launch.maxBuy" type="number"/>

                <Input label="Swap Liquidity(%)" name="launch.swapLiquidityPercent" type="number"/>
                <Input label="Start Time" name="launch.startTime" type="datetime-local"/>
                <Input label="End Time" name="launch.endTime" type="datetime-local"/>
                <Input label="Liquidity Lockup (days)" name="launch.lockUp" type="number"/>
            </Stack>
        </Box>
    )
}