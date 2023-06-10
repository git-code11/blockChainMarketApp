
import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import saleAbi from "../../../../contract/Sale.sol/MarketSales.json"
import _contract from "../../../../contract/address.json"

export default ({
    address=_contract.sale,
    item,
    formArgs,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"addToMarket",
        args:[item, ...formArgs],
        enabled
    });

    return method;
}