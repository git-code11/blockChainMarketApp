import { useContractRead, useContractWrite, usePrepareContractWrite, useToken} from 'wagmi'

import { useAccount } from 'wagmi';

const launchFactoryContractAddress = "";
/**
 * Launchpad Creation
 */


/**
 * Description: Withdraw Fee to `Factory Owner wallet`
 * 
 */
const withdrawFeeABI = ''
function useWithdrawFee() {
    const { config } = usePrepareContractWrite({
    address: launchFactoryContractAddress,
    abi: withdrawFeeABI,
    functionName: 'withdrawFee'
    });
    
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
    
    return { data, isLoading, isSuccess, write };
}