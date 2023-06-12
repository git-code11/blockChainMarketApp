import { ChainId} from '@pancakeswap/sdk';

const {SmartRouter, BATCH_MULTICALL_CONFIGS} = require("@pancakeswap/smart-router/evm");

import { viemClients } from './_utils';

const _quoteProvider = {
    offChain:SmartRouter.createOffChainQuoteProvider,
    onChain:(onChainProvider)=>SmartRouter.createQuoteProvider({onChainProvider:onChainProvider??viemClients}),
    onChain2:(onChainProvider)=>SmartRouter.createQuoteProvider({
      onChainProvider: onChainProvider??viemClients,
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