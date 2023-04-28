import {TextField, styled, Typography, Stack} from "@mui/material";

const Input = styled(({label, ...props})=>{
    return (
        <Stack spacing={0.5}>
            <Typography>{label}</Typography>
            <TextField {...props}/>
        </Stack>
    )
})(({theme})=>({
   "& .MuiInputBase-root.MuiOutlinedInput-root":{
        backgroundColor:"#1d1d1d",
        color:"#fff",
       
        "&.Mui-focused .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline":{
            borderColor:"#ffffffde"
        },

        "& .MuiOutlinedInput-notchedOutline":{
            borderColor:"#ffffffde"
        },

    },
}));


export default Input;

