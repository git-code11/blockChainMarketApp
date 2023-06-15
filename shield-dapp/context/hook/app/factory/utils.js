import {defaultAbiCoder, parseEther, parseUnits}  from 'ethers/lib/utils.js';


export const prepareCreatePadParams = (data, outputDecimals=18)=>{
    const params = {
        ihash:"hash str",
        launchToken:launchTk.address,
        buyToken:buyTk.address,
        startTime:Math.round(Date.now()/1000),
        endTime:Math.round(Date.now()/1000) + 60*60*1,//1hr
    
        capped:parseEther("20"),
        saleRate:sellRate,//parseEther("1"),
        dexRate:dexRate,
        dexBps:7000,//70%
    
        minBuy:parseEther("0.01"),
        maxBuy:parseEther("20"),
    
        feeTier:2,
    
        lpLockPeriod:1,//1day
            
        whiteListEnabled:false,
    } 

    return params;
}

export const parseAddress = addr=>defaultAbiCoder.decode(["address"], addr)[0];

const _OutputPerinputBps = (input, output)=> Math.round((output * 10000) / input);
//belive for input to have 18 decimals
export const _1inputToOutputBps = (output, decimals)=>_OutputPerinputBps(parseEther("1"), parseUnits(output, decimals));