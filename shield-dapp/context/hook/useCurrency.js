import {constants} from "ethers";

import { useProvider, useToken } from "wagmi"

export default (address)=>{
    const provider = useProvider();
    const enabled = !!address?address != constants.AddressZero:false;

    const {data:token, ...more} = useToken({
        address,
        enabled
    });
    const data = enabled?token:provider.chains[0]?.nativeCurrency;
    
    return {data, ...more}
}