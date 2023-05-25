import {SmartRouter } from '@pancakeswap/smart-router/evm';
import { getWorker, createWorkerGetBestTrade } from './_worker';
import _poolProvider, { CandidatePoolCache, globalCandidatePoolCache } from './_poolProvider';

const QUOTING_API = "https://swap-quoting.pancakeswap.com/quoting-service/v0/quote";
const __getBestTradeApi = async (
  amount,
  currency,
  tradeType,
  { maxHops, maxSplits, gasPriceWei, allowedPoolTypes, poolProvider },
) => {
  maxHops = maxHops ?? 3;
  maxSplits = maxSplits ?? 4;
  //allowedPoolTypes = allowedPoolTypes ?? getAllPoolTypes()

  const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency, {
    protocols: allowedPoolTypes,
  })

  const serverRes = await fetch(`${QUOTING_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chainId: currency.chainId,
      currency: SmartRouter.Transformer.serializeCurrency(currency),
      tradeType,
      amount: {
        currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
        value: amount.quotient.toString(),
      },
      gasPriceWei: (typeof gasPriceWei !== 'function') ? gasPriceWei?.toString() : (await gasPriceWei?.()),
      maxHops,
      maxSplits,
      poolTypes: allowedPoolTypes,
      candidatePools: candidatePools.map(SmartRouter.Transformer.serializePool),
    }),
  })
  const serializedRes = await serverRes.json()
  return SmartRouter.Transformer.parseTrade(currency.chainId, serializedRes)
}

//const cache1 = new CandidatePoolCache();
//cachedPool instance of CandidatePoolCache
//example: __getBestTradeCached(_getBestTrade.api, cache1);

const __getBestTradeCached = (_getBestTrade, _cachedPool) => 
    async (amount, currency, tradeType, config) => {
    const cachedPool = _cachedPool ?? globalCandidatePoolCache;
    const candidatePools = await cachedPool.getPool({
        poolProvider:config.poolProvider,
        currencyIn:amount.currency,
        currencyOut:currency,   
        allowedPoolTypes:config.allowedPoolTypes,
        blockNumber:(await config.blockNumber?.()) ?? config.blockNumber
    });
    //console.log("incache")
    const poolProvider = _poolProvider.static(candidatePools);

    const result = await _getBestTrade(amount, currency, tradeType, {...config, poolProvider});
    return result;
}

const __getBestTradeWorkerCached = (_cache)=>(...args)=>_getBestTrade.cached(_getBestTrade.worker(), _cache)(...args);

const __getBestTradeApiCached = (_cache)=>_getBestTrade.cached(_getBestTrade.api, _cache);

const __getBestTradeMainCached = (_cache)=>_getBestTrade.cached(_getBestTrade.main, _cache)

const _getBestTrade = {
    main:SmartRouter.getBestTrade,
    api:__getBestTradeApi,
    worker: worker=>createWorkerGetBestTrade(worker?worker:getWorker()),//new Worker Should be created everytime
    cached:__getBestTradeCached,
    cachedWorker:__getBestTradeWorkerCached,
    cachedApi:__getBestTradeApiCached,
    cachedMain: __getBestTradeMainCached
}

export default _getBestTrade;

// interface TradeConfig {
//   gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
//   blockNumber?: number | (() => Promise<number>)
//   poolProvider: PoolProvider
//   quoteProvider: QuoteProvider
//   maxHops?: number
//   maxSplits?: number
//   distributionPercent?: number
//   allowedPoolTypes?: PoolType[]
//   quoterOptimization?: boolean
// }

// export async function getBestTrade(
//   amount: CurrencyAmount<Currency>,
//   currency: Currency,
//   tradeType: TradeType,
//   config: TradeConfig,