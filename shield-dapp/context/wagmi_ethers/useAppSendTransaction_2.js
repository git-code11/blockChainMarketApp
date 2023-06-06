import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useMemo } from "react";


//amountValue should pass non integer or BigInt
export default ({
    to,
    value,
    data:payload,
    ...props
    })=>{
    
    const {sendTransaction, sendTransactionAsync, data,
        error:sendError, isLoading:sendLoading, reset
    } = useSendTransaction({
            mode:'recklesslyUnprepared',
            request:{
                to,
                value,
                data:payload
            },
            ...props
    });

    const {isLoading:_loading, error:_error, data:reciept, isSuccess:success} = useWaitForTransaction({hash:data?.hash});
    
    const error = useMemo(()=>
        _error||sendError,
    [_error||sendError]
    )

    const loading = useMemo(()=>
        _loading || sendLoading,
        [_loading, sendLoading]
    )

    return {
        sendTransaction,
        sendTransactionAsync, 
        loading,
        error,
        reciept, 
        success,
        reset
    }
}