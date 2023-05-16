
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Typography, Divider} from "@mui/material";
import { Check} from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { LOGO} from '.'

const SwapMiniAmount = ()=>{
    return (
        <Stack direction="row" alignItems="center">
            <Avatar src={LOGO} sx={{bgcolor:"#333", width:"30px", height:"30px"}}/>
            <Typography>1.234 ETH</Typography>
        </Stack>
    )
}

export default ()=>{
    return (
        <Stack gap={1} p={2} bgcolor="#e4e4e4" component={Paper}>
            <Stack gap={1} alignItems="center">
                <Check color="success" sx={{fontSize:"5rem"}}/>
                <Typography>Transaction Submitted</Typography>
                <Stack direction="row" gap={1} alignItems="center">
                    <SwapMiniAmount/>
                    <ArrowForward/>
                    <SwapMiniAmount/>
                </Stack>
            </Stack>
            <Divider/>
            <Stack alignItems="end">
                <Typography
                    sx={{
                        color:"#3333ff",
                        cursor:"pointer",
                        "&:hover":{
                            textDecoration:"underline"
                        },
                        "&:active":{
                            color:"#ff8888"
                        }
                    }}
                    variant="subtitle2"
                >
                    View on EtherScan
                </Typography>
            </Stack>
            <Button size="large" variant="contained">Close</Button>
        </Stack>
    );
}

