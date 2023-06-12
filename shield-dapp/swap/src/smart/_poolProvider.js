

const {SmartRouter, PoolType, RouteType} = require("@pancakeswap/smart-router/evm");
import {viemClients} from './_utils';
import { _BaseCandidatePoolCache, _BasePoolCache } from './_cacheLib';


const _poolProvider = {
    onChain: (onChainProvider)=>SmartRouter.createPoolProvider({
      onChainProvider:onChainProvider??viemClients
    }),
    static:(candidatePools)=>SmartRouter.createStaticPoolProvider(candidatePools)
}

const getCandidatePools = (
    {poolProvider, currencyIn, currencyOut,   
    allowedPoolTypes, blockNumber})=>
        poolProvider?.getCandidatePools(currencyIn, currencyOut, {
            blockNumber,
            protocols: allowedPoolTypes,
    });

//const __TIME_FACTOR = 60 * 1000;

// export class CandidatePoolCache{
    
//     constructor(expiresDuration){
//         this._cache = {}
//         this._expireTime = {}
//         this._expiresDuration = expiresDuration ?? 4 //in minute
//        // this.name = Date.now();
//     }

//     getPool({poolProvider, forceUpdate, ...params}){//forceUpdate means cause refetch of candidate Pool info
//         const _key = this.getKey(params);
//         forceUpdate = forceUpdate || (this._expireTime[_key] <= Date.now());
//         if(!forceUpdate && this._cache[_key]){
//             return this._cache[_key];
//         }else{
//             console.log("UPDATING POOL")
//             return this.setPool(poolProvider, params);
//         }
//     }

//     async setPool(poolProvider, params){
//         const _key = this.getKey(params);
//         this._cache[_key] = await getCandidatePools({poolProvider, ...params});
//         this._expireTime[_key] = Date.now() + this._expiresDuration * __TIME_FACTOR;
//         return this._cache[_key];
//     }

//     getKey({currencyIn, currencyOut, blockNumber, allowedPoolTypes}){
//         const keys =  [
//             //this.name,
//             currencyIn.name ?? currencyIn.symbol,
//             currencyOut.name ?? currencyOut.symbol,
//             currencyIn.chainId ?? currencyOut.chainId ?? 0,
//             blockNumber ?? 0,
//             ...allowedPoolTypes.sort()
//         ]
//         return keys.join('_');
//     }
// }


export class CandidatePoolCache extends _BaseCandidatePoolCache{
    constructor(updateInterval){
        super(updateInterval, getCandidatePools);
    }
}

const _poolEncoder = _pool=>{
    let chainId;

    if(_pool.type === PoolType.V2){
        chainId = _pool.reserve0.chainId ?? _pool.reserve1.chainId
    }else if(_pool.type = PoolType.V3){
        chainId = _pool.balances[0].chainId
    }else if(_pool.type ){
        chainId = _pool.token0.chainId ?? _pool.token1.chainId
    }

    return (
        {
            pool: SmartRouter.Transformer.serializePool(_pool),
            chainId:chainId ?? 0
        }
    );
}
const _poolDecoder = serial=>SmartRouter.Transformer.parsePool(serial.chainId, serial.pool);

const _poolsEncoder = pools=>pools.map(_poolEncoder);

const _poolsDecoder = serials=>serials.map(_poolDecoder);

export class PoolCache extends _BasePoolCache{
    constructor(updateInterval){
      super({
        updateInterval,
        run:getCandidatePools,
        encoder:_poolsEncoder,
        decoder:_poolsDecoder
      });
    }
}

export const globalCandidatePoolCache = new CandidatePoolCache();

export {PoolType, RouteType};
export default _poolProvider;