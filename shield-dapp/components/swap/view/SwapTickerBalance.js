import Typography from "@mui/material/Typography"
import { useSwapTickerPrice } from "../../../context/swap/hooks/binanceTicker";

export default ({currency, ...props})=>{
    const price = useSwapTickerPrice({currency});
    
    return <Typography {...props}>
        {
            (price?`$${price}`:'- - -')
        }
    </Typography>
}