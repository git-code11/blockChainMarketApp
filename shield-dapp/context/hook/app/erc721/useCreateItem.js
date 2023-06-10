import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import saleAbi from "../../../../contract/Sale.sol/MarketSales.json"
import _contract from "../../../../contract/address.json"

export default ({
    address=_contract.sale,
    args,
    enabled
})=>{

    const method = useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"createItem",
        args,
        enabled
    });

    return method;
}