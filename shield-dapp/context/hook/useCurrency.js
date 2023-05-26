import {constants} from "ethers";

import { usePublicClient , useToken } from "wagmi"

export default (address)=>{
    const publicClient = usePublicClient();
    const enabled = !!address?address != constants.AddressZero:false;

    const {data:token, ...more} = useToken({
        address,
        enabled
    });
    const data = enabled?token:publicClient.chain?.nativeCurrency//publicClient.chains[0]?.nativeCurrency;
    
    return {data, ...more}
}