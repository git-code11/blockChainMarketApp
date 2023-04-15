import {TextField, styled} from "@mui/material";

const Input = styled((props)=>
    <TextField variant="filled" InputProps={{disableUnderline:true}}{...props}/>
)(({theme})=>({
    "& .MuiFilledInput-root":{
        backgroundColor: `${alpha(theme.palette.text.primary, 0.75)}`,
        color: theme.palette.background.paper,
        border: "solid 1px #11f",
        borderRadius:theme.spacing(0.5),
        transition:theme.transitions.create('border-color', "box-shadow"),
        "&:hover":{
            backgroundColor: `${alpha(theme.palette.text.primary, 0.75)}`,
            color: theme.palette.background.paper,
        }
    },
    "& .Mui-Focused":{
        border:"solid 2px eef",
        backgroundColor: `${alpha(theme.palette.text.primary, 0.75)}`,
        color: theme.palette.background.paper,
    }
}));