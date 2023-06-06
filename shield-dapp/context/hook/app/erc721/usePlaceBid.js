import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";

export default ({
    address,
    args,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:auctionAbi.abi,
        functionName:"extendAuction",
        args,
        enabled
    });

    return method;
}