import { useSelector} from "react-redux"

export default ()=>{
    const data = useSelector(state=>state.swap.modal.context);

    return {i:data===1,o:data===2, io:data===0}
}