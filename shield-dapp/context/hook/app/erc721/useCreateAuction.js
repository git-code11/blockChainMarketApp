import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import auctionAbi from "../../../../contract/Auction.sol/MarketAuction.json"
import _contract from "../../../../contract/address.js"

export default ({
    address=_contract.auction,
    item,
    formArgs,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:auctionAbi.abi,
        functionName:"createAuction",
        args:[item, ...formArgs],
        enabled
    });

    return method;
}