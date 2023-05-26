
export default (_s)=>{
    _s = Number(_s);
    const seconds = _s % 60;
    const minutes = Math.floor(_s/60)%60;
    const hours = Math.floor(_s/3600)%24;
    const days = Math.floor(_s/86400);
    return {days, minutes, hours, seconds}
}