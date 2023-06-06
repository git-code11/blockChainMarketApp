import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';
import { useSwitchNetwork } from 'wagmi';

export default ()=>{
    const dispatch = useDispatch();
    const {data, loading} = useSwitchNetwork();
    const chainId = useSelector(state=>state.swap.chainId);

    useEffect(()=>{
        if(loading || data?.id === chainId){
            return;
        }
        else if(data?.id && data?.id !== chainId){
            dispatch(actions.chainChange(data.id));
        }
    },[data, loading, chainId]);
}