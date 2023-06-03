import useSwapCall from "./useSwapCall"
import { useAccount, useBalance, useContractRead, usePrepareContractWrite ,useContractWrite, useWaitForTransaction } from "wagmi";


export default (tokenAddress, spender)=>{
    const swapArgs = useSwapCall();
    const {address:owner, isConnected} = useAccount();
    const {data, isLoading} = useBalance({
        address:owner,
        token:tokenAddress,
        enabled:isConnected
    });

    const {approve:isApprove} = useContractRead({

    });

    const {write} = useContractWrite({

    });

    const prepare = usePrepareContractWrite({

    });

    return {write, isLoading, isError, txHash}
}