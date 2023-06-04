import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { actions } from "../reducer";

export default ()=>{

    const dispatch = useDispatch();

    const lock = useCallback(()=>{
        dispatch(actions.lockTrade());
    },[dispatch]);

    const unlock = useCallback(()=>{
        dispatch(actions.unlockTrade());
    },[dispatch]);

    return {lock, unlock};
}