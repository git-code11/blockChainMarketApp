import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useCallback, useMemo } from "react";


//amountValue should pass non integer or BigInt
export default (calldata, __enabled)=>{
    
    const {config, error:prepareError, isLoading:prepareLoading, refetch} = usePrepareSendTransaction({
        request:{
            to:calldata?.to,
            value:calldata?.value,
            data:calldata?.data
        },
        chainId:calldata?.chainId,
        enabled:Boolean(calldata) && __enabled
    });

    const {sendTransaction, sendTransactionAsync, data,
        error:sendError, isLoading:sendLoading, reset:_reset
        } = useSendTransaction(config);


    const {isLoading:_loading, error:_error, data:tx, isSuccess:success} = useWaitForTransaction({hash:data?.hash});
    
    //console.log({sendData:data, sendError,  prepareError});

    const error = useMemo(()=>
        _error||sendError||prepareError,
    [_error||sendError||prepareError]
    )

    const loading = useMemo(()=>
        _loading || sendLoading || prepareLoading,
        [_loading, sendLoading, prepareLoading]
    )

    const reset = useCallback(()=>{
        _reset();
        //refetch();
    },[refetch, _reset]);

    return {
        sendTransaction, sendTransactionAsync, 
        loading,
        error,
        tx, 
        success,
        reset
    }
}