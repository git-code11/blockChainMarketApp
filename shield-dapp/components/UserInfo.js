
import { Button, Typography } from "@mui/material";

import { Container, Box, Stack, Avatar, Paper} from "@mui/material";

import ElTypography from "./ElTypography";

import useUserId from "../context/hook/useUserId";

import {temp_c, temp_p} from "../temp";

export default ()=>{

    const {isMe, uid} = useUserId();

    return (
        <Box>
            <Stack sx={{position:"relative"}} alignItems="center">
                <Box component="img" sx={{maxHeight:200, height:"50vmin", width:"100%", bgcolor:"grey.300", objectFit:"fill"}} src={temp_p[0]}/>
                <Paper sx={{position:"absolute", bottom:-45, p:0.5, bgcolor:"#fff", borderRadius:"50%"}}>
                    <Avatar sx={{width:80, height:80}} src={temp_p[1]}/>
                </Paper>
            </Stack>
            <Container sx={{mt:"48px", mb:3}}>
                <Stack alignItems="center">
                    <Typography fontWeight="bold" variant="h6">@Perixxonru35</Typography>
                    <ElTypography sx={{maxWidth:"15ch"}} variant="subtitle1">{uid}</ElTypography>
                </Stack>

                {isMe?<Stack alignItems="center" my={2}>
                    <Button variant="outlined">EDIT PROFILE</Button>
                </Stack>:<Box/>}
            </Container>
        </Box>
    );
}