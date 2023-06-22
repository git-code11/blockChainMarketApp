import { constants } from "ethers";
import { formatDate } from "../../../context/lib";

export const addToSaleDefValue = {
    amount:1,
    currency:constants.AddressZero,
    duration:0
}


const toDay = 1000 * 60 * 60 * 24;

export const createAuctionDefValue = async()=>({
    reserve:1,
    scheduled:false,
    startTime:formatDate(new Date()),
    endTime:formatDate(new Date(Date.now() + toDay * 7)),
    diffTime:1//24hrs default
});


export const extendAuctionDefValue = {
    extendTime:1
}

