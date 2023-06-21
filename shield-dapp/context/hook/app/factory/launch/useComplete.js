import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.json"
import useAppContractWrite_2 from "../../../../wagmi_ethers/useAppContractWrite_2";
import { usePadInfoByAddress } from "./padInfo";
import { useMemo } from "react";


const useCanComplete = ({address})=>{
    const {data} = usePadInfoByAddress({
        address
    });
    return useMemo(()=>{
        const currentTime = Date.now()/1000;
        return (
            data && 
            data.startTime < currentTime &&
            (data.tokenSold / data.tokenTotal) >= 0.75 &&
            !data.preSaleCompleted
        );
    },[data]);
}

export default ({
    address
})=>{

    const _enabled = useCanComplete({address})

    const {write, writeAsync, ...methods} = useAppContractWrite_2({
        address,
        abi:pad.abi,
        functionName:"complete",
    });

    return {
        write:_enabled && write,
        writeAsync:_enabled && writeAsync,
        ...methods
    };
}