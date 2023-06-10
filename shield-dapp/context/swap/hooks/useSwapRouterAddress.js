import {
    utils as SmartUtils
} from "../../../swap/src/smart";


export default ({chainId})=>{
    return SmartUtils.getSwapRouterAddr(chainId);
}