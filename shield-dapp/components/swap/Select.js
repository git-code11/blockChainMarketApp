import {useCallback, useMemo, useState} from 'react';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Chip, OutlinedInput, Typography, IconButton, Divider } from "@mui/material";
import { ListItemAvatar, ListItemText, ListItemButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import {FixedSizeList} from "react-window";
import useSwapModal from "../../context/swap/hooks/useSwapModal";
import {useSwapCurrencyAddrList, useSwapCurrency, useSwapCurrencyList } from "../../context/swap/hooks/currency";
import useSwapInput from "../../context/swap/hooks/useSwapInput";
import useSwapOutput from "../../context/swap/hooks/useSwapOutput";
import useSwapCtx from "../../context/swap/hooks/useSwapCtx";
import useTokenLogo from '../../token_logo/useTokenLogo';

const TokenChip = ({address})=>{
    const currency = useSwapCurrency(address);
    const input = useSwapInput();
    const output = useSwapOutput();
    const ctx = useSwapCtx();
    const disabled = useMemo(()=>
                                input.data.currency === address || output.data.currency === address,
                        [input, output, address]);
    const onClick = useCallback(()=>{
        const _func = ctx.i?input.update:output.update;
        _func({currency:address});
    },[input, output, address, ctx.i]);

    const token_logo = useTokenLogo(currency);

    return (
        <Chip
            onClick={onClick}
            disabled={disabled}
            variant="outlined"
            sx={{
                height:"40px",
                ".MuiChip-avatar":{
                    width:"35px",
                    height:"35px",
                    bgcolor:"#555"
                },
                cursor:"pointer"
            }}
            avatar={
                <Avatar src={token_logo}/>
            } 
            label={
                <Typography fontWeight="bold" fontSize="1rem">{currency?.symbol ?? "- - - -"}</Typography>
            }
            />
    );
}

const TokenSelectItem = ({address, ...props})=>{
    const currency = useSwapCurrency(address);
    const input = useSwapInput();
    const output = useSwapOutput();
    const ctx = useSwapCtx();
    const disabled = useMemo(()=>
                                input.data.currency === address || output.data.currency === address,
                        [input, output, address]);

    const onClick = useCallback(()=>{
        const _func = ctx.i?input.update:output.update;
        _func({currency:address});
    },[input, output, address]);

    const token_logo = useTokenLogo(currency);

    return (
        <ListItemButton {...props} disabled={disabled} onClick={onClick}>
            <ListItemAvatar>
                <Avatar src={token_logo} sx={{width:"50px", height:"50px", bgcolor:"#e9e9e9"}}/>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography fontWeight="bold">{currency?.symbol??"- - -"}</Typography>
                }
                secondary={currency?.name??"- - - -"}
            />
        </ListItemButton>
    )
}


const renderRow = ({index, data, style})=><TokenSelectItem key={data[index]}  address={data[index]} style={style}/>

export default ()=>{
    const {toggle} = useSwapModal();
    const __currencyListAddress = useSwapCurrencyAddrList();
    const __currencyList = useSwapCurrencyList();
    const [searchText, setSearchText] = useState("");
    const onSearchChange = useCallback(e=>setSearchText(e.target.value),[setSearchText]);

    const currencyListAddress = useMemo(()=>{
        const _searchText = searchText.trim()
        if(_searchText)
            return Object.values(__currencyList).filter(d=>
                d.address.search(searchText) !== -1 ||
                d.name.search(searchText) !== -1 ||
                d.symbol.search(searchText) !== -1
            ).map(d=>d.address);
        else
            return __currencyListAddress;
    },[searchText, __currencyListAddress, __currencyList]);

    return (
        <Stack px={2} py={1} gap={2} component={Paper} bgcolor="#e4e4e4">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Select Token</Typography>
                <IconButton onClick={()=>toggle("select")}>
                    <Close/>
                </IconButton>
            </Stack>
            <OutlinedInput value={searchText} onChange={onSearchChange} fullWidth placeholder="Search name or paste address"/>
            <Stack>
                <Typography fontWeight="bold" variant="subtitle1">Common Base</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {__currencyListAddress.slice(0, 5).map(address=><TokenChip key={address} address={address}/>)}
                </Stack>
            </Stack>
            <Divider/>
            <Paper>
                <FixedSizeList
                    height={250}
                    width="100%"
                    itemData={currencyListAddress}
                    itemKey={(index, data)=>data[index]}
                    itemSize={60}
                    itemCount={currencyListAddress.length}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>
            </Paper>
        </Stack>
    )
}