import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { actions } from "../reducer";

export default ()=>{

    const dispatch = useDispatch();

    const lock = useCallback(()=>{
        dispatch(actions.lockTrade());
    },[dispatch]);

    return lock;
}