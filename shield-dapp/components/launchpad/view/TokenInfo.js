import TableData from "./TableData"

const HEADER="Token Information";

export default ()=>{
    const data = {}
    
    return <TableData header={HEADER} data={data}/>
}