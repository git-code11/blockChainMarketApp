import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";


export default (currency, watch=true)=>{
    const {address:owner} = useAccount();

    const {data:result, isLoading, isError} = useBalance({
        address:owner,
        token:currency?.address,
        enabled:Boolean(currency),
        chainId:currency?.chainId,
        watch
    });
    
    const formatted = useMemo(()=>result && Number(result.formatted).toFixed(3),[result])

    const value = useMemo(()=>result && result.value.toBigInt(),[result])

    return {result, formatted, value, isLoading, isError}
}