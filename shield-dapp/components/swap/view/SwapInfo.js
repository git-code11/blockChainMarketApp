import {useMemo} from 'react';

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Table, TableBody, TableRow, TableCell, 
    Typography, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";


import useSwapInfo from '../../../context/swap/hooks/useSwapInfo';
import { amountFixed } from '../../../swap/src/smart/_utils';

const {PoolType, RouteType} = require("@pancakeswap/smart-router/evm");

const POOL_MAP = Object.keys(PoolType).reduce((acc, key)=>({...acc, [PoolType[key]]:key}),{});
const ROUTE_MAP = Object.keys(RouteType).reduce((acc, key)=>({...acc, [RouteType[key]]:key}),{});

export const SwapBasicInfo = ({trade})=>{
    const {slippage, minimumAmountOut, maximumAmountIn, executionPrice} = useSwapInfo(trade.data);
    console.log({slippage, minimumAmountOut, maximumAmountIn, executionPrice});
    
    const _executionPrice = useMemo(()=>
        executionPrice && Number(executionPrice.adjustedForDecimals.toFixed(8)),
    [executionPrice]);

    const _minimumAmountOut = useMemo(()=>
        minimumAmountOut && amountFixed(minimumAmountOut),
    [minimumAmountOut]);

    const _slippage = useMemo(()=>slippage && Number(slippage.toFixed(4)),[slippage]);

    return (
        trade.exist &&
        <Table padding="none"
            sx={{
                "td":{
                    border:"none",
                    paddingBottom:1.5,
                },
                "tr:last-child td":{
                    paddingBottom:0
                },
                "tr td:first-of-type":{
                    color:"#fff",
                },
                "tr td:last-of-type":{
                    color:"#fff",
                }
            }}
            >
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Typography>Execution Price</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle2">
                        {
                        _executionPrice? `1${maximumAmountIn.currency.symbol} = ${_executionPrice} ${minimumAmountOut.currency.symbol}`:"- - -"
                        }
                        </Typography>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                        <Typography>MinimumAmountOut</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle2">
                        {
                        _minimumAmountOut? `${_minimumAmountOut} ${maximumAmountIn.currency.symbol}`:"- - -"
                        }
                        </Typography>
                    </TableCell>
                </TableRow>
                
                <TableRow>
                    <TableCell>
                        <Typography>Slippage</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography>
                        {
                        _slippage? `${_slippage}%`:"- - -"
                        }
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

export const SwapTradeInfo = ({trade})=>{
    const {data, exist} = trade;

    return (
        exist && <Accordion elevation={0} disableGutters
                sx={{
                    bgcolor:"transparent"
                }}
            >
                <AccordionSummary expandIcon={<ExpandMore/>} color="primary">
                    <Typography fontWeight="bold">Route Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={1}>
                        {
                            data.routes.map((route, i)=>
                            <SwapRouteInfo route={route} key={i}/>
                            )
                        }
                    </Stack>
                </AccordionDetails>
            </Accordion>
    );
}

const SwapRouteInfo = ({route})=>{

    return (
        <Paper component={Stack} p={1} spacing={1} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">{route.percent}%</Typography>
                <Typography variant="subtitle2" fontWeight="bold">{ROUTE_MAP[route.type]}</Typography>
            </Stack>
            <SwapPathInfo path={route.path}/>
        </Paper>
    )
}


const SwapPathInfo = ({path})=>{
    const _path = useMemo(()=>{
        return path.map(token=>token.symbol).join("=>")
    },[path]);

    return (
        <Typography variant="subtitle2" fontWeight="bold">{_path}</Typography>
    )
}

const SwapPoolInfo = ({pool})=>{
    const tokens = useMemo(()=>{
        let _tokens = [];
    
        if(pool.type === PoolType.V2){
            _tokens = [pool.reserve0.currency, pool.reserve1.currency].reverse()
        }else if(pool.type === PoolType.V3){
            _tokens = [pool.token0, pool.token1]
        }else if(pool.type === PoolType.STABLE){
            console.log({pool})
            _tokens = pool.balances.map(balance=>balance.currency).reverse();
        }
        return _tokens;
    },[pool]);

    const _symbols = useMemo(()=>{
        return tokens.map(token=>token.symbol).join("=>")
    },[tokens])


    return (
        <Stack alignItems="center">
            <Typography variant="caption" fontWeight="bold">
                {POOL_MAP[pool.type]}
            </Typography>
            <Typography variant="caption" fontWeight="bold">
                {_symbols}
            </Typography>
    </Stack>
    )
}