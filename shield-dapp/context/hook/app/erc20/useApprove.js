import { useAccount, useBalance, useContractRead, usePrepareContractWrite ,useContractWrite, useWaitForTransaction, useContractReads } from "wagmi";;
import { erc20ABI } from "wagmi";
import { useMemo, useCallback} from "react";
import { BigNumber } from "ethers";


//amountValue should pass non integer or BigInt
export default ({
    address: tokenAddress,
    amountValue:_amountValue,
    spender,
    maxApprove=true, 
    enabled=true
    })=>{
    
    const {address:owner} = useAccount();

    const {data:tData} = useContractReads({
        contracts:[
            {
                address:tokenAddress,
                abi:erc20ABI,
                functionName:"balanceOf",
                args:[owner]
            },
            {
                address:tokenAddress,
                abi:erc20ABI,
                functionName:"allowance",
                args:[owner, spender],
            }
        ],
        enabled:Boolean(owner) && Boolean(spender) && enabled,
        watch:true
    });

    const [balance, allowance] = tData || [];

    

    const valuesDefined = Boolean(balance && allowance);

    const amountValue = _amountValue && BigNumber.from(_amountValue);
    const isApproved = useMemo(()=>
        valuesDefined  && allowance?.toBigInt() >= amountValue?.toBigInt() && balance?.toBigInt() >= amountValue?.toBigInt(),
    [valuesDefined, allowance, amountValue, balance]);

    const approveAmount = maxApprove?balance:amountValue;

    const enableApprove = useMemo(()=>
        valuesDefined && Boolean(spender) && Boolean(approveAmount) && !isApproved,
            [valuesDefined, isApproved, spender, isApproved, approveAmount]);
    
    const {config, error:prepareError, isLoading:prepareLoading, refetch} = usePrepareContractWrite({
        address:tokenAddress,
        abi:erc20ABI,
        functionName:"approve",
        args:[spender, approveAmount],
        enabled: enableApprove && enabled,
    });

    const {write, writeAsync, data, isLoading:writeLoading, error:writeError, reset:_reset} = useContractWrite(config);

    const {isLoading:_loading, error:_error, data:reciept, isSuccess:success} = useWaitForTransaction({hash:data?.hash});

    const error = useMemo(()=>
        _error||writeError||prepareError,
    [_error||writeError||prepareError]
    )

    const loading = useMemo(()=>
        _loading || writeLoading || prepareLoading,
        [_loading, writeLoading, prepareLoading]
    )

    const reset = useCallback(()=>{
        _reset();
    },[refetch, _reset]);

    return {    balance,
                allowance,
                write,
                writeAsync,
                isApproved, 
                loading,
                error,
                reciept,
                success,
                reset
            }
}