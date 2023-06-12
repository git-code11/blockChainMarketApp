import {useCallback} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {actions} from "./reducer"

const useRouteLoading = ()=>{
    const state = useSelector(state=>state.route.loading);
    const dispatch = useDispatch();

    const update = useCallback(condition=>dispatch(actions.loading(condition)),[]);

    return {state, update}
}


export {useRouteLoading}