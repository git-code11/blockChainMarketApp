import { useContractRead } from "wagmi";
import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.json"



export default ({
    address,
    amountIn,
    enabled = true
    })=>{

    const method = useContractRead({
        address,
        abi:pad.abi,
        args:[amountIn],
        functionName:"saleExAmount",
        enabled
    });

    return method
}