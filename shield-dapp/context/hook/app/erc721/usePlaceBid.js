import useAppContractWrite from "../../../wagmi_ethers/useAppContractWrite";
import auctionAbi from "../../../../contract/Auction.sol/MarketAuction.json"
import _contract from "../../../../contract/address.js"

export default ({
    address=_contract.auction,
    item,
    enabled,
    value
    })=>{

    const method = useAppContractWrite({
        address,
        abi:auctionAbi.abi,
        functionName:"placeBid",
        args:[item],
        enabled,
        overrides:{
            value
        }
    });

    return method;
}