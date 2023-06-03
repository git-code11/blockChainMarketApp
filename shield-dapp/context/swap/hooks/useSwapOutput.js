import {useCallback} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';


export default ()=>{

    const data = useSelector(state=>state.swap.output);
    const dispatch = useDispatch();
    const update = useCallback((param)=>{
        if(param.amount){
            throw Error("Not allowed to set amount of output manually");
        }
        dispatch(actions.outputChange(param));
    },[dispatch])

    return {data, update}
}