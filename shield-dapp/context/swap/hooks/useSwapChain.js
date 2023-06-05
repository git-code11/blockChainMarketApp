import {useCallback} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';
import { useAccount, useSwitchNetwork } from 'wagmi';

export default ()=>{
    const data = useSelector(state=>state.swap.chainId);
    const dispatch = useDispatch();

    const method = useSwitchNetwork();
    const {isConnected} = useAccount();

    const update = useCallback((chainId)=>{
        if(method.isLoading){
            return;
        }
            
        if(method.chains.includes(chainId)){
            
            if(isConnected && method.data.id !== chainId){
                method.switchNetworkAsync()
                    .then(chain=>
                                dispatch(actions.chainChange(chain.id))
                        )
            }else if(chainId !== data){
                dispatch(actions.chainChange(chainId));
            }
            
        }
        
    },[dispatch, method, isConnected, data]);

    const chainId = useMemo(()=>method.chain || data,[data, method.chain]);

    return {chain:method.data, chainId, update}
}


export const useSwapChainChanged = ()=>{
    const data = useSelector(state=>state.swap.chainId);
    const dispatch = useDispatch();
    useSwitchNetwork({
        onSuccess:data=>dispatch(actions.chainChange(chainId));
    })
}