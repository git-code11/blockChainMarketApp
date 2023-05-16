
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Input,
    Table, TableBody, TableRow, TableCell, 
    Typography, IconButton, InputAdornment } from "@mui/material";
import { Info, Settings } from "@mui/icons-material";
import { ArrowDownward } from "@mui/icons-material";
import {LOGO} from '.'


export default ()=>{

    return (
        <Stack component={Paper} gap={1} p={2} bgcolor="#536269">
            <Stack gap={1}>
                <SwapField data-inputField/>
                    <Stack alignItems="center">
                        <ArrowDownward/>
                    </Stack>
                <SwapField data-outputField/>
            </Stack>
            <SwapBasicInfo/>
            <SwapOptions/>
        </Stack>
    );
}

const SwapField = ()=>{

    return (
        <Stack gap={2} p={1} direction="row" component={Paper} alignItems="end">
            <Stack component={Button} alignItems="center" gap={0.5}>
                <Box 
                    sx={{
                        borderRadius:1,
                        boxShadow:"0 0 0 2px #454545",
                        bgcolor:"orange"
                    }}>
                    <Avatar src={LOGO} sx={{width:"50px", height:"50px"}}/>
                </Box>
                <Typography fontWeight="bold">ETH</Typography>
            </Stack>
            <Stack flex={1} justifyContent="space-between">
                <Input defaultValue={235.33}
                    placeholder={"0.0"}
                    align="end"
                    margin="dense"
                    sx={{
                        fontFamily:"monospace",
                        fontWeight:"800",
                        fontSize:"2.5rem",
                        ".MuiInput-input":{
                            textAlign:"end"
                        }
                    }}
                    fullWidth
                    endAdornment={
                    <InputAdornment position="end">
                        <Button variant="contained" size="small">max</Button>
                    </InputAdornment>
                    }/>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>$2,301.05</Typography>
                    <Typography>Bal: 0.1639</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}

const SwapBasicInfo = ()=>{

    return (
        <Table padding="none"
            sx={{
                "td":{
                    border:"none",
                    paddingBottom:1.5,
                },
                "tr:last-child td":{
                    paddingBottom:0
                },
                "tr td:first-child":{
                    color:"#fff",
                    fontWeight:"bold"
                }
            }}
            >
            <TableBody>
                <TableRow>
                    <TableCell>Rate</TableCell>
                    <TableCell align="right">1USDT = 0.0395UNI</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Inverse Rate</TableCell>
                    <TableCell align="right">1UNI = 25.3156USDT</TableCell>
                </TableRow>

            </TableBody>
        </Table>
    );
}

const SwapOptions = ()=>{

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton>
                <Settings/>
            </IconButton>
            <Button variant="contained">Insufficient Balance</Button>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}
