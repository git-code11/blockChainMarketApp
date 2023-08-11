import {
    fetchRiskToken
} from "../../../swap/src/smart";

import useSWRImmutable from 'swr/immutable';

const fetcher = async ([addr, chainId])=> Boolean(addr && chainId) ? await fetchRiskToken(addr, chainId):null

export default (token)=>{
    return useSWRImmutable([token?.address, token?.chainId], fetcher)
}