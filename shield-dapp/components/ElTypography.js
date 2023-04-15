
import {Typography, styled} from "@mui/material";

const ElTypography = styled(Typography)(()=>({
    overflow:"hidden",
    maxWidth:"10ch",
    textOverflow:"ellipsis"
}));


export default ElTypography;