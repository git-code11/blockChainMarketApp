import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useMemo } from "react";


//amountValue should pass non integer or BigInt
export default ({
    to,
    value,
    data:payload,
    enabled,
    ...props
    })=>{
    
    const {config, error:prepareError, isLoading:prepareLoading, refetch} = usePrepareSendTransaction({
        request:{
            to,
            value,
            data:payload
        },
        enabled,
        ...props
    });

    const {sendTransaction, sendTransactionAsync, data,
        error:sendError, isLoading:sendLoading, reset
        } = useSendTransaction(config);


    const {isLoading:_loading, error:_error, data:reciept, isSuccess:success} = useWaitForTransaction({hash:data?.hash});


    const error = useMemo(()=>
        _error||sendError||prepareError,
    [_error||sendError||prepareError]
    )

    const loading = useMemo(()=>
        _loading || sendLoading || prepareLoading,
        [_loading, sendLoading, prepareLoading]
    )

    return {
        sendTransaction,
        sendTransactionAsync, 
        loading,
        error,
        hash:data?.hash,
        reciept, 
        success,
        reset,
        refetch
    }
}