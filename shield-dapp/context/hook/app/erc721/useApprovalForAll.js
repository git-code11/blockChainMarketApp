import { useContractRead, useAccount } from "wagmi";
import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import _contract from "../../../../contract/address.js";
import nftAbi from "../../../../contract/NFT.sol/NFT.json";

/**
 * item can also be BigInt
 */

//function isApprovedForAll(address owner, address operator) external view returns (bool);
//function setApprovalForAll(address operator, bool _approved) external;
export default ({
    address=_contract.nft,
    spender,
    approved=true,
    enabled=true
    })=>{

    const {address:owner} = useAccount();

    const {data:isApproved} = useContractRead({
        address:address,
        abi:nftAbi.abi,
        functionName:"isApprovedForAll",
        args:[owner, spender],
        enabled:Boolean(owner && spender),
        watch:true,
    });

    const _enabled = enabled && !(isApproved === approved);

    const method = useAppContractWrite({
        address,
        abi:nftAbi.abi,
        functionName:"setApprovalForAll",
        args:[spender, approved],
        enabled:_enabled
    });


    return {...method, isApproved}
}