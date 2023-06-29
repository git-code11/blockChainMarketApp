import useAppContractWrite_2 from "../../../../wagmi_ethers/useAppContractWrite_2";
import tokenFactory from "../../../../../contract/TokenFactory.sol/TokenFactory.json";
import _contract from "../../../../../contract/address.js"


export default ({
    address=_contract.tokenFactory,
    params,
    })=>{

    const method = useAppContractWrite_2({
        address,
        abi:tokenFactory.abi,
        functionName:"create",
        args:[params]
    });

    return method;
}