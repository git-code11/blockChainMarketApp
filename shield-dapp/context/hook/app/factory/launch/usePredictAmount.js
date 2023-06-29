

import {useContractRead} from "wagmi"
import padFactory from "../../../../../contract/PadFactory.sol/PadFactory.json";
import _contract from "../../../../../contract/address.js"
import {_1inputToOutputValueBps, to_pBips} from '../utils';
import { parseEther } from "ethers/lib/utils.js";

export default ({
    address=_contract.padFactory,
    enabled=true,
    params
    })=>{
    
    const methods = useContractRead({
        address,
        abi:padFactory.abi,
        args:[params],
        functionName:'predictAmount',
        enabled:enabled,
    });

    return {loading:methods.isLoading, ...methods};
}

export const predictAmountParams = ({capped, saleRate, dexRate, dexBps, feeTier, decimals})=>
        ({
            capped:parseEther(capped.toString()),
            saleRate:_1inputToOutputValueBps(saleRate.toString(), decimals),
            dexRate:_1inputToOutputValueBps(dexRate.toString(), decimals),
            dexBps:to_pBips(Number(dexBps)),
            feeTier:Number(feeTier)
        });
        