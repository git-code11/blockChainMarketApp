
export default (_s)=>{
    const seconds = _s % 60;
    const minutes = Math.floor(_s/60)%60;
    const hours = Math.floor(_s/3600)%23;
    const days = Math.floor(_s/86400);
    return {days, minutes, hours, seconds}
}