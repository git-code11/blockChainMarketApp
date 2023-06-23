import Typography from "@mui/material/Typography"
import Skeleton from "@mui/material/Skeleton";
import { useMemo } from "react";
import { useSwapNativePrice, useSwapTokenPrice, GEKO_VS, GEKO_ACTIVE_ID } from "../../../context/swap/hooks/gekoExchange"
import { useSwapTickerPrice } from "../../../context/swap/hooks/binanceTicker";

export default ({currency, ...props})=>{
    const nativeEnabled = Boolean(currency?.isNative) && GEKO_ACTIVE_ID.includes(currency?.chainId);
    const native = useSwapNativePrice({
        enabled:nativeEnabled,
        ids:[currency?.chainId],
        vs:[GEKO_VS.USD]
    });

    const tokenEnabled = Boolean(currency?.isToken) && GEKO_ACTIVE_ID.includes(currency?.chainId);
    const token = useSwapTokenPrice({
        enabled:tokenEnabled,
        id:[currency?.chainId],
        vs:[GEKO_VS.USD],
        tokens:[currency?.address]
    })

    const _price = useMemo(()=>{
        if(currency && (native.data || token.data)){
            if(currency.isToken){
                return token.data.parsed[currency.address.toLowerCase()]?.usd
            }
            return native.data.parsed[currency.chainId].usd
        }
        return null;
    },[token.data, native.data, currency]);

    const tickPriceEnabled = ([97, 56]).includes(currency?.chainId);
    const _tick_price = useSwapTickerPrice({
                currency,
                enabled:tickPriceEnabled
            });

    //use TickerPrice for bnb && geko for eth
    const price = tickPriceEnabled?_tick_price:_price;
    

    const loading = currency?.isToken?token.loading:native.loading;
    

    return <Typography {...props}>
        {
            loading?
            <Skeleton width="40"/>:
            (price?`$${price}`:'- - -')
        }
    </Typography>
}