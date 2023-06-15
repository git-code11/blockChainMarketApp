// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "hardhat/console.sol";

contract TokenERC20 is ERC20{
    
    uint8 private _decimals;

    constructor(address owner, string memory name_, string memory symbol_, uint8 decimals_, uint256 totalSupply_) ERC20(name_, symbol_){
        _decimals = decimals_;
        _mint(owner, totalSupply_ * (10**decimals_));
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

}

contract TokenFactory{
    using EnumerableSet for EnumerableSet.AddressSet;
    mapping(address => EnumerableSet.AddressSet) private tokens;

    event Created(address indexed owner, address indexed token);

    struct CreateParams {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    function create(CreateParams memory params) external{
        TokenERC20 _tk = new TokenERC20(msg.sender, params.name, params.symbol, params.decimals, params.totalSupply);
        tokens[msg.sender].add(address(_tk));
        emit Created(msg.sender, address(_tk));
    }

    function createdToken() external view returns(address[] memory){
        return tokens[msg.sender].values();
    }
}