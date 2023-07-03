
import Stack from "@mui/material/Stack"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import CardActionArea from "@mui/material/CardActionArea"

import ElTypography from "./ElTypography"

import { useAccount, useBalance } from "wagmi"

import {temp_c} from "../temp";

import Link from "next/link";

export default ()=>{
    const {address} = useAccount();

    const { data, isError, isLoading } = useBalance({address});
    
    return (
        address?
            (
            <CardActionArea component={Link} href={`/user/${address}`}>
                <Stack p={1} direction="row" sx={{bgcolor:"primary.dark"}} justifyContent="space-between" alignItems="center">
                    <Avatar src={temp_c[2]}/>
                    <Box>
                        <Typography fontWeight="bold" color="common.white">
                            {isError?"---":(
                                isLoading?<Skeleton sx={{backgroundColor:"#ffffff4d"}} width={80}/>:`${data?.formatted?(+data?.formatted).toFixed(3):""} ${data?.symbol??""}`
                            )}
                            </Typography>
                        <ElTypography maxWidth="15ch" variant="body2" fontStyle="italic" color="common.white">{address}</ElTypography>                            
                    </Box>
                </Stack>
            </CardActionArea>
            ):
            <Box/>
    )
}