import {useState, useCallback, createContext, useContext} from 'react';


const _context = createContext();

const useDataContext = ()=>useContext(_context);

const Provider = ({children, globalData})=>{
    const [visible, setVisible] = useState({});

    const show = useCallback((id)=>{
        setVisible(_state=>({..._state, [id]:true}));
    },[setVisible]);

    const hide = useCallback((id)=>{
        setVisible(_state=>({..._state, [id]:false}));
    },[setVisible]);

    return (
        <_context.Provider value={{globalData, show, hide, visible}}>
            {children}
        </_context.Provider>
    )
}

export default Provider;
export {useDataContext};