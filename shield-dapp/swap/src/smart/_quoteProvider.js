import { ChainId} from '@pancakeswap/sdk';
import { SmartRouter, BATCH_MULTICALL_CONFIGS } from '@pancakeswap/smart-router/evm';

import { viemClients } from './_utils';

const _quoteProvider = {
    offChain:SmartRouter.createOffChainQuoteProvider(),
    onChain:SmartRouter.createQuoteProvider({onChainProvider:viemClients}),
    onChain2:SmartRouter.createQuoteProvider({
      onChainProvider: viemClients,
      multicallConfigs: {
        ...BATCH_MULTICALL_CONFIGS,
        [ChainId.BSC]: {
          ...BATCH_MULTICALL_CONFIGS[ChainId.BSC],
          defaultConfig: {
            multicallChunk: 150,
            gasLimitOverride: 1_000_000,
          },
        },
      },
    }) 
}

export default _quoteProvider;