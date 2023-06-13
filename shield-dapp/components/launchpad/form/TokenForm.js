import { Box, Stack, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useToken } from "wagmi";
import { useDebounce } from "use-debounce";
import { useFormContext } from "react-hook-form";

import {Input} from '.'

export default ()=>{
    
    return (
    <Box>
        <Typography variant="h6" mb={1}>Token Information</Typography>
        <Stack spacing={2}>
            <Input label="Token Address" name="token.address"/>
            <TokenDetails/>
        </Stack>
    </Box>
    )
}


const TokenDetails = ()=>{
    const methods = useFormContext();
    const {address} = methods.getValues();
    const [debounceToken] = useDebounce(address, 1000);

    const {data} = useToken({
        address:debounceToken
    });

    return (
        data && <Table>
            <TableBody>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{data.name}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>{data.symbol}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>TotalSupply</TableCell>
                    <TableCell>{data.totalSupply}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}