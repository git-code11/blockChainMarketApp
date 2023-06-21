import {useMemo} from 'react';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
     Skeleton, CircularProgress, Stack, Box
} from "@mui/material";
import { useToken } from "wagmi";
import useListCreatedERC20 from '../../context/hook/app/factory/erc20/useListCreatedERC20';
import { formatUnits } from 'ethers/lib/utils.js';


export default ()=>{
    const {data, isLoading} = useListCreatedERC20({});
    
    return (
        <Box my={3}>
        {isLoading ?
        <Stack alignItems="center">
            <CircularProgress/>
        </Stack>:
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Decimals</TableCell>
                        <TableCell>TotalSupply</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && [...data].map(address=><TokenModel key={address} address={address}/>)}
                </TableBody>
            </Table>
        </TableContainer>
        }
        </Box>
    );
}


const TokenModel = ({address})=>{
    const {data, isLoading} = useToken({
        address
    });
    
    const Loading = useMemo(()=><Skeleton width={100}/>,[]);

    return(
        <TableRow>
            <TableCell>{isLoading?Loading:data.address}</TableCell>
            <TableCell>{isLoading?Loading:data.name}</TableCell>
            <TableCell>{isLoading?Loading:data.symbol}</TableCell>
            <TableCell>{isLoading?Loading:data.decimals}</TableCell>
            <TableCell>{isLoading?Loading:formatUnits(data.totalSupply.value, data.decimals)}</TableCell>
        </TableRow>
    )
}