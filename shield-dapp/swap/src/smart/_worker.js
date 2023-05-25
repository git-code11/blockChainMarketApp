import { Worker } from 'node:worker_threads';
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import {getAllPoolTypes} from './_utils';


class WorkerProxy {
    id = 0
  
    constructor(worker) {
        this.worker = worker;
    }

    _addEventListener(eventName, _listener, once){
        if(this.worker.addEventListener)
            this.worker.addEventListener(eventName, _listener)
        else
            if(once)
                this.worker.once(eventName, _listener);
            else
                this.worker.on(eventName, _listener);
    }

    _removeEventListener(eventName, _listener, once){
        if(once)
            return;
        if(this.worker.removeEventListener)
            this.worker.removeEventListener(eventName, _listener)
        else
            this.worker.off(eventName, _listener);
    }
  
    async postMessage(message){
      if (!this.worker) {
        throw new Error('Worker not initialized')
      }

      const id = this.id++

      const promise = new Promise((resolve, reject) => {
        
        const handler = (e) => {
          const [eventId, data] = e.data ?? e;
          if (id === eventId) {
            this._removeEventListener('message', handler, true)
            if (data.success === false) {
              reject(data.error)
            } else {
              resolve(data.result)
            }
            this.worker.unref();
          }
        }

        this._addEventListener('message', handler, true)
      })
  
      this.worker.postMessage([id, message])
      return promise
    }
  
    async getBestTrade(params){
      return this.postMessage({
        cmd: 'getBestTrade',
        params,
      })
    }
}

export const createWorkerGetBestTrade = (quoteWorker) => {
    return async (amount, currency, tradeType, { maxHops, maxSplits, allowedPoolTypes, poolProvider, gasPriceWei }) => {
        
        maxHops = maxHops ?? 3,
        maxSplits = maxSplits ?? 4,
        allowedPoolTypes = allowedPoolTypes ?? getAllPoolTypes()
        
        const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency, {
        protocols: allowedPoolTypes,
        })
    
        const result = await quoteWorker.getBestTrade({
        chainId: currency.chainId,
        currency: SmartRouter.Transformer.serializeCurrency(currency),
        tradeType,
        amount: {
            currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
            value: amount.quotient.toString(),
        },
        gasPriceWei: typeof gasPriceWei !== 'function' ? gasPriceWei?.toString() : undefined,
        maxHops,
        maxSplits,
        poolTypes: allowedPoolTypes,
        candidatePools: candidatePools.map(SmartRouter.Transformer.serializePool),
        })
        return SmartRouter.Transformer.parseTrade(currency.chainId, result)
    }
}

export const getWorker = ()=> {
    return typeof Worker !== 'undefined'
    ? new WorkerProxy(new Worker('./q-worker.js'))
    : undefined
}