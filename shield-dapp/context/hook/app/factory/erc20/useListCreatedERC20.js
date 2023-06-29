import {useContractRead, useAccount} from "wagmi"
import tokenFactory from "../../../../../contract/TokenFactory.sol/TokenFactory.json";
import _contract from "../../../../../contract/address.js"

export default ({
    address=_contract.tokenFactory
    })=>{
    const {isConnected, address:owner} = useAccount();
    
    const methods = useContractRead({
        address,
        abi:tokenFactory.abi,
        functionName:'createdToken',
        enabled:isConnected,
        watch:true,
        overrides:{
            from:owner
        }
    });

    return {loading:methods.isLoading, ...methods};
}