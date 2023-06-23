// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;


import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

import "./TransferHelper.sol";

interface IToken is IERC721 {
    function create(address creator, address owner, string memory cid) external returns(uint256);
}

contract MarketSales is Ownable{

    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    
    IToken public nft;
    
    struct ListPrice{
        address seller;//to check if seller has not transfer token to another
        address currency;
        uint256 amount;
        uint256 deadline;
    }
    
    uint16 constant BPS = 10000;
    uint16 public purchaseTaxBps = 100;
    uint256 public mintFee = 0;

    mapping(uint256=>ListPrice) public ItemForSale;

    //list of items
    EnumerableSet.UintSet private allItemsForSale;
    
    //user Address to list of items
    mapping(address => EnumerableSet.UintSet) private ownedItemsForSale;

    EnumerableSet.AddressSet private currencies;

    modifier permit(uint256 item){
        //1. Verify Owner of Item
        require(nft.ownerOf(item) == msg.sender, "Only Owner can add item to market");
        _;
    }

    modifier approved(uint256 item){
        //1. Check For Market Approval on Item
        require(nft.getApproved(item) == address(this), "Market require Approval from Owner");
        _;
    }

    function updatePurchaseTaxBps(uint16 taxBps) external onlyOwner{
        purchaseTaxBps = taxBps;
    }

    function updateMintFee(uint256 fee_) external onlyOwner{
        mintFee = fee_;
    }

    function updateNft(address nft_) external onlyOwner{
        nft = IToken(nft_);
    }
    
    
    function _addToMarket(address owner, uint256 item, address currency, uint256 amount, uint256 deadline) internal {
        //1. Add to currencies list
        currencies.add(currency);
        //2. Set Item Price
        ListPrice storage sale = ItemForSale[item];
        sale.seller = msg.sender;
        sale.currency = currency;
        sale.amount = amount;
        sale.deadline = deadline == 0?0:block.timestamp + deadline;//0 for infinity
        //3. Add Item to ForSale List
        allItemsForSale.add(item);
        ownedItemsForSale[owner].add(item);
    }

     function addToMarket(uint256 item, address currency, uint256 amount, uint256 deadline) external permit(item) approved(item){
        _addToMarket(msg.sender, item, currency, amount, deadline);
     }

    function _removeFromMarket(address owner, uint256 item) internal {
        //1. Remove Price Data
        delete ItemForSale[item];
        //2. Remove From ForSale List
        allItemsForSale.remove(item);
        ownedItemsForSale[owner].remove(item);
    }

    function removeFromMarket(uint256 item) external permit(item) {
       _removeFromMarket(msg.sender, item);
    }

    function purchase(uint256 item) external payable approved(item){
        ListPrice storage sale = ItemForSale[item];
        
        //1. Check for Abnormalities
        require(msg.sender != address(0), "Null address");
        require(allItemsForSale.contains(item) && nft.ownerOf(item) == sale.seller && 
                (sale.deadline == 0 || sale.deadline >= block.timestamp), "Item not available");
    
        //2. Check Pricing
        if(sale.currency == address(0)){
            //payment is made througn native Token (BNB)
            require(msg.value == sale.amount, "Incorrect price");
            uint256 tax = (msg.value * purchaseTaxBps)/BPS;
            TransferHelper.safeTransferETH(sale.seller, msg.value - tax);
            //pay tax here
            TransferHelper.safeTransferETH(this.owner(), tax);

        }else{
            //payment made through ERC20 Token
            require(IERC20(sale.currency).allowance(msg.sender, address(this)) >= sale.amount, "Incorrect price");
            uint256 tax = (msg.value * purchaseTaxBps)/BPS;
            TransferHelper.safeTransferFrom(sale.currency, msg.sender, sale.seller, sale.amount - tax);
            //pay tax here
            TransferHelper.safeTransferFrom(sale.currency, msg.sender, this.owner(), tax);
        }

        //3. Transfer Items
        _transferItem(item);
        
        //4. Remove from market
        _removeFromMarket(sale.seller, item);
    }

    
    /**
     * Transfer Ownership of Item from seller to buyer
     */
    function _transferItem(uint256 item) internal{
        //1. get token owner address
        address owner = nft.ownerOf(item);
        //2. transfer token from seller to buyer
        nft.safeTransferFrom(owner, msg.sender, item);
    }


    function queryAllByIndex(uint256 index) external view returns(uint256){
        return allItemsForSale.at(index);
    }

    function queryOwnedByIndex(address owner, uint256 index) external view returns(uint256){
        return ownedItemsForSale[owner].at(index);
    }

    function allSize() external view returns(uint256){
        return allItemsForSale.length();
    }

    function ownedSize(address owner) external view returns(uint256){
        return ownedItemsForSale[owner].length();
    }

    function getAllItems() external view returns(uint256[] memory){
        return allItemsForSale.values();
    }

    function getOwneditems(address owner) external view returns(uint256[] memory){
        return ownedItemsForSale[owner].values();
    }


    function createItem(address creator, address owner, string memory cid, uint256 amount, address currency, uint256 deadline) external payable returns(uint256){
        //TODO: pay minting fee
        uint256 item = nft.create(creator, owner, cid);
        if(mintFee > 0){
            require(msg.value == mintFee, "Invalid minting fee");
            TransferHelper.safeTransferETH(this.owner(), mintFee);
        }

        if(amount > 0){
            _addToMarket(msg.sender, item, currency, amount, deadline);
            //will be active only when approved by the owner after creation
        }

        return item;
    }
}