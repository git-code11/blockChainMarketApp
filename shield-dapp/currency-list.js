import { constants } from "ethers"


const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

const devList = {
    USDT:"0x0fB5D7c73FA349A90392f873a4FA1eCf6a3d0a96"
}


const prodList = {
    BUSD:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
}



/**
 * Currencies to be used by NFT MARKET
 */
const _list = {
    BNB:constants.AddressZero,
    ...(IS_PRODUCTION?prodList:devList)
}

export default _list;