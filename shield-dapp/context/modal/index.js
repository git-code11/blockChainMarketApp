import {useContext, createContext, useCallback, useReducer} from 'react';

const modalContext = createContext();
const useModalContext = ()=>useContext(modalContext);

const modalReducer = (prevState, newState)=>{
    return {...prevState, ...newState}
}

const defaultState = {
    createItem:false
}

export default ({children})=>{
    const [state, update] = useReducer(modalReducer, defaultState);

    return (
        <modalContext.Provider value={{state, update}}>
            {children}
        </modalContext.Provider>
    )
}

export const useModal = (modal_id)=>{
    const {update, state} = useModalContext();
    const visible = state[modal_id];
    
    const toggle = useCallback(()=>
            update({[modal_id]:!visible}),
        [modal_id, visible]);

    const toggleId = useCallback(_id=>
        update({[_id]:!state[_id]}),
    [state]);
    return {visible, toggle, toggleId, state}
}