import { useAccount, useContractRead, usePrepareContractWrite ,useContractWrite, useWaitForTransaction } from "wagmi";
import { useSwapCurrency } from "./currency";
import { erc20ABI } from "wagmi";
import { useMemo, useCallback} from "react";
import useSwapBalance from "./useSwapBalance";
import { BigNumber } from "ethers";


//amountValue should pass non integer or BigInt
export default ({chainId, address: tokenAddress}, amountValue, spender, maxApprove=true, __enabled=true)=>{
    const {address:owner} = useAccount();
    const currency = useSwapCurrency(tokenAddress);
    const {value:balance} = useSwapBalance(currency);

    const {data:allowance} = useContractRead({
        address:tokenAddress,
        abi:erc20ABI,
        functionName:"allowance",
        args:[owner, spender],
        enabled:Boolean(owner) && Boolean(spender) && __enabled,
        select:data=>data.toBigInt(),
        watch:true,
        chainId:chainId
    });

    const approveAmount = useMemo(()=>maxApprove?balance:amountValue,[maxApprove,balance, amountValue]);

    const valuesDefined = useMemo(()=>!(isNaN(Number(allowance)) || isNaN(Number(balance))),[allowance, balance]);

    const isApproved = useMemo(()=>
        valuesDefined  && allowance >= amountValue && balance >= amountValue,
    [valuesDefined, allowance, amountValue, balance]);

    const enableApprove = useMemo(()=>
        valuesDefined && Boolean(spender) && Boolean(approveAmount) && !isApproved,
            [valuesDefined, isApproved, spender, isApproved]);
    
    const {config, error:prepareError, isLoading:prepareLoading, refetch} = usePrepareContractWrite({
        address:tokenAddress,
        abi:erc20ABI,
        functionName:"approve",
        args:[spender, approveAmount?BigNumber.from(approveAmount):null],
        enabled: enableApprove && __enabled,
        chainId:chainId
    });

    const {write, writeAsync, data, isLoading:writeLoading, error:writeError, reset:_reset} = useContractWrite(config);

    const {isLoading:_loading, error:_error, data:tx, isSuccess:success} = useWaitForTransaction({hash:data?.hash});

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

    return {write, writeAsync, isApproved, 
                loading,
                error,
                tx,
                success,
                reset
            }
}