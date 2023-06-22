import { useContractRead } from "wagmi";
import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.json"
import { usePadInfoByAddress } from "./padInfo";
import { useMemo } from "react";
import { BigNumber } from "ethers";


export const useRemainAmountIn = ({address})=>{

    const {data} = usePadInfoByAddress({
        address
    });

    const amountOut = useMemo(()=>data && BigNumber.from(data.tokenTotal.toBigInt() - data.tokenSold.toBigInt()),[data])
    
    return useAmountIn({
        address,
        amountOut:amountOut,
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