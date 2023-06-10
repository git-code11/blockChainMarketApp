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

//An Escrow COntract for offer
//Offers only in native token
contract MarketOffer is Ownable{
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    IERC721 public nft;
    IWETH public weth;

    enum OfferStatus {
        Pending,
        Accepted,
        Rejected
    }

    struct Offer{
        uint256 price;
        address from;
        address tokenType;
        OfferStatus status;
    }

    //item => persons address => offer
    mapping(uint256 => mapping(address => Offer)) public offers;

    //user Address to list of with offer
    mapping(address => EnumerableSet.UintSet) private offersFrom;//all offers made by me
    mapping(uint256 => EnumerableSet.AddressSet) private allOffersTo;//all person who made offer on this item


    //EVENT
    event OfferEvent(uint256 item, address from);

    constructor(address nft_, address weth_){
        nft = IERC721(nft_);
        weth = IWETH(weth_);
    }
    
    function updateNft(address nft_) external onlyOwner{
        nft = IERC721(nft_);
    }
    
    //offers in BNB
    function makeOffer(uint256 item) external payable{
        require(msg.sender != address(0), "address null");
        require(msg.value != 0, "invalid amount");
        //1. adding Offer info
        Offer storage offer = offers[item][msg.sender];
        offer.from = msg.sender;
        offer.price = msg.value;
        offer.status = OfferStatus.Pending;
        
        //2. add to list
        offersFrom[msg.sender].add(item);
        allOffersTo[item].add(msg.sender);

        //TODO: Add amount to WETH for contract
        weth.deposit{value:msg.value}();

        emit OfferEvent(item, msg.sender);
    }


    function acceptOffer(uint256 item, address from) external{
        require(nft.ownerOf(item) == msg.sender, "no permission");
        //1. updating status
        Offer storage offer = offers[item][from];
        require(offer.status == OfferStatus.Pending,'not pending');
        offer.status = OfferStatus.Accepted;
        
        //TODO: transfer amount to owner
        weth.withdraw(offer.price);
        TransferHelper.safeTransferETH(msg.sender, offer.price);
        
        //TODO: pay tax

        //TODO: transfer token
        nft.safeTransferFrom(msg.sender, from, item);

        //2. remove from list
        //offersFrom[msg.sender].remove(item);
        //allOffersTo[item].remove(msg.sender);
        emit OfferEvent(item, from);
    }

    function rejectOffer(uint256 item, address from) external{
        //1. updating status
        Offer storage offer = offers[item][from];
        require(offer.status == OfferStatus.Pending,'not pending');
        offer.status = OfferStatus.Rejected;
        
        //TODO: return amount back
        weth.withdraw(offer.price);
        TransferHelper.safeTransferETH(from, offer.price);

        //2. remove from list
        //offersFrom[msg.sender].remove(item);
        //allOffersTo[item].remove(msg.sender);
        emit OfferEvent(item, from);
    }

    function closeOffer(uint256 item) external{
        Offer storage offer = offers[item][msg.sender];
        
        require(offer.status == OfferStatus.Pending, "Operation not possible");
        
        offer.status == OfferStatus.Rejected;

        ///TODO: return amount back
        weth.withdraw(offer.price);
        TransferHelper.safeTransferETH(msg.sender, offer.price);

        //2. remove from list
        allOffersTo[item].remove(msg.sender);//token owner not meant to see this
        emit OfferEvent(item, msg.sender);
    }

    function offersBy() external view returns(uint256[] memory){
        return offersFrom[msg.sender].values();
    }

    function offersOn(uint256 item) external view returns(address[] memory){
        return allOffersTo[item].values();
    }
}
