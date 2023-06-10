import {useCallback, useMemo} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { utils as SmartUtils } from '../../../swap/src/smart';

const {MAP_ID_CHAIN} = SmartUtils;

const swapChainIds = Object.keys(MAP_ID_CHAIN).map(Number);

export default ()=>{
    const data = useSelector(state=>state.swap.chainId);
    const dispatch = useDispatch();

    const {switchNetwork, isLoading:switchLoading} = useSwitchNetwork();
    const network = useNetwork();
    const {isConnected, isLoading} = useAccount();

    const update = useCallback((chainId)=>{
        if(isLoading){
            return;
        }
            
        if(swapChainIds.includes(chainId)){

            if(isConnected && network.chain?.id !== chainId){
                switchNetwork(chainId)
            }else if(chainId !== data){
                dispatch(actions.chainChange(chainId));
            }
            
        }
        
    },[dispatch, switchNetwork, network, isConnected, isLoading]);

    const chainId = useMemo(()=>network.chain?.id || data,[data, network.chain]);

    return {chain:network.chain, chainId, update, chains:network.chains, loading: switchLoading}
}


