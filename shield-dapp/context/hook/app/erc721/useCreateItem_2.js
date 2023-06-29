import useAppContractWrite_2 from "../../../wagmi_ethers/useAppContractWrite_2";
import saleAbi from "../../../../contract/Sale.sol/MarketSales.json"
import _contract from "../../../../contract/address.js"
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

    const method = useAppContractWrite_2({
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