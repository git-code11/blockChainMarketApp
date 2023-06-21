import { useAccount, useContractRead } from "wagmi";
import padFactory from "../../../../../contract/PadFactory.sol/PadFactory.json";
import pad from "../../../../../contract/Pad.sol/LaunchPad.json";
import _contract from "../../../../../contract/address.json"
import { formatEther, formatUnits} from "ethers/lib/utils.js";
import { from_Bips, from_pBips } from "../utils";
import { constants } from "ethers";

export const useGetPadAddressById = ({
    address=_contract.padFactory,
    padId,
    enabled
    })=>{

    const method = useContractRead({
        address,
        abi:padFactory.abi,
        functionName:"pads",
        args:[padId],
        enabled
    });

    return method;
}


export const usePadInfoByAddress = ({
    address
    })=>{
        const method = useContractRead({
            address,
            abi:pad.abi,
            functionName:"getInfo",
            watch:true
        });

        return method;
}

export const usePadInfoById = ({
    padId
    })=>{
    
    const {data:padAddress} = useGetPadAddressById({
        padId,
        enabled:Boolean(padId)
    });

    const padInfoMethod = usePadInfoByAddress({
        address:padAddress
    });

    return {address: padAddress, ...padInfoMethod}
}

export const useGetInvestedAmount = ({
    address
    })=>{

        const {isConnected, address:owner} = useAccount();

        const method = useContractRead({
            address,
            abi:pad.abi,
            functionName:"investedAmount",
            args:[owner],
            enabled:isConnected,
            watch:true
        });

        return method;
}





const toDate = dt=>+dt;

export const parsePadInfoData = (data, outDecimal)=>{
    
    const _data = {
        saleRate:from_Bips(data.saleRate),
        dexRate:from_Bips(data.dexRate),
        dexBps:from_pBips(data.dexBps),
        minBuy:formatEther(data.minBuy),
        maxBuy:formatEther(data.maxBuy),
        capped:formatEther(data.capped),
        isBNBPayType:data.buyToken === constants.AddressZero,
        totalParticipant:data.totalParticipant.toBigInt(),
        tokenTotal:formatUnits(data.tokenTotal, outDecimal),
        tokenSold:formatUnits(data.tokenSold, outDecimal),
        lpLockPeriod:data.lpLockPeriod,
        startTime:toDate(data.startTime),
        endTime:toDate(data.endTime),
        percent:(data.tokenSold/data.tokenTotal)*100
    };

    return {...data, ..._data};
}
