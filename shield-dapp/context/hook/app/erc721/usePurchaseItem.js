import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import saleAbi from "../../../../contract/Sale.sol/MarketSales.json"
import _contract from "../../../../contract/address.js"

export default ({
    address=_contract.sale,
    item,
    enabled,
    value
})=>{

    const method =  useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"purchase",
        args:[item],
        enabled,
        overrides:{
            value
        }
    });

    return method
}