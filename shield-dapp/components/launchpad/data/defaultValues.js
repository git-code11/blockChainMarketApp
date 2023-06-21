import { constants } from "ethers"


export const createTokenDefValue = {
    name:"",
    symbol:"",
    decimals:18,
    totalSupply:10000
}


export const purchaseLaunchDefValue = ({buyToken, minBuy})=>async()=>({
    buyToken:buyToken,
    value:Number(minBuy)
});

const toDay = 1000 * 60 * 60 * 24;
const formatDate = date=>date.toISOString().split(/:\d+\.\d+Z/)[0]
export const createLaunchDefValue = async ()=>({
    token:{
        address:"0x67D495D90b0CF6cFa990659FF980A49D27eCaDD1",
        buyToken:constants.AddressZero,
        feeTier:1
    },
    launch:{
        preSale:250,
        dexSale:100,
        capped:100,
        minBuy:0.1,
        maxBuy:100,
        swapLiquidityPercent:75,
        startTime:formatDate(new Date()),
        endTime:formatDate(new Date(Date.now() + toDay * 14)),//14days
        lockUp:1,
        enablewhitelist:false
    },
    detail:{
        logoUrl:"https://tokens.pancakeswap.finance/images/eth/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png",
        name:`IDO Maker #${new Date().toISOString()}`,
        web:"http://ethereum.com",
        social:"@ether-rem",
        desc:"IDO to help support student",
        cid:""
    }
})