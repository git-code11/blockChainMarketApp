import { useRouter } from "next/router";
import { useAccount } from "wagmi";


export default ()=>{
    const {address} = useAccount();
    const {query:{uid}, isReady} = useRouter();
    const isMe = address === uid;
    return {uid, isMe, isReady};
}
