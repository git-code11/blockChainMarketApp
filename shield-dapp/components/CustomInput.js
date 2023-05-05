import {styled} from '@mui/material';

export default  styled('input')(({theme})=>({
    display:"block",
    height:"80px",
    width:"100%",
    outline:"none",
    border:"none",
    backgroundColor:"transparent",
    textAlign:"end",
    fontSize:theme.spacing(5),
    margin:0,
    fontFamily:"consolas",
    paddingTop:"30px"
}));