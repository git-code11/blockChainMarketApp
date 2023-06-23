import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import useSwapBalance from '../../../context/swap/hooks/useSwapBalance';
import SwapGekoBalance from "./SwapGekoBalance";
/* import SwapTickerBalance from "./SwapTickerBalance"; */

export default ({currency})=>{
    const {formatted} = useSwapBalance(currency);
    
    return (
        <Stack direction="row" justifyContent="space-between">
            <SwapGekoBalance color="secondary" currency={currency}/>
            {/* <SwapTickerBalance color="secondary" currency={currency}/> */}
            <Typography color="secondary">Bal: {formatted && Boolean(currency)?formatted:'- - -'}</Typography>
        </Stack>
    )
}