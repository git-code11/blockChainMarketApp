// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";


import "hardhat/console.sol";


contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl{

    bytes32 public constant PRODUCER = keccak256("PRODUCER_ROLE");
    //bytes32 public constant ADMIN = keccak256("ADMIN_ROLE");

    address public admin;
    address public producer;
    address public auction;
    
    using Counters for Counters.Counter;
    Counters.Counter private _itemCount;

    mapping(uint256=>address) public itemCreator;
    mapping(address=>uint256[]) public itemCreated;

    mapping(uint256=>bytes32) public getItemCat;
    mapping(bytes32=>uint256[]) public getItemsByCat;


    constructor(string memory name, string memory symbol, address admin_, address producer_) ERC721(name, symbol){
        //setting up role
        //_setRoleAdmin(PRODUCER, ADMIN);
        //grant double Role to admin
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(PRODUCER, admin_);
        admin = admin_;

        if(producer_ != address(0)){
            _grantRole(PRODUCER, producer_);
            producer = producer_;
        }
    }

    //producer is market
    function updateProducer(address producer_) external {
        require(producer_ != address(0), 'producer = 0');
        revokeRole(PRODUCER, producer);
        grantRole(PRODUCER, producer_);
        producer = producer_;
    }


    function updateAuction(address auction_) external onlyRole(PRODUCER){
        require(auction_ != address(0), 'auction = 0');
        auction = auction_;
    }


    function create(address creator, address owner, bytes32 cat, string memory cid) external onlyRole(PRODUCER) returns(uint256){
    	require(creator != address(0) && owner != address(0), "Creator or Owner must be valid");
        require(bytes(cid).length > 0 && cat.length > 0, "empty cid or cat");

        _itemCount.increment();
    	uint256 newId = _itemCount.current();
    	_safeMint(owner, newId);
        _setTokenURI(newId, cid);

        itemCreator[newId] = creator;
        itemCreated[creator].push(newId);

        getItemCat[newId] = cat;
        getItemsByCat[cat].push(newId);

        return newId;
    }

    function totalItemsByCategory(bytes32 cat) external view returns(uint256){
        return getItemsByCat[cat].length;
    }

    function totalCreated(address creator) external view returns(uint256){
        return itemCreated[creator].length;
    }

    /**
     * @dev See {ERC721-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    //only owner is allowed to update URI
    function updateTokenURI(uint256 tokenId, string memory cid) external {
        require(msg.sender == ownerOf(tokenId), "Only currenct owner allowed to update URI");
        _setTokenURI(tokenId, cid);
    }


    /**
     * @dev See {ERC721-_burn}.
     */
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }


    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        if(to != address(0)){
            //TODO: automatically make market manager approval for all
            if(!isApprovedForAll(to, producer) && to != producer && producer != address(0)){
                _setApprovalForAll(to, producer, true);
            }

            //TODO: automatically make auction manager approval for all
            if(!isApprovedForAll(to, auction) && to != auction && auction != address(0)){
                _setApprovalForAll(to, auction, true);
            }
        }
    }

    


    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable, AccessControl)  returns (bool) {
        return super.supportsInterface(interfaceId);
    }



}
