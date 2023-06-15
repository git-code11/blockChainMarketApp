pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

library LaunchCal{
    /** 
     * capped amount => fund to be raised
     * dexBps => percentage of funds raised to be used for liquidity
     * Add percent fee of raised amount as token to be bought
     * Rate are should be expressed as bips due to decimal
    */

    // x = (1 + b) * p;
    // p = y * r
    // x = (y * r) * (1 + b)

    uint16 constant BPS = 10000;
    uint256 constant BPSBPS = 100000000; //BPS * BPS
    
    //No of token for sale including bnbFee
    function preSaleAmount(
    uint256 capped_, //y
    uint256 saleRate_, //r
    uint16 bnbFeeBps_ //b
    )
    internal pure
    returns (uint256) //x
    {
       return ( (capped_ * saleRate_) * (BPS + bnbFeeBps_) ) / BPSBPS;
    }

    //No of token as Fee
    function tkFeeAmount(
    uint256 capped_, 
    uint256 saleRate_,
    uint16 tkFeeBps_ 
    )
    internal pure
    returns (uint256)
    {
        return (capped_ * saleRate_ * tkFeeBps_) / BPSBPS;
    }
    
    //get new capped from no of sold preSale token
    // y2 = (x2 * y1) / x1
    function getCapped(
        uint256 tokenSold_,//x2
        uint256 capped_,//y1
        uint256 saleRate_,//r
        uint16 bnbFeeBps_//b
    )
    internal pure
    returns (uint256)
    {
        return (tokenSold_ * capped_) / preSaleAmount(capped_, saleRate_, bnbFeeBps_);
    }

    //get amounts and feeTk
    //[saleCap, dexCap, feeCap, feeTk]
    function getAmounts(
        uint256 newCapped,//x2
        uint256 tokenSold,
        uint16 dexBps_,
        uint16 bnbFeeBps_,//
        uint16 tkFeeBps_
    )
    internal pure
    returns (uint256[] memory){
        uint256[] memory amounts = new uint256[](4);

        //feeBNB
        amounts[2] = (newCapped * bnbFeeBps_) / (BPS + bnbFeeBps_);

        //saleBNB
        amounts[0] = newCapped - amounts[2];

        //dexBNB
        amounts[1] = (amounts[0] * dexBps_) / BPS;
        amounts[0] -= amounts[1];

        //FeeToken
        amounts[3] = (tokenSold * tkFeeBps_) / (BPS + bnbFeeBps_);
        
        return amounts;
        
    }
    

    //[saleCap, dexCap, feeCap, feeTk]
    function getAmountsV2(
        uint256 tokenSold_,//x2
        uint256 capped_,//y1
        uint256 saleRate_,//r
        uint16 bnbFeeBps_,//b
        uint16 dexBps_,
        uint16 tkFeeBps_
    )
    internal pure
    returns (uint256[] memory){
        uint256[] memory amounts = new uint256[](4);

        uint256 newCapped = getCapped(tokenSold_, capped_, saleRate_, bnbFeeBps_);

        //feeBNB
        amounts[2] = (newCapped * bnbFeeBps_) / (BPS + bnbFeeBps_);

        //saleBNB
        amounts[0] = newCapped - amounts[2];

        //dexBNB
        amounts[1] = (amounts[0] * dexBps_) / BPS;
        amounts[0] -= amounts[1];

        //FeeToken
        amounts[3] = (tokenSold_ * tkFeeBps_) / (BPS + bnbFeeBps_);
        
        return amounts;
        
    }


    //amountIn_ => buyToken Amount;
    //amountOut_ => launchToken Amount;
    //rate => no of launchToken / no of buyToken
    function amountOut(uint256 amountIn_, uint256 rate) internal pure returns (uint256){
        return (amountIn_ * rate)/BPS;
    }

    function amountIn(uint256 amountOut_, uint256 rate) internal pure returns (uint256){
        return (amountOut_ * BPS)/rate;
    }

}