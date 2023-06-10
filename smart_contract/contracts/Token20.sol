// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token20 is ERC20('FREETOKEN', 'FRT'){
    constructor(){
        _mint(msg.sender, 1000 * 1 ether);
    }

    function lend(address addr) external{
        _mint(addr, 100 * 1 ether);
    }
}