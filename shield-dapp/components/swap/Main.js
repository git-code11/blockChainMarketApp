
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Input,
    Table, TableBody, TableRow, TableCell, 
    Typography, IconButton, InputAdornment } from "@mui/material";
import { Info, Settings } from "@mui/icons-material";
import { ArrowDownward } from "@mui/icons-material";
import {LOGO} from '.'

import useSwapModal from "../../context/swap/hooks/useSwapModal";
import useSwapInput from '../../context/swap/hooks/useSwapInput';
import useSwapOutput from '../../context/swap/hooks/useSwapOutput';
import { useSwapCurrency } from '../../context/swap/hooks/currency';
import useSwapReverse from '../../context/swap/hooks/useSwapReverse';
import useSwapTrade from '../../context/swap/hooks/useSwapTrade';

export default ()=>{
    const {toggle} = useSwapModal();
    const input = useSwapInput();
    const output = useSwapOutput();
    const reverse = useSwapReverse();
    const trade = useSwapTrade();

    return (
        <Stack component={Paper} gap={1} p={2} bgcolor="#536269">
            <Stack gap={1}>
                <SwapField data-inputField isInput toggle={()=>toggle("select", 1)} {...input}/>
                    <Stack alignItems="center">
                        <IconButton 
                        onClick={reverse}
                        sx={{
                            fontWeight:"bold"
                        }}>
                            <ArrowDownward/>
                        </IconButton>
                    </Stack>
                <SwapField data-outputField toggle={()=>toggle("select", 2)} {...output}/>
            </Stack>
            <SwapBasicInfo/>
            <SwapOptions/>
        </Stack>
    );
}


const SwapCurrencyBalance = ()=>{

    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography>$2,301.05</Typography>
            <Typography>Bal: 0.1639</Typography>
        </Stack>
    )
}

const SwapField = ({isInput, data, update, toggle})=>{
    const currency = useSwapCurrency(data.currency);

    return (
        <Stack gap={2} p={1} direction="row" component={Paper} alignItems="end">
            <Stack component={Button} alignItems="center" gap={0.5} onClick={toggle}>
                <Box 
                    sx={{
                        borderRadius:1,
                        boxShadow:"0 0 0 2px #454545",
                        bgcolor:"orange"
                    }}>
                    <Avatar src={LOGO} sx={{width:"50px", height:"50px"}}/>
                </Box>
                <Typography fontWeight="bold">{currency?.symbol??"- - -"}</Typography>
            </Stack>
            <Stack flex={1} justifyContent="space-between">
                <Input 
                    disabled={isInput?false:true}
                    value={data.amount}
                    onChange={e=>update({amount:e.target.value})}
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
                <SwapCurrencyBalance/>
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
    const {toggle} = useSwapModal();
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={()=>toggle("settings")}>
                <Settings/>
            </IconButton>
            <Button variant="contained">Insufficient Balance</Button>
            <IconButton>
                <Info/>
            </IconButton>
        </Stack>
    );
}
