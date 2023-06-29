import useAppContractWrite_2 from "../../../../wagmi_ethers/useAppContractWrite_2";
import padFactory from "../../../../../contract/PadFactory.sol/PadFactory.json";
import _contract from "../../../../../contract/address.js"
import {_1inputToOutputValueBps, to_pBips} from '../utils';
import { parseEther } from "ethers/lib/utils.js";


export default ({
    address=_contract.padFactory,
    params,
    value
    })=>{
    
    const method = useAppContractWrite_2({
        address,
        abi:padFactory.abi,
        functionName:"createpad",
        args:[params],
        overrides:{
            value
        }
    });

    return method;
}

const toDate = d=>(new Date(d));
export const prepareCreatePadParams = (data, outputDecimals=18)=>{
    // console.log({prepare:data});
    const params = {
        ihash:data.ihash,
        launchToken:data.launchToken,
        buyToken:data.buyToken,
        startTime:Math.round(toDate(data.startTime).getTime()/1000),
        endTime:Math.round(toDate(data.endTime).getTime()/1000),
    
        capped:parseEther(data.capped.toString()),
        saleRate:_1inputToOutputValueBps(data.saleRate.toString(), outputDecimals),
        dexRate:_1inputToOutputValueBps(data.dexRate.toString(), outputDecimals),
        dexBps:to_pBips(Number(data.dexBps)),//70%
        minBuy:parseEther(data.minBuy.toString()),
        maxBuy:parseEther(data.maxBuy.toString()),
    
        feeTier:Number(data.feeTier),
    
        lpLockPeriod:Number(data.lpLockPeriod),//1day
            
        whiteListEnabled:Boolean(data.whiteListEnabled),
    }

    console.log({pr:params})

    return params;
}