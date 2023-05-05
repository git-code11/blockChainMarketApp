
import {useMemo} from 'react';
import useTimer from '../context/hook/useTimer';
import formatTime from '../context/lib/formatTime';

export default ({start, gap})=>{
    const state = useTimer(start, gap, 500);
    const time = useMemo(()=>formatTime(state||gap),[state, gap])
 
     return (
         gap?
         <div data-timebox style={{display:"flex", gap:"5px"}}>
             <span data-timebox-days>{time.days.toString().padStart(2,"0")}d</span>
             <span data-timebox-hours>{time.hours.toString().padStart(2,"0")}h</span>
             <span data-timebox-minutes>{time.minutes.toString().padStart(2,"0")}m</span>
             <span data-timebox-seconds>{time.seconds.toString().padStart(2,"0")}s</span>
         </div>:
         <div>...</div>
     )
 }