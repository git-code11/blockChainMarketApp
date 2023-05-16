
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Avatar, Chip, OutlinedInput, Typography, IconButton, Divider } from "@mui/material";
import { ListItemAvatar, ListItemText, ListItemButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import {FixedSizeList} from "react-window";
import {TOKEN_LIST, LOGO} from '.'


const TokenChip = ({name, logo})=>{
    return (
        <Chip
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
                <Avatar src={logo || LOGO}/>
            } 
            label={
                <Typography fontWeight="bold" fontSize="1rem">{name}</Typography>
            }
            />
    );
}

const TokenSelectItem = ({name, symbol, logo, ...props})=>{
    return (
        <ListItemButton {...props}>
            <ListItemAvatar>
                <Avatar src={logo||LOGO} sx={{width:"50px", height:"50px", bgcolor:"#e9e9e9"}}/>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography fontWeight="bold">{symbol}</Typography>
                }
                secondary={name}
            />
        </ListItemButton>
    )
}


const renderRow = ({index, style})=><TokenSelectItem key={index} name={"etherum"} symbol={TOKEN_LIST[index]} style={style}/>

export default ()=>{

    return (
        <Stack px={2} py={1} gap={2} component={Paper} bgcolor="#e4e4e4">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold">Select Token</Typography>
                <IconButton>
                    <Close/>
                </IconButton>
            </Stack>
            <OutlinedInput fullWidth placeholder="Search name or paste address"/>
            <Stack>
                <Typography fontWeight="bold" variant="subtitle1">Common Base</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {TOKEN_LIST.slice(0, 5).map(name=><TokenChip key={name} name={name}/>)}
                </Stack>
            </Stack>
            <Divider/>
            <Paper>
                <FixedSizeList
                    height={250}
                    width="100%"
                    itemSize={60}
                    itemCount={TOKEN_LIST.length}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>
            </Paper>
        </Stack>
    )
}