import { useContractRead } from "wagmi";
import padFactory from "../../../../../contract/PadFactory.sol/PadFactory.json";
import _contract from "../../../../../contract/address.json"



export default ({
    address=_contract.padFactory
    })=>{

    const method = useContractRead({
        address,
        abi:padFactory.abi,
        functionName:"fee"
    });

    return method
}