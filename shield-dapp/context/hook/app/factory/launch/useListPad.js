import { useContractRead, useAccount } from "wagmi";
import padFactory from "../../../../../contract/PadFactory.sol/PadFactory.json";
import _contract from "../../../../../contract/address.json"


export const useListPadIds = ({
    address=_contract.padFactory
    })=>{
        const method = useContractRead({
            address,
            abi:padFactory.abi,
            functionName:"allPads"
        });

        return method;
}

export const useListCreatedPadIds = ({
    address=_contract.padFactory
    })=>{
    const {isConnected, address:owner} = useAccount();

    const method = useContractRead({
        address,
        abi:padFactory.abi,
        functionName:"ownedPads",
        args:[owner],
        enabled:isConnected,
        watch:true
    });

    return method;
}


export const usePadCreatedSize = ({
    address=_contract.padFactory
    })=>{
    const method = useContractRead({
        address,
        abi:padFactory.abi,
        functionName:"padSize"
    });

    return method;
}
