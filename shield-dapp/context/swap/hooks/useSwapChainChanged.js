import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';
import { useNetwork } from 'wagmi';

export default ()=>{
    const dispatch = useDispatch();
    const chainId = useSelector(state=>state.swap.chainId);
    const {chain} = useNetwork();

    useEffect(()=>{
        if(chain?.id === chainId){
            return;
        }
        else if(chain && chain?.id !== chainId){
            
            dispatch(actions.chainChange(chain.id));
        }
    },[chain, chainId]);
}