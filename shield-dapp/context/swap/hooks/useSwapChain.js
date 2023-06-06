import {useCallback, useMemo} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { MAP_ID_CHAIN } from '../../../swap/src/smart/_utils';

const swapChainIds = Object.keys(MAP_ID_CHAIN).map(Number);

export default ()=>{
    const data = useSelector(state=>state.swap.chainId);
    const dispatch = useDispatch();

    const method = useSwitchNetwork();
    const {isConnected} = useAccount();

    const update = useCallback((chainId)=>{
        console.log({first:chainId, swapChainIds})
        if(method.isLoading){
            return;
        }
            
        if(swapChainIds.includes(chainId)){
            console.log({inc:chainId})
            if(isConnected && method.data?.id !== chainId){
                method.switchNetworkAsync(chainId)
                    .then(chain=>
                                dispatch(actions.chainChange(chain.id))
                        )
            }else if(chainId !== data){
                dispatch(actions.chainChange(chainId));
            }
            
        }
        
    },[dispatch, method, isConnected, data]);

    const chainId = useMemo(()=>method.chain || data,[data, method.chain]);

    return {chain:method.data, chainId, update, chains:method.chains, loading: method.isLoading}
}


