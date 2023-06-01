import {useCallback} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';

export default ()=>{
    const data = useSelector(state=>state.swap.output);
    const dispatch = useDispatch();
    const update = useCallback((param)=>{
        if(param.amount){
            param.amount = Number(param.amount).toString();
        }
        dispatch(actions.outputChange(param));
    },[dispatch])

    return {data, update}
}