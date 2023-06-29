import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.js"
import useAppContractWrite_2 from "../../../../wagmi_ethers/useAppContractWrite_2";
import { usePadInfoByAddress } from "./padInfo";
import { useMemo } from "react";

const useCanPurchase = ({address})=>{
    const {data} = usePadInfoByAddress({address});

    return useMemo(()=>{
        const currentTime = Date.now()/1000;
        return (
            data.startTime < currentTime &&
            data.endTime > currentTime &&
            data.tokenTotal !== data.tokenSold &&
            !data.preSaleCompleted
        )
    },[data]);
}


export default ({
    address,
    isToken,
    amountIn
})=>{

    const _enabled = useCanPurchase({address});

    const {write, writeAsync, ...methods} = useAppContractWrite_2({
        address,
        abi:pad.abi,
        args:[amountIn],
        functionName:"purchase",
        overrides:{
            value:isToken?0:amountIn
        }
    });

    return {
        write:_enabled && write,
        writeAsync:_enabled && writeAsync,
        ...methods
    };
}