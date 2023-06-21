import { constants } from "ethers";

export const addToSaleDefValue = {
    amount:1,
    currency:constants.AddressZero,
    duration:0
}

export const createAuctionDefValue = async()=>({
    reserve:1,
    scheduled:false,
    startTime:(new Date).toISOString().split('T')[0],
    endTime:(new Date(Date.now() + DIFFTIME)).toISOString().split('T')[0],
    diffTime:24//24hrs default
});


export const extendAuctionDefValue = {
    extendTime:1
}

