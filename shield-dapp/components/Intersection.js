import {useState, useEffect, useRef, useCallback} from 'react';



/* const useIntersectionObserver = (_cb, options, _val)=>{
    const [isIntersecting, setIntersecting] = useState();
    const containerRef = useRef();

    const cb = (args)=>{
        _cb?.(args);
        //console.log(args);
    }

    useEffect(()=>{
        const observer = new IntersectionObserver(cb, {...options});
        observer.observe(containerRef.current);
        return ()=>observer.unobserve(containerRef.current);
    },[options, containerRef, _val]);

    return {isIntersecting, containerRef}
} */


const useIntersectionObserver = (_cb, options)=>{
    const [called, setCalled] = useState();
    const containerRef = useRef();

    const cb = useCallback((e)=>{
        // if(called)
        //     return
        const bound = containerRef.current?.getBoundingClientRect();
        const value = bound.top + bound.height * options.threshold;
        
        if(bound){
            console.log('scroll Value', value);
            if(value >= window.innerHeight && value < window.innerHeight + 50){
                console.log('callback Calling here')
                _cb();
            }
        }
        //setTimeout(()=>setCalled(false), 1500);
    },[containerRef, called]);
    
    useEffect(()=>{
        window.addEventListener('scroll', cb, false);
        return ()=>window.removeEventListener('scroll', cb, false);
    },[cb]);

    return {containerRef}
}

export {useIntersectionObserver};