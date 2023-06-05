

/**
 * @cache follows 
 * { [key]:
 *         {
 *           value,
 *           expiresIn
 *         }
 * }
 */

export class AbstractCache{
    constructor({updateInterval, cache}){
        this.updateInterval = (updateInterval ?? 1) * 60 * 10000 //1 min
        //this.__cache = cache ?? {};
        this.reset(cache);
    }

    reset(cache){
        //reset the cache
        
        this.__cache = cache ?? {};
    }

    //to enable perfect caching of value
    encode(value){
        return value;
    }

    decode(value){
        return value;
    }

    getKey(...args){
        return JSON.stringify(args);
    }

    async runFunc(...args){
        throw Error("Method is abstract");
    }

    async _getValue(...args){
        const key = this.getKey(...args);
        let value = this._getCache(key);
        if(value === null){
            value = await this.runFunc(...args);
            this._updateCache(key, value);
        }
        return value;
    }

    _updateCache(key, value){
        
        value = this.encode(value);
        this.__cache[key] = {
            value,
            expiresIn:Date.now() + this.updateInterval
        }
    }

    _getCache(key){
        const cached = this.__cache[key];
        
        if(cached && cached.expiresIn >= Date.now()){
            
            return this.decode(cached.value);
        }
        
        return null;
    }

    _clearCache(...args){
        const key = this.getKey(...args);
        const cached = this.__cache[key];
        if(cached){
            cached.expiresIn = 0;
        }
    }
}

export class AbstractCacheExtended extends AbstractCache{
    constructor({updateInterval, encoder, decoder, run}){
        super({updateInterval: updateInterval ?? 4});
        this.encoder = encoder ?? (arg=>arg);
        this.decoder = decoder ?? (arg=>arg);
        this.run = run;
    }

    encode(value){
        return this.encoder(value, this);
    }

    decode(value){
        return this.decoder(value, this);
    }

    runFunc(...args){
        return this.run(...args);
    }
    //params should be array due to it been spread in the function
    _result(param, forceUpdate){
        if(forceUpdate){
            this._clearCache(...param);
        }
        return this._getValue(...param);
    }
}


export class _BaseCandidatePoolCache extends AbstractCacheExtended{

    constructor(updateInterval, getCandidatePools){
        super({
            updateInterval: updateInterval ?? 4,
            run:getCandidatePools
        });
    }

    getKey({currencyIn, currencyOut, blockNumber, allowedPoolTypes}){
        const keys =  [
            currencyIn.name ?? currencyIn.symbol,
            currencyOut.name ?? currencyOut.symbol,
            currencyIn.chainId ?? currencyOut.chainId ?? 0,
            blockNumber ?? 0,
            ...allowedPoolTypes.sort()
        ]
        const result  = keys.join('_');
        
        return result;
    }

    getPool({forceUpdate, args}){
        return this._result(args, forceUpdate)
    }
}


export class _BasePoolCache extends AbstractCacheExtended{
    constructor({updateInterval, encoder, decoder, run}){
        super({updateInterval, encoder, decoder, run});
    }

    getKey({currencyIn, currencyOut, blockNumber, allowedPoolTypes}){
        const keys =  [
            currencyIn.name ?? currencyIn.symbol,
            currencyOut.name ?? currencyOut.symbol,
            currencyIn.chainId ?? currencyOut.chainId ?? 0,
            blockNumber ?? 0,
            ...allowedPoolTypes.sort()
        ]
        
        const result  = keys.join('_');
        
        return result;
    }

    getPool({forceUpdate, args}){
        return this._result(args, forceUpdate)
    }
}


export class _BaseTradeCache extends AbstractCacheExtended{
    constructor({updateInterval, encoder, decoder, run}){
        super({updateInterval, encoder, decoder, run});
    }

    getKey(amount, currency, tradeType, {allowedPoolTypes}){
        const keys =  [
            amount.currency.symbol,
            amount.quotient.toString(),
            currency.symbol,
            tradeType,
            amount.currency.chainId ?? currency.chainId ?? 0,
            allowedPoolTypes?.sort()?.join('_')
            
        ]
        const result  = keys.join('_');
        
        return result;
    }

    getTrade({forceUpdate, args}){
        return this._result(args, forceUpdate)
    }
}