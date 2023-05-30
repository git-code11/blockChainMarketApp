import {useCallback} from 'react'
import { useSelector, useDispatch } from "react-redux"
import {actions} from '../reducer';

export default ()=>{
    const data = useSelector(state=>state.swap.modal);
    const dispatch = useDispatch();
    const update = useCallback((param)=>{
        dispatch(actions.toggleModal(param));
    },[dispatch])

    const toggle = useCallback((key, context)=>{
        update({[key]: !data[key], context:context??0})
    }, [update, data]);

    return {data, update, toggle}
}