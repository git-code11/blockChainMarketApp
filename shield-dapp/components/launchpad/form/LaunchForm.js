import { Box, Stack, Typography } from "@mui/material";

import {Input} from '.'

export default ()=>{
    
    return (
        <Box>
            <Typography variant="h6" mb={1}>LaunchPad Information</Typography>
            <Stack spacing={2}>
                <Input label="Presale rate" name="launch.preSale"/>
                <Input label="Dexsale rate" name="launch.dexSale"/>
                <Input label="Minimum Buy" name="launch.minBuy"/>
                <Input label="Maximum Buy" name="launch.maxBuy"/>
                <Input label="Swap Liquidity(%)" name="launch.swapLiquidtyPercent"/>
                <Input label="Start Time" name="launch.startTime"/>
                <Input label="End Time" name="launch.endTime"/>
                <Input label="Liquidity Lockup (days)" name="launch.lockUp"/>
            </Stack>
        </Box>
    )
}