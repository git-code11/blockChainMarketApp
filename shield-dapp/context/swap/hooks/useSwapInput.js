import {useCallback} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';

export default ()=>{
    const data = useSelector(state=>state.swap.input);
    const dispatch = useDispatch();
    const update = useCallback((param)=>{
        dispatch(actions.inputChange(param));
    },[dispatch])

    return {data, update}
}