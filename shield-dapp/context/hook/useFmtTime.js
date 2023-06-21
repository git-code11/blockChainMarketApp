import { useMemo } from "react";
import formatTime from "../lib/formatTime";

export default time=>
    useMemo(()=>{
        if(time && time > 0){
            const fmt = formatTime(time);
            return [fmt.days, fmt.hours, fmt.minutes, fmt.seconds].map(d=>d.toString().padStart(2,'0')).join(':');
        }
    },[time]);