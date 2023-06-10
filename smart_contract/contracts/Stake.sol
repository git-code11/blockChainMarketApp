// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./TransferHelper.sol";



contract Staking is Ownable{
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Slip{
        address stk;//stakeToken
        address btk;//bonusToken
        uint256 amount;
        uint256 deadline;
        bool drained;
    }

    struct Interest{
        uint256 duration;
        uint256 reward;
    }

    //stakeToken => bonusToken => Interest
    mapping(address => mapping(address => Interest)) interests;
    
    //stakeToken => bonusToken[]
    mapping(address => EnumerableSet.AddressSet) private _bonusTokens;

    EnumerableSet.AddressSet private _stakeTokens;

    //person => stakeId => Slip
    mapping(address => mapping(uint256 => Slip)) public slips;

    //person =>  stakeCount;
    mapping(address => uint256) public stakeCount;

    /**
     * Add Bonus Token to contract
     */
    function fill(address stk, address btk, uint256 reward, uint256 duration) external onlyOwner{
        uint256 amount = IERC20(btk).allowance(address(this), msg.sender);
        require(amount > 0, "Allowance needed on bonus Token");
        Interest storage _int = interests[stk][btk];
        _int.duration = duration;
        _int.reward = reward;//product Ratio for reward
        
        _stakeTokens.add(stk);
        _bonusTokens[stk].add(btk);

        //TODO: transfer all allowance of bonus token to contract
        TransferHelper.safeTransfer(btk, address(this), amount);
    }

    /**
     * Drain Bonus Token to Owner
     */
    function drain(address btk) external onlyOwner{
        uint256 amount = IERC20(btk).balanceOf(address(this));
        require(amount > 0, "Balance is 0");
        
        //TODO: empty contract bonusToken
        TransferHelper.safeTransfer(btk, msg.sender, amount);
    }

    /**
     * Interest computation
     */
    function computeInterest(address stk, address btk, uint256 amount) public view returns (uint256) {
        return interests[stk][btk].reward * amount;
    }

    function stake(address stk, address btk, uint256 amount) external{
        require(msg.sender != address(0));
        require(IERC20(stk).allowance(address(this), msg.sender) >= amount, "Allowance not enough");
        uint256 reward = computeInterest(stk, btk, amount);
        require(IERC20(btk).balanceOf(address(this)) >= reward, 'Reward not enough');
        Slip storage slip = slips[msg.sender][stakeCount[msg.sender]];
        slip.amount = amount;
        slip.stk = stk;
        slip.btk = btk;
        slip.deadline = block.timestamp + interests[stk][btk].duration;
        stakeCount[msg.sender]++;
        
        //TODO: transfer btk to person and stk to contract
        TransferHelper.safeTransfer(btk, msg.sender, reward);
        TransferHelper.safeTransfer(stk, address(this), amount);
    }

    function unstake(uint256 index) external{
        Slip storage slip = slips[msg.sender][index];
        require(slip.deadline >= block.timestamp, 'Still active');
        slip.drained = true;
        //TODO: transfer stk
        TransferHelper.safeTransfer(slip.stk, msg.sender, slip.amount);
    }

    function stakeTokens() external view returns(address[] memory){
        return _stakeTokens.values();
    }

    function bonusTokens(address stk) external view returns(address[] memory){
        return _bonusTokens[stk].values();
    }

    function getSlip(uint256 id) public view returns (Slip memory){
        return slips[msg.sender][id];
    }
}