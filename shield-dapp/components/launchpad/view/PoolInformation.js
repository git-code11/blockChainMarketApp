import { useMemo } from "react";
import TableData from './TableData'

export default ({
    data
})=>{
    const _data = useMemo(()=>(data ? {
        "Capped":`${data.capped}${data.buySym}`,
        "Minimum Buy":`${data.minBuy}${data.buySym}`,
        "Maximum Buy":`${data.maxBuy}${data.buySym}`,
        "Total Participant":Number(data.totalParticipant),
        "Dex Percentage":data.dexBps,
        "Dex Lock Period":data.lpLockPeriod,
        "Start Date":new Date(data.startTime*1000).toISOString(),
        "End Date":new Date(data.endTime*1000).toISOString(),
    }:{}),[data]);
    
    return (
        <TableData header="Pool Information" data={_data}/>
    )
}
