
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useMemo } from "react";

/**
 * item can also be BigInt
 */

export default ({
    address,
    functionName,
    abi,
    args
    })=>{

 
    const {write, writeAsync, ...writeOpts} = useContractWrite({
        mode:'recklesslyUnprepared',
        address,
        abi,
        functionName,
        args
    });
    
    const wait = useWaitForTransaction({
        hash:writeOpts.data?.hash
    });

    const loading = useMemo(()=>
       writeOpts.isLoading || wait.isLoading
        ,[writeOpts, wait]);

    const error = useMemo(()=>
       writeOpts.error || wait.error
    ,[writeOpts, wait]);

    return {    
                write, writeAsync, 
                loading, error, success:wait.isSuccess, 
                reset: writeOpts.reset,
                hash:writeOpts.data?.hash,
                reciept:wait.data
            }
}