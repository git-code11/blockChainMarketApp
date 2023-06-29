import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import _contract from "../../../../contract/address.js";
import nftAbi from "../../../../contract/NFT.sol/NFT.json";

/**
 * item can also be BigInt
 */

export default ({
    address=_contract.nft,
    item,
    spender,
    enabled=true
    })=>{

    const _item = useMemo(()=>item && BigNumber.from(item),[item])

    const {data:approvedAddress} = useContractRead({
        address:address,
        abi:nftAbi.abi,
        functionName:"getApproved",
        args:[_item],
        enabled:Boolean(_item),
        watch:true,
    });

    const isApproved = approvedAddress === spender;

    const _enabled = enabled && !isApproved;

    const method = useAppContractWrite({
        address,
        abi:nftAbi.abi,
        functionName:"approve",
        args:[spender, _item],
        enabled:_enabled
    });


    return {...method, isApproved}
}