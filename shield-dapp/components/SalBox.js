import {useEffect} from "react";
import sal from 'sal.js';


const useSal = ()=>{
    useEffect(()=>{
        sal();
    },[]);
}

export default ({children, ...props})=><div {...props} style={{height:"100%"}} data-sal-duration="100" data-sal-delay="0" data-sal="slide-up">{children}</div>

export {useSal};