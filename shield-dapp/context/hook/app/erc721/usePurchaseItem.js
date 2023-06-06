import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";


export default ({
    address,
    args,
    enabled,
    value
})=>{

    const method =  useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"purchase",
        args,
        enabled,
        overrides:{
            value
        }
    });

    return method
}