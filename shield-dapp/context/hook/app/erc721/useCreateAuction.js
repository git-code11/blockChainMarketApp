import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";

export default ({
    address,
    args,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"createAuction",
        args,
        enabled
    });

    return method;
}