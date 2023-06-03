import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";


export default (currency)=>{
    const {address:owner} = useAccount();

    const {data:result, isLoading, isError} = useBalance({
        address:owner,
        token:currency?.address,
        enabled:Boolean(currency)
    });
    
    const value = useMemo(()=>result && Number(result.formatted).toFixed(3),[result])

    return {result, value, isLoading, isError}
}