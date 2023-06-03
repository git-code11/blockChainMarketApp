import {useState, useCallback, useMemo} from 'react';


const PREFIX = "promiseReqID"

export const useCallStackId = ()=>{
    const session = useMemo(()=>{
        let reqId = 0;
        
        function update(){
            reqId = PREFIX + Date.now() + Math.round(Math.random()*53332);
            return reqId;
        }
        function verify(value){
            return value === reqId;
        }

        return {update, verify}
    },[]);

    return session;
}

export default (_func, wait=true)=>{
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const session = useCallStackId();
    

    const reset = useCallback((wait=true)=>{
        if(loading && wait)
            return;
        if(error)
            setError(null);
        if(value)
            setValue(null);
    },[loading, error, value]);

    const call = useCallback(async (...args)=>{
        if(loading && wait)
            return;

        reset(wait);
        
        if(!loading)
            setLoading(true);
        
        let _value = null;
        const reqId = session.update();

        let verified;

        try{
            _value = await _func(...args);
            verified = session.verify(reqId);
            if(verified){
                setValue(_value);
            }else{
                console.log("Failed due to invalid Id", _value);
            }
        }catch(e){
            verified = session.verify(reqId);
            if(verified){
                setError(e);
            }
        }

        if(verified){
            setLoading(false);
        }
        
        return [_value, verified];
    },[loading, _func, reset, wait, session]);

    
    return {value, loading, error, call, reset}
}