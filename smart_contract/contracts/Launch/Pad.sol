pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./LaunchCal.sol";
import "../TransferHelper.sol";
import "../IWETH.sol";
import "./Liquidity.sol";

import "hardhat/console.sol";

struct Info{
    uint256 startTime;
    uint256 endTime;

    uint256 saleRate;
    uint256 dexRate;
    uint16 dexBps;

    uint256 minBuy;
    uint256 maxBuy;

    uint256 capped;
    uint256 tokenTotal;
    uint256 tokenSold;

    address launchToken;
    address buyToken;

    uint16 lpLockPeriod;
    uint256 lpLockStartTime;
    uint256 lpToken;
    bool lpCompleted;
        
    string ihash;

    bool whiteListEnabled;
    bool preSaleCompleted;
    uint256 totalParticipant;

    PaymentType payType;
}


enum PaymentType{BNB, BUSD} //BNB = WBNB

contract LaunchPad is Liquidity, Ownable{
    using EnumerableSet for EnumerableSet.AddressSet;

    address weth;
    address payable feeReciever;

    uint16 bnbFeeBps;
    uint16 tkFeeBps;

    Info private info;

    mapping(address => uint256) public investedAmount;

    EnumerableSet.AddressSet private allWhiteListed;


    event PurchasedToken(address buyer, uint256 price, uint256 amount);
    event Completed(address token);
    event AddedToDex(uint256 lpToken, uint256 lockStartTime);
    event ClaimedLpToken(address creator, uint256 amount);
    event WhiteListed(address client);

    error InsufficientLaunchToken(string message, uint256 remaining);


    modifier hasStarted(){
        require(info.startTime < block.timestamp, "has not started");
        _;
    }

    modifier hasEnded(){
        require(info.endTime > block.timestamp, "has not ended");
        _;
    }

    modifier isRunning(){
        require(info.startTime < block.timestamp && info.endTime > block.timestamp, "Not running");
        _;
    }

    modifier tokenNotSoldOut(){
        require(remainingToken() > 0, "Token Already Sold Out");
        _;
    }

    /**
     *can decide to withdraw after dexsale and fee is completed gained
     */
    //soldout starts when 75% of token is sold
    
    modifier canClose(){
        require(info.tokenSold >= (info.tokenTotal * 75) / 100);
        _;
    }

    modifier hasPreSaleNotCompleted(){
        require(!info.preSaleCompleted, "Pre Sale already Completed");
        _;
    }

    modifier hasPreSaleCompleted(){
        require(info.preSaleCompleted, "Pre Sale not yet Completed");
        _;
    }
   

    modifier ableToPurchase(){
       require(!info.whiteListEnabled || isWhiteListed(msg.sender),"Client not yet whitelisted");//whiteListed
        _;
    }
    
    function getInfo() external view returns(Info memory){
        return info;
    }

    struct InitializeParams {
        address feeReciever;
        address manager;
        address managerWeth;
        address weth;
        uint16 dexBps;
        uint16 bnbFeeBps;
        uint16 tkFeeBps;
        address buyToken;//The token for exchange like BUSD
        address launchToken;
        string ihash;
        bool enabledwhitelisted;
    }

    function initialize(InitializeParams memory params) external{
        weth = params.weth;
        feeReciever = payable(params.feeReciever);
        setManager(params.manager, params.managerWeth);

        bnbFeeBps = params.bnbFeeBps;
        tkFeeBps = params.tkFeeBps;

        info.dexBps = params.dexBps;
        info.buyToken = params.buyToken;
        info.launchToken = params.launchToken;
        info.ihash = params.ihash;
        info.payType = (params.buyToken == address(0x0))?PaymentType.BNB:PaymentType.BUSD;
        info.whiteListEnabled = params.enabledwhitelisted;
    }

    function setEnableWhiteList(bool _enable) public onlyOwner{
        info.whiteListEnabled = _enable;
    }

    function addToWhiteList(address client) public onlyOwner{
        require(client == address(0),"Null can not be whitelisted");
        allWhiteListed.add(client);
    }

    function removeFromWhiteList(address client) public onlyOwner{
        allWhiteListed.remove(client);
    }

    function getWhiteList() public view returns(address[] memory){
        return allWhiteListed.values();
    }

    function isWhiteListed(address client) public view returns (bool){
        return allWhiteListed.contains(client);
    }

    /**
     * set startTime, endTime, lpLockPeriod
     */
    function setPeriod(uint256 startTime_, uint256 endTime_, uint16 lpLockPeriod_) public onlyOwner{
        require(info.startTime == 0 && info.endTime == 0,
                    "Already Initialized Use `extendPeriod` instead");
        require(endTime_ > startTime_ && endTime_ > block.timestamp, "Invalid EndTime");
        require(lpLockPeriod_ > 0, "Days must be greater 30 or above");
        info.startTime = startTime_;
        info.endTime = endTime_;
        info.lpLockPeriod = lpLockPeriod_;
    }


    /**
     * _exTime added to block.timestamp for extension
     * only when token not sold out completely
     */
    function extendPeriod(uint256 _exTime) public onlyOwner tokenNotSoldOut{
        require(info.endTime != 0 && info.endTime < block.timestamp,"New End Time not greater");
        info.endTime = block.timestamp + _exTime;
    }

    /**
     *Upper and Lower Purchase Limit with rate
     */
    function setPurchaseLimitRate(uint256 capped_, uint256 minBuy_, uint256 maxBuy_, uint256 saleRate_, uint256 dexRate_) public onlyOwner{
        require(capped_ > minBuy_ && minBuy_ < maxBuy_ && minBuy_ > 0, "Invalid Limit");
        require(saleRate_ > 0 && dexRate_ > 0 && saleRate_ > dexRate_, "Invalid Rate");
        info.capped = capped_;
        info.minBuy = minBuy_;
        info.maxBuy = maxBuy_;
        info.saleRate = saleRate_;
        info.dexRate = dexRate_;
        info.tokenTotal = LaunchCal.preSaleAmount(capped_, saleRate_, bnbFeeBps);
    }


    /**
     *purchase Token
     *all paid fee are stored in contract then after launch period they are delivered
     *check if invested amount is out of purchase bound
     */
    function __purchaseToken(uint256 amount) private returns(uint256){
        
        require(amount > 0 && investedAmount[msg.sender] + amount >= info.minBuy 
                        && investedAmount[msg.sender] + amount <= info.maxBuy, "Unable to purchase due to limit boundaries");
        
        uint256 launchTokenAmount =  saleExAmount(amount);
        //TODO:
        //Be able to transfer only required spendable amount
        require(remainingToken() >= launchTokenAmount, "Not Enought Token");

        if(investedAmount[msg.sender] == 0){
            info.totalParticipant += 1;//add new person
        }
        
        investedAmount[msg.sender] += amount;
        info.tokenSold += launchTokenAmount;

        return launchTokenAmount;
    }

    function purchase(uint256 amountIn_) payable public isRunning tokenNotSoldOut hasPreSaleNotCompleted ableToPurchase{
        
        uint256 amountIn = info.payType == PaymentType.BNB?msg.value:amountIn_;
        uint256 amountOut = __purchaseToken(amountIn);

        // //TODO:
        // //Be able to transfer only required spendable amount
        // uint256 remainingLaunchToken = info.tokenTotal - info.tokenSold;
        // if(remainingLaunchToken < amountOut){
        //     //revert InsufficientLaunchToken("Not enought launchToken ", remainingLaunchToken);
        //     console.log("Remain", remainingLaunchToken);
        //     revert("Not enought launchToken ");
        // }

        //TODO: transfer buytoken to contract
        //TODO: transfer launchtoken to buyer

        if(info.payType == PaymentType.BNB){
            TransferHelper.safeTransferETH(weth, msg.value);
        }else{
            TransferHelper.safeTransferFrom(info.buyToken, msg.sender, address(this), amountIn);
        }

        TransferHelper.safeTransfer(info.launchToken, msg.sender, amountOut);

        emit PurchasedToken(msg.sender, amountIn, amountOut);
    }

    function complete(bool skipDex) public onlyOwner canClose hasPreSaleNotCompleted{
        
        info.preSaleCompleted = true;
        
        uint256 newCapped;//current balance of buytoken
        if(info.payType == PaymentType.BNB){
            newCapped = IWETH(weth).balanceOf(address(this));

            //TODO: Unwrap for Native Transfer
            IWETH(weth).withdraw(newCapped);
        }else{
            newCapped = IERC20(info.buyToken).balanceOf(address(this));
        }

        uint256[] memory amounts = LaunchCal.getAmounts(
                    newCapped,
                    info.tokenSold,
                    info.dexBps,
                    bnbFeeBps,
                    tkFeeBps
                );
        //console.log(amounts[0],amounts[1],amounts[2], amounts[3]);
        
        //TODO: remove already implemented
        // //TODO: Unwrap for Native Transfer
        // if(info.payType == PaymentType.BNB){
        //     IWETH(weth).withdraw(newCapped); 
        // }

        //TODO: add to dex
        if(!skipDex){
            _addDex(amounts[1]);
        }

        //TODO: payFee
        _payFee(amounts[2], amounts[3]);
        
    
        //amounts[0]
        //TODO: transfer capped to admin
        _sendOwner();

        emit Completed(info.buyToken);
    }

    function _sendOwner() private{
        //TODO: transfer buy token to admin
        
        if(info.payType == PaymentType.BNB){
            if(address(this).balance > 0){
                TransferHelper.safeTransferETH(this.owner(), address(this).balance);
            }
        }else{
            uint256 _balance = IERC20(info.buyToken).balanceOf(address(this));
            if(_balance > 0){
                TransferHelper.safeTransfer(info.buyToken, this.owner(), _balance);
            }
        }
        
        //TODO: transfer remenant token to admin
        uint256 remainingLaunchToken = IERC20(info.launchToken).balanceOf(address(this));
        if(remainingLaunchToken > 0){
            TransferHelper.safeTransfer(info.launchToken, this.owner(), remainingLaunchToken);
        }
    }

    function _payFee(uint256 bnbFee_, uint256 tkFee_) private{
        if(tkFee_ > 0){
            TransferHelper.safeTransfer(info.launchToken, feeReciever, tkFee_);
        }

        if(bnbFee_ > 0){
            if(info.payType == PaymentType.BNB){
                TransferHelper.safeTransferETH(feeReciever, bnbFee_);    
            }else{
                TransferHelper.safeTransfer(info.buyToken, feeReciever, bnbFee_); 
            }
        }
    }

    function _addDex(uint256 dexAmount) private{
        uint256 dexToken = dexExAmount(dexAmount);
        
        //TODO: Wrap for Native Transfer in ManagerWeth
        if(info.payType == PaymentType.BNB){
            TransferHelper.safeTransferETH(managerWeth, dexAmount);
            info.lpToken = addLiquidity(managerWeth, info.launchToken, dexAmount, dexToken);             
        }else{
            //TODO add Liquidity
            info.lpToken = addLiquidity(info.buyToken, info.launchToken, dexAmount, dexToken);            
        }

        //TODO: remove any remaining value from manager weth if any
        _emptyManagerWeth();

        info.lpLockStartTime = block.timestamp;
        emit AddedToDex(info.lpToken, info.lpLockStartTime);
    }


    /**
     *Lp token will be claimed by token owner after lpTokenLockPeriod
     *dontremoveDex_ will transfer lptoken to owner and not remove liquidity from dex
     */
    function claimLpToken(bool dontremoveDex_) external onlyOwner hasPreSaleCompleted{
        uint256 lpLockEndTimeTime = info.lpLockStartTime + info.lpLockPeriod * 1 days;
        require(lpLockEndTimeTime < block.timestamp && !info.lpCompleted, "Lock Time not yet Exceeded");
        info.lpCompleted = true;
        //TODO: transfer Lp token to owner Lptoken
        if(dontremoveDex_){
            transferLp(this.owner(), info.lpToken);
        }else{
            _removeDex();
        }
        
        emit ClaimedLpToken(this.owner(), info.lpToken);
    }

    /**
     *Lp token will be claimed by token owner after lpTokenLockPeriod
     */
    function _removeDex() private {
    
        //TODO: transfer Lp token to owner Lptoken
        removeLiquidity(info.lpToken);
        _emptyManagerWeth();
        _sendOwner();
    }

    function _emptyManagerWeth() private {
        if(info.payType == PaymentType.BNB){
            uint256 amount = IWETH(managerWeth).balanceOf(address(this));
            if(amount > 0){
                IWETH(managerWeth).withdraw(amount);
            }
        }
    }


    function remainingToken() public view returns (uint256){
        return info.tokenTotal - info.tokenSold;
    }

    function saleExAmount(uint256 amount) public view returns (uint256){
        return LaunchCal.amountOut(amount, info.saleRate);
    }

    function saleExAmountIn(uint256 amountOut) public view returns (uint256){
        return LaunchCal.amountIn(amountOut, info.saleRate);
    }

    function dexExAmount(uint256 amount) public view returns (uint256){
        return LaunchCal.amountOut(amount, info.dexRate);
    }

    receive() external payable {
        //to able withdrawal from weth
        //TODO: block non-contract address from sending direct value
        if(!Address.isContract(msg.sender)){
            //purchase(msg.value);
            revert("Call purchase direct");
        }
    }
}





