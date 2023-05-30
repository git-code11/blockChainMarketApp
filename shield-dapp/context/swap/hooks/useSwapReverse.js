import {useCallback} from 'react'
import { useDispatch } from "react-redux"
import {actions} from '../reducer';

export default ()=>{
    const dispatch = useDispatch();
    const update = useCallback(()=>{
        dispatch(actions.valuesReversed());
    },[dispatch])

    return update;
}