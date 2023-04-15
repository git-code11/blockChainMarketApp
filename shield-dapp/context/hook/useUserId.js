import {useMemo, useEffect} from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";


export default ()=>{

    const {address} = useAccount();
    const {query:{uid}, replace, pathname} = useRouter();
    const isMe = useMemo(()=>address && (address === uid || uid === "me"),[address, uid]);
    
    useEffect(()=>{
        if(address && uid === "me"){
            replace({
                pathname,
                query: { uid: address}
               });
         }
    },[uid, address]);

    return {uid ,address, isMe};
}