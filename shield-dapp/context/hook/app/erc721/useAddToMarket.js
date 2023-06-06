import { BigNumber } from "ethers";
import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";

export default ({
    address,
    item,
    formArgs,
    enabled=true
    })=>{

    const _item = useMemo(()=>item && BigNumber.from(item),[item]);

    const _enabled = enabled && Boolean(_item);

    const method = useAppContractWrite({
        address,
        abi:saleAbi.abi,
        functionName:"addToMarket",
        args:[_item, ...formArgs],
        enabled:_enabled
    });

    return method;
}