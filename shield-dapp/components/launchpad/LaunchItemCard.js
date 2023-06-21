import { useGetPadAddressById } from "../../context/hook/app/factory/launch/padInfo"
import ItemCard from "./view/ItemCard"
import useLaunchInfo from "./useLaunchInfo"


export default ({id:padId})=>{
    const {data:address, isLoading} = useGetPadAddressById({
        padId,
    });

    const {parsedData, loading, detail} = useLaunchInfo({address});
    
    const _loading = isLoading || loading;

    return (
        <ItemCard address={address} detail={detail} data={parsedData} loading={_loading}/>    
    )
}