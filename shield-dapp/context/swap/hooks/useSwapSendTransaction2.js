import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useCallback, useMemo } from "react";


//amountValue should pass non integer or BigInt
export default (calldata, __enabled)=>{
    
    const {sendTransaction, sendTransactionAsync, data,
        error:sendError, isLoading:sendLoading, reset:_reset
    } = useSendTransaction({
            mode:'recklesslyUnprepared',
            request:{
                to:calldata?.to,
                value:calldata?.value,
                data:calldata?.data
            },
            chainId:calldata?.chainId
    });


    const {isLoading:_loading, error:_error, data:tx, isSuccess:success} = useWaitForTransaction({hash:data?.hash});
    
    const error = useMemo(()=>
        _error||sendError,
    [_error||sendError]
    )

    const loading = useMemo(()=>
        _loading || sendLoading,
        [_loading, sendLoading]
    )

    const reset = useCallback(()=>{
        _reset();
        //refetch();
    },[_reset]);

    return {
        sendTransaction, sendTransactionAsync, 
        loading,
        error,
        tx, 
        success,
        reset
    }
}