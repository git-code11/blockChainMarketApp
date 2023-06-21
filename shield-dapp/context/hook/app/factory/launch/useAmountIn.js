import { useContractRead } from "wagmi";
import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.json"
import { usePadInfoByAddress } from "./padInfo";
import { useMemo } from "react";


export const useRemainAmountIn = ({address})=>{

    const {data} = usePadInfoByAddress({
        address
    });

    const amountOut = useMemo(()=>data && (data.tokenTotal - data.tokenSold),[data])
    
    return useAmountIn({
        address,
        amountOut:amountOut?.toString(),
        enabled:Boolean(amountOut)
    })
    
}

const useAmountIn = ({
    address,
    amountOut,
    enabled = true
    })=>{

    const method = useContractRead({
        address,
        abi:pad.abi,
        args:[amountOut],
        functionName:"saleExAmountIn",
        enabled
    });

    return method
}

export default useAmountIn;