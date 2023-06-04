import { getSwapRouterAddr } from "../../../swap/src/smart/_utils"

export default ({chainId})=>{
    return getSwapRouterAddr(chainId);
}