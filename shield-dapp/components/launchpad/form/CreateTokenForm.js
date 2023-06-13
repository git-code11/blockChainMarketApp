import { Box, Stack, Typography } from "@mui/material";
import {Input} from '.'

export default ()=>{
    
    return (
        <Box>
            <Typography variant="h6" mb={1}>Token Information</Typography>
            <Stack spacing={3}>
                <Input label="Name" name="name"/>
                <Input label="Symbol" name="symbol"/>
                <Input label="Decimals" name="decimals"/>
                <Input label="Total Supply" name="totalSupply"/>
            </Stack>
        </Box>
    )
}