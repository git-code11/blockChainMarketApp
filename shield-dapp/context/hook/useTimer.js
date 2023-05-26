import useSetTimeout from "./useSetTimeout";

const _func = (cb, exit, start, gap)=>{
    const _current = BigInt(Math.round(Date.now()/1000));
    const _start = start ?? 0n;
    const _gap = gap ?? 0n;
    const _end = _start + _gap;
    
    if(_current < start){
        cb(_gap);
    }
    else if(_current >= _end){
        cb(0);
        exit();
    }else{
        const _next = _end - _current;
        cb(_next);
    }
}

export default (start, gap, interval)=>{
    const [state] = useSetTimeout(_func, interval, !Boolean(gap), start, gap);
    return state;
}