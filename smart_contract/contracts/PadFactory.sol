// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferHelper.sol";
import "./Launch/Pad.sol";
import "./Launch/LaunchCal.sol";
import "hardhat/console.sol";


struct LaunchPadParams{
    string ihash;

    address launchToken;
    address buyToken;

    uint256 startTime;
    uint256 endTime;

    uint256 capped;
    uint256 saleRate;
    uint256 dexRate;
    uint16 dexBps;

    uint256 minBuy;
    uint256 maxBuy;

    uint8 feeTier;

    uint16 lpLockPeriod;
        
    bool whiteListEnabled;
}

contract PadFactory is Ownable{
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    using Counters for Counters.Counter;
    Counters.Counter private _padCount;
    
    mapping(uint256=>address) public pads;

    mapping(address=>EnumerableSet.UintSet) private _createdPad;

    EnumerableSet.UintSet private _activePads;

    address public manager;
    address public managerWeth;
    address public weth;


    uint16[2][3] FeeOptions = [ 
            [500, 0],
            [uint16(200), uint16(200)], 
            [300, 0]
        ];
    uint256 public fee = 5678;

    event PadCreated(address indexed creator, address indexed launch);

    constructor(address manager_, address managerWeth_, address weth_){
        manager = manager_;
        managerWeth = managerWeth_;
        weth = weth_;
    }

    function setFee(uint256 fee_) external onlyOwner {
        fee = fee_;
    }

    function padSize() public view returns(uint256){
        return _padCount.current();
    }

    function ownedPads(address creator) public view returns(uint256[] memory){
        return _createdPad[creator].values();
    }

    function allPads() public view returns(uint256[] memory){
        return _activePads.values();
    }

    function createpad(LaunchPadParams memory params) external payable{
        require(msg.value == fee, "Pay factory Fee");
         
        _padCount.increment();
        uint256 newId = _padCount.current();
        LaunchPad.InitializeParams memory init_params =  LaunchPad.InitializeParams({
            feeReciever:owner(),
            manager:manager,
            managerWeth:managerWeth,
            weth:weth,
            dexBps:params.dexBps,
            bnbFeeBps:FeeOptions[params.feeTier][0],
            tkFeeBps:FeeOptions[params.feeTier][1],
            buyToken:params.buyToken,
            launchToken:params.launchToken,
            ihash:params.ihash,
            enabledwhitelisted:params.whiteListEnabled && false
        });

        LaunchPad newPad = new LaunchPad();
        newPad.initialize(init_params);
        console.log(params.startTime, params.endTime, params.lpLockPeriod);
        newPad.setPeriod(params.startTime, params.endTime, params.lpLockPeriod);
        newPad.setPurchaseLimitRate(params.capped, params.minBuy, params.maxBuy, params.saleRate, params.dexRate);

        pads[newId] = address(newPad);
        _createdPad[msg.sender].add(newId);
        _activePads.add(newId);

        TransferHelper.safeTransferETH(owner(), msg.value);
        PredictAmountParams memory p_params = PredictAmountParams({
            capped:params.capped,
            saleRate:params.saleRate,
            dexRate:params.dexRate,
            dexBps:params.dexBps,
            feeTier:params.feeTier
        });
        uint256 launchTokenAmount = predictAmount(p_params);
        TransferHelper.safeTransferFrom(params.launchToken, msg.sender, address(newPad), launchTokenAmount);

        emit PadCreated(msg.sender, pads[newId]);
    }

    struct PredictAmountParams{
        uint256 capped;
        uint256 saleRate;
        uint256 dexRate;
        uint16 dexBps;
        uint8 feeTier;
    }

    function predictAmount(PredictAmountParams memory params) public view returns (uint256){
        return LaunchCal.preSaleAmount(
            params.capped, 
            params.saleRate,
            FeeOptions[params.feeTier][0]
        )  + 
        LaunchCal.tkFeeAmount(
            params.capped, 
            params.saleRate,
            FeeOptions[params.feeTier][1]
        ) + 
        LaunchCal.preDexAmount(
            params.capped,
            params.dexRate,
            params.dexBps
        );
    }

    function amountOut(uint256 amountIn_, uint256 rate_) external pure returns (uint256){
        return LaunchCal.amountOut(amountIn_, rate_);
    }

    function amountIn(uint256 amountOut_, uint256 rate_) external pure returns (uint256){
        return LaunchCal.amountIn(amountOut_, rate_);
    }

}