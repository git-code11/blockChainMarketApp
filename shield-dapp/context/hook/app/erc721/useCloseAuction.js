import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";

export default ({
    address,
    args,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:auctionAbi.abi,
        functionName:"closeAuction",
        args,
        enabled,
    });

    return method;
}