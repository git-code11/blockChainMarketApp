
import {SmartRouter} from '@pancakeswap/smart-router/evm';
import {viemClients} from './_utils';


const _poolProvider = {
    onChain: SmartRouter.createPoolProvider({
      onChainProvider:viemClients
    }),
    static:(candidatePools)=>SmartRouter.createStaticPoolProvider(candidatePools)
}

export const getCandidatePools = (
    {poolProvider, currencyIn, currencyOut,   
    allowedPoolTypes, blockNumber})=>
        poolProvider?.getCandidatePools(currencyIn, currencyOut, {
            blockNumber,
            protocols: allowedPoolTypes,
    });

const __TIME_FACTOR = 60 * 1000;

export class CandidatePoolCache{
    
    constructor(expiresDuration){
        this._cache = {}
        this._expireTime = {}
        this._expiresDuration = expiresDuration ?? 4 //in minute
       // this.name = Date.now();
    }

    getPool({poolProvider, forceUpdate, ...params}){//forceUpdate means cause refetch of candidate Pool info
        const _key = this.getKey(params);
        forceUpdate = forceUpdate || (this._expireTime[_key] <= Date.now());
        if(!forceUpdate && this._cache[_key]){
            return this._cache[_key];
        }else{
            console.log("UPDATING POOL")
            return this.setPool(poolProvider, params);
        }
    }

    async setPool(poolProvider, params){
        const _key = this.getKey(params);
        this._cache[_key] = await getCandidatePools({poolProvider, ...params});
        this._expireTime[_key] = Date.now() + this._expiresDuration * __TIME_FACTOR;
        return this._cache[_key];
    }

    getKey({currencyIn, currencyOut, blockNumber, allowedPoolTypes}){
        const keys =  [
            //this.name,
            currencyIn.name ?? currencyIn.symbol,
            currencyOut.name ?? currencyOut.symbol,
            currencyIn.chainId ?? currencyOut.chainId ?? 0,
            blockNumber ?? 0,
            ...allowedPoolTypes.sort()
        ]
        return keys.join('_');
    }
}

export const globalCandidatePoolCache = new CandidatePoolCache();

export default _poolProvider;