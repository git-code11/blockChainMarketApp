
// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "hardhat/console.sol";
import "./Launch/Liquidity.sol";
import './INonfungiblePositionManager.sol';

contract EnTest is Liquidity{

    address buyToken=0x0fB5D7c73FA349A90392f873a4FA1eCf6a3d0a96;
    address launchToken=0x67D495D90b0CF6cFa990659FF980A49D27eCaDD1;
    address manager_=0x427bF5b37357632377eCbEC9de3626C71A5396c1;
    address weth_=0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;

    uint256 amount = 100;
    uint256 lpToken;

    constructor(){
        setManager(manager_, weth_);
    }

    function addDex() external{
        TransferHelper.safeTransferFrom(buyToken, msg.sender, address(this), amount);
        TransferHelper.safeTransferFrom(launchToken, msg.sender, address(this), amount);

        lpToken = addLiquidity(buyToken, launchToken, amount, amount);
    }
    
    function removeDex() external{
        (uint256 amount0, uint256 amount1) = removeLiquidity(lpToken);
        TransferHelper.safeTransfer(buyToken, msg.sender,  amount0);
        TransferHelper.safeTransfer(launchToken, msg.sender,  amount1);
    }
}