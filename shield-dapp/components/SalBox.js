import {useEffect} from "react";
import sal from 'sal.js';


const useSal = ()=>{
    useEffect(()=>{
        sal();
    },[]);
}

export default ({children})=><div style={{height:"100%"}} data-sal-duration="300" data-sal-delay="100" data-sal="slide-up">{children}</div>

export {useSal};