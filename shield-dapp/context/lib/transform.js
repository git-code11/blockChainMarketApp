
export const selectReads = data=>data?.map(d=>d?.result);

export const compose = (..._funcs)=>_data=>_funcs.reverse().reduce((result, _func)=>_func(result),_data);

export const indexMutate = (func, index)=>data=>{
    if(data && !isNaN(index)){
        const _data = Array.isArray(data)?[...data]:{...data}
        _data[index] = func(data[index]);
        return _data
    }
    return data;
}