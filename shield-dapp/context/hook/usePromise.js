import {useState, useEffect, useCallback} from 'react';


export default (_func)=>{
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const call = useCallback(async (...args)=>{
        if(loading)
            return;
        reset();
        setLoading(true);
        let _value = null;
        try{
            _value = await _func(...args);
            setValue(_value);
        }catch(e){
            setError(e);
        }
        setLoading(false);
        return _value;
    },[loading]);

    const reset = useCallback(()=>{
        if(loading)
            return;
        if(error)
            setError(null);
        if(value)
            setValue(null);
    },[loading, error, value]);

    return {value, loading, error, call, reset}
}