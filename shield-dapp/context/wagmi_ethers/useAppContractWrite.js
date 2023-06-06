
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useMemo } from "react";

/**
 * item can also be BigInt
 */

export default ({
    address,
    functionName,
    abi,
    args,
    enabled=true,
    ...props
    })=>{

    const {config, ...prepareOpts} = usePrepareContractWrite({
        address,
        abi,
        functionName,
        args,
        enabled,
        ...props
    });


    const {write, writeAsync, ...writeOpts} = useContractWrite(config);
    
    const wait = useWaitForTransaction({
        hash:writeOpts.data?.hash
    });

    const loading = useMemo(()=>
        prepareOpts.isLoading || writeOpts.isLoading || wait.isLoading
        ,[prepareOpts, writeOpts, wait]);

    const error = useMemo(()=>
        configOpts.error || writeOpts.error || wait.error
    ,[configOpts, writeOpts, wait]);

    return {    
                write, writeAsync, 
                loading, error, success:wait.isSuccess, 
                reset: writeOpts.reset, refetch:prepareOpts.refetch,
                hash:writeOpts.data?.hash,
                recipt:wait.data
            }
}