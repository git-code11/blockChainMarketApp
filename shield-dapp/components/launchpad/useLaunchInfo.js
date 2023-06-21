import { useMemo } from "react";
import { usePadInfoByAddress, parsePadInfoData } from "../../context/hook/app/factory/launch/padInfo";
import useCurrency from "../../context/hook/useCurrency";
import { useIpfsBlobData } from "../../context/hook/ipfs";

export default ({address})=>{
    const {data, isLoading} = usePadInfoByAddress({
        address
    });
    console.log({data})

    const {data:buyToken, isLoading:btkLoading} = useCurrency(data?.buyToken);

    const {data:launchToken, isLoading:itkLoading} = useCurrency(data?.launchToken);

    const {data:detail, isLoading:ipfsLoading} = useIpfsBlobData(data?.ihash);


    const parsedData = useMemo(()=>{
        let _data = {buySym:buyToken?.symbol, launchSym:launchToken?.symbol, name:launchToken?.name}
        if(data){
            _data = {..._data, ...parsePadInfoData(data, launchToken?.decimals)};
        }
        return _data;

    },[buyToken, launchToken, data]);

    const _loading = isLoading || btkLoading || itkLoading || ipfsLoading;

    return {parsedData, loading:_loading, detail, buyToken, launchToken}
}
