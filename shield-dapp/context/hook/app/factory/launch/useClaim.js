import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.js"
import useAppContractWrite_2 from "../../../../wagmi_ethers/useAppContractWrite_2";
import { usePadInfoByAddress } from "./padInfo";
import { useMemo } from "react";

const useCanClaim = ({address})=>{

    const {data} = usePadInfoByAddress({
        address
    });

    return useMemo(()=>{
        const currentTime = Date.now()/1000;
        return (
            data && 
            data.lpLockStartTime > 0 &&
            (data.lpLockStartTime + data.lpLockPeriod * 86400) > currentTime &&
            !data.lpCompleted
        )
    },[data]);
}

export default ({
    address,
    dontRemoveDex=false
})=>{

    const _enabled = useCanClaim({address})

    const {write, writeAsync, ...methods} = useAppContractWrite_2({
        address,
        abi:pad.abi,
        args:[dontRemoveDex],
        functionName:"claimLpToken",
    });

    return {
        write:_enabled && write,
        writeAsync:_enabled && writeAsync,
        ...methods
    };
}