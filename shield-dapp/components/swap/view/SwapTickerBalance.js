import Typography from "@mui/material/Typography"
import Skeleton from "@mui/material/Skeleton";
import { useTickerPrice, TICKER_ID } from "../../../context/swap/hooks/binanceTicker";


const useSwapTicker = ({currency})=>{
    const symbol = Boolean(currency?.isNative)?(TICKER_ID[currency?.chainId]):currency?.symbol
    const isUsdt = symbol?.toUpperCase() === "USDT";
    const {data} = useTickerPrice({
        symbol,
    });

    return data && Number(data?.price)
}

export default ({currency, ...props})=>{
    const price = useSwapTicker({currency});
    

    return <Typography {...props}>
        {
            loading?
            <Skeleton width="40"/>:
            (price?`$${price}`:'- - -')
        }
    </Typography>
}