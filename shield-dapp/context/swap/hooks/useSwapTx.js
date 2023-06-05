import { createSelector } from "@reduxjs/toolkit"
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux"
import e_msg from "../../lib/e_msg";
import { actions } from "../reducer"
import { getTxExplorer } from "../../../swap/src/smart/_utils";

const _selector = createSelector(state=>state.swap, swap=>swap.tx);

export default ()=>{
    const dispatch = useDispatch();
    const data = useSelector(_selector);

    const update = useCallback(({tx, success, error, chainId})=>{
        dispatch(actions.saveTx(
            {   
                explorer:getTxExplorer(tx, chainId),
                hash:tx?.transactionHash,
                success,
                error:error && (e_msg(error)||"Error Occured")
            })
        );
    });

    return {data, update}
}