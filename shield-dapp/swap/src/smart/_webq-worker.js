/**
 * NOTE: THIS is NOW in the src folder for public display
 */

import { SmartRouter } from '@pancakeswap/smart-router/evm'
import _quoteProvider from './_quoteProvider'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

// export type WorkerEvent = [
//   id: number,
//   message: {
//     cmd: 'getBestTrade'
//     params: SmartRouter.APISchema.RouterPostParams
//   },
// ]

const onChainQuoteProvider = _quoteProvider.onChain;

addEventListener('message', (event) => {
  const data = event?.data ?? event;
  const [id, message] = data
  if (message.cmd === 'getBestTrade') {
    
    const parsed = SmartRouter.APISchema.zRouterPostParams.safeParse(message.params)
    
    if (parsed.success === false) {
        postMessage([
        id,
        {
          success: false,
          error: parsed.error.message,
        },
      ])
      return
    }

    const {
      amount,
      chainId,
      currency,
      tradeType,
      blockNumber,
      gasPriceWei,
      maxHops,
      maxSplits,
      poolTypes,
      candidatePools,
    } = parsed.data
    
    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    
    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt(await (await viemClients({ chainId }).getGasPrice()).toString())

    SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
      quoteProvider: onChainQuoteProvider,
      maxHops,
      maxSplits,
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      allowedPoolTypes: poolTypes,
      quoterOptimization: false,
    })
      .then((res) => {
        postMessage([
          id,
          {
            success: true,
            result: serializeTrade(res),
          },
        ])
      })
      .catch((err) => {
        postMessage([
          id,
          {
            success: false,
            error: err.message,
          },
        ])
      })
  }
})