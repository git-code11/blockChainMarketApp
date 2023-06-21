import TableData from "./TableData"

const HEADER="Launch Information";

export default ()=>{
    const data = {}
    
    return <TableData header={HEADER} data={data}/>
}