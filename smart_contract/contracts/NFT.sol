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
    bytes32 public constant ADMIN = keccak256("ADMIN_ROLE");

    address public producer;
    address public admin;
    
    using Counters for Counters.Counter;
    Counters.Counter private _itemCount;

    mapping(uint256=>address) public itemCreator;
    mapping(address=>uint256[]) public itemCreated;


    constructor(string memory name, string memory symbol, address admin_, address producer_) ERC721(name, symbol){
        //setting up role
        _setRoleAdmin(PRODUCER, ADMIN);
        //grant double Role to admin
        _grantRole(ADMIN, admin_);
        _grantRole(PRODUCER, admin_);
        admin = admin_;

        if(producer_ != address(0)){
            _grantRole(PRODUCER, producer_);
            producer = producer_;
        }
    }

    function updateProducer(address producer_) external{
        revokeRole(PRODUCER, producer);
        grantRole(PRODUCER, producer_);
        producer = producer_;
    }


    function create(address creator, address owner, string memory cid) external onlyRole(PRODUCER) returns(uint256){
    	require(creator != address(0) && owner != address(0), "Creator or Owner must be valid");
        _itemCount.increment();
    	uint256 newId = _itemCount.current();
    	_safeMint(owner, newId);
        _setTokenURI(newId, cid);

        itemCreator[newId] = creator;
        itemCreated[creator].push(newId);

        return newId;
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
    }


    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable, AccessControl)  returns (bool) {
        return super.supportsInterface(interfaceId);
    }



}
