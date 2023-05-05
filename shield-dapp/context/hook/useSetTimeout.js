import {useState, useEffect, useCallback} from 'react';


export default (_cb, _interval, disabled, ...args)=>{
    const [state, setState]= useState(null);
    const [close, setClose] = useState(false);

    const exit = useCallback(()=>{
        setClose(true);
    },[]);
    
    useEffect(()=>{
        let _id = 0;
        
        if(close||disabled)
            return;

        const _func = ()=> {
            _cb(setState, exit, ...args);
            _id = setTimeout(_func, _interval);
        }

        _func();
        return ()=>clearTimeout(_id);
    },[_interval, close, args, disabled]);

    return [state, exit];
}