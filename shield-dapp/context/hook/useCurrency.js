import {useMemo} from 'react';
import {constants} from "ethers";

import { useToken, useNetwork } from "wagmi"
import { bscTestnet } from "wagmi/chains";

const defaultNative = bscTestnet.nativeCurrency;

export default (address)=>{
    const {chain} = useNetwork();
    const enabled = Boolean(address)?address != constants.AddressZero:false;

    const {data:token, ...more} = useToken({
        address,
        enabled
    });
    
    const data = useMemo(()=>
        enabled?token:(chain?.nativeCurrency ?? defaultNative),
        [enabled, chain, token]
    );
    
    return {data, ...more}
}