import { Box, Stack, Typography } from "@mui/material";
import {Input} from '.'

export default ({disabled})=>{
    
    return (
        <Box>
            <Typography variant="h6" mb={1}>Token Information</Typography>
            <Stack spacing={3}>
                <Input label="Name" name="name" disabled={disabled}/>
                <Input label="Symbol" name="symbol" disabled={disabled}/>
                <Input label="Decimals" name="decimals" disabled={disabled}/>
                <Input label="Total Supply" name="totalSupply" disabled={disabled}/>
            </Stack>
        </Box>
    )
}