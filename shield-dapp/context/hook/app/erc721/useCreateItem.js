import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import saleAbi from "../../../../contract/Sale.sol/MarketSales.json"
import _contract from "../../../../contract/address.json"
import { useContractRead } from "wagmi";

export default ({
    address=_contract.sale,
    args,
    enabled
})=>{

    const fee = useContractRead({
        address,
        abi:saleAbi.abi,
        functionName:"mintFee",
    });

    const method = useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"createItem",
        args,
        enabled:enabled && fee.isSuccess,
        overrides:{
            value:fee.data??0
        }
    });

    return method;
}
