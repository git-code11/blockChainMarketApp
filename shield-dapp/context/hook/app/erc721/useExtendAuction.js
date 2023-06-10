import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import auctionAbi from "../../../../contract/Auction.sol/MarketAuction.json"
import _contract from "../../../../contract/address.json"

export default ({
    address=_contract.auction,
    item,
    duration,
    enabled
    })=>{

    const method = useAppContractWrite({
        address,
        abi:auctionAbi.abi,
        functionName:"extendAuction",
        args:[item, duration],
        enabled
    });

    return method;
}