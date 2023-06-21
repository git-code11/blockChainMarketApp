import { Box, Stack, Typography } from "@mui/material";

import {Input} from '.'

export default ()=>{

    return (
    <Box>
        <Typography variant="h6" mb={1}>Additional Details</Typography>
        <Stack spacing={2}>
            <Input label="Logo Url" name="detail.logoUrl"/>
            <Input label="Launch Name" name="detail.name"/>
            <Input label="Website" name="detail.web"/>
            <Input label="Social" name="detail.social"/>
            <Input label="Description" name="detail.desc"/>
        </Stack>
    </Box>
    )
}