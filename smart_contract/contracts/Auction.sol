// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

import "./TransferHelper.sol";
import "./IWETH.sol";

//An Escrow Contract to hold the token for the duration of auction

contract MarketAuction is Ownable, IERC721Receiver {
    using EnumerableSet for EnumerableSet.UintSet;

    IERC721 public nft;
    IWETH public weth;

    struct Auction {
        address creator;
        uint256 reserve;
        //address tokenType;
        uint256 startTime;
        uint256 diffTime;
        bool scheduled;
        uint256 total;
        address topBidder;
        uint256 price;
    }

    mapping(address => EnumerableSet.UintSet) private ownedItemsForAuction;

    EnumerableSet.UintSet private allItemsForAuction;

    mapping(uint256=>Auction) public auctions;

    mapping(uint256=>address[]) bidders;

    mapping(uint256=>uint256[]) bids;

    event AuctionEvent(uint256 item);

    constructor(address nft_, address weth_){
        nft = IERC721(nft_);
        weth = IWETH(weth_);
    }
    
    function updateNft(address nft_) external onlyOwner{
        nft = IERC721(nft_);
    }

    function createAuction(uint256 item, uint256 reserve, /*address tokenType,*/ uint256[] memory time, bool scheduled) external {
        
        require(nft.ownerOf(item) == msg.sender, "Only Owner can add item to market");
        require(nft.getApproved(item) == address(this), "Market require Approval from Owner");

        Auction storage acn = auctions[item];
        //require(acn.reserve == 0 || acn.price == 0, "on going auction");
        acn.scheduled = scheduled; 
        acn.startTime = scheduled?time[0]:0;
        acn.diffTime = time[1];
        acn.reserve = reserve;
        acn.creator = msg.sender;
        acn.total = 0;//incase of reauction
        //acn.tokenType = tokenType;

        //Transfer nft to escrow contract
        nft.safeTransferFrom(msg.sender, address(this), item);

        allItemsForAuction.add(item);
        ownedItemsForAuction[msg.sender].add(item);

        emit AuctionEvent(item);
    }

    function extendAuction(uint256 item, uint256 extraTime) external {
        Auction storage acn = auctions[item];
        require(acn.creator == msg.sender, "creator required");
        require(!acn.scheduled, "Already scheduled");

        //enable more time for unscheduled auction
        acn.diffTime += extraTime;

        emit AuctionEvent(item);
    }

    function placeBid(uint256 item) external payable{
        Auction storage acn = auctions[item];
        //uint256 price = msg.value;
        require(msg.value > acn.price && msg.value >= acn.reserve && acn.reserve > 0, "Low Amount");
        
        if(!acn.scheduled && acn.startTime == 0){
            //startTime will be set when reserve price is met for non Scheduled auction
            acn.startTime = block.timestamp;
        }

        require(acn.startTime <= block.timestamp && (acn.startTime + acn.diffTime) >= block.timestamp );
        
        //TODO: return previous topBidders money back;
        if(acn.topBidder != address(0)){
            TransferHelper.safeTransferETH(acn.topBidder, acn.price);
        }

        //TODO: transfer token to contract
        //(msg.value - acn.price);
        weth.deposit{value:address(this).balance}();
        
        acn.price = msg.value;
        acn.topBidder = msg.sender;
        acn.total += 1;

        emit AuctionEvent(item);
    }


    function closeAuction(uint256 item) external{
        Auction storage acn = auctions[item];
        require(msg.sender == acn.topBidder || msg.sender == acn.creator, "Not Eligible");
        require(acn.startTime > 0 && (acn.startTime + acn.diffTime) < block.timestamp , "ongoing auction");
        
        
        if(acn.topBidder != address(0)){
            //TODO: transfer nft  to  top bidder
            nft.safeTransferFrom(address(this), acn.topBidder, item);
            //TODO: transfer token to auction creator
            weth.withdraw(acn.price);
            TransferHelper.safeTransferETH(acn.creator, acn.price);
            //TODO: pay tax fee
        }else{
            //TODO: transfer nft  back to owner
            nft.safeTransferFrom(address(this), acn.creator, item);
        }
        
        allItemsForAuction.remove(item);
        ownedItemsForAuction[acn.creator].remove(item);
        delete auctions[item];

        emit AuctionEvent(item);
    }

    function queryAllByIndex(uint256 index) external view returns(uint256){
        return allItemsForAuction.at(index);
    }

    function queryOwnedByIndex(uint256 index) external view returns(uint256){
        return ownedItemsForAuction[msg.sender].at(index);
    }

    function allSize() external view returns(uint256){
        return allItemsForAuction.length();
    }

    function ownedSize() external view returns(uint256){
        return ownedItemsForAuction[msg.sender].length();
    }

    function getAllItems() external view returns(uint256[] memory){
        return allItemsForAuction.values();
    }

    function getOwnedItems() external view returns(uint256[] memory){
        return ownedItemsForAuction[msg.sender].values();
    }

    /*
    * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
    */

   /*
   function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){
    */
    function onERC721Received(address  ,address , uint256 , bytes calldata) external pure returns (bytes4){
        
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {
        //to able withdrawal from weth
    }

}
