
import { useToken, useNetwork } from "wagmi";
import { ChainId } from "@pancakeswap/sdk";
import { bsc, bscTestnet, mainnet, goerli } from "wagmi/chains";
import { useMemo } from "react";
import { constants, utils } from "ethers";


const CHAINS = {
    [ChainId.BSC_TESTNET]:bsc,
    [ChainId.BSC]:bscTestnet,
    [ChainId.ETHEREUM]:mainnet,
    [ChainId.GOERLI]:goerli
}

/**
 * To show that constants.AddressZero should be identified as native token
 */
export default ({
    address,
    enabled=true,
    chainId=97,
})=>{

    const {chain} = useNetwork();

    const isValid = useMemo(()=>utils.isAddress(address),[address]);
    const isToken = constants.AddressZero !== address && isValid;

    const method = useToken({
        address,
        enabled:isToken && enabled
    });

    const data = useMemo(()=>{
        if(!isValid){
            return null;
        }
        
        if(isToken){
            return method.data
        }else{
            if(chain){
                return chain.nativeCurrency
            }else{
                return CHAINS[chainId].nativeCurrency;
            }
        }
    },[isToken, isValid, method.data, chain]);


    return {data, isToken, isValid,
            ...(isToken?method:{})
        }
}