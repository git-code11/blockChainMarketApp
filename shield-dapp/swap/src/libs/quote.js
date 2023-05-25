import { ethers } from 'ethers'
import { CurrentConfig } from '../config'
import { computePoolAddress } from '@pancakeswap/v3-sdk'
import QuoterV2 from '@pancakeswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json'
import IPancakeV3Pool from '@pancakeswap/v3-core/artifacts/contracts/interfaces/IPancakeV3Pool.sol/IPancakeV3Pool.json'
import {
  POOL_DEPLOYER_CONTRACT_ADDRESS,
  QUOTER_V2_CONTRACT_ADDRESS,
} from '../constants'
import { getProvider } from './providers'
import { toReadableAmount, fromReadableAmount } from './conversion'

export async function quote() {
  const quoterContract = new ethers.Contract(
    QUOTER_V2_CONTRACT_ADDRESS,
    QuoterV2.abi,
    getProvider()
  )
  const poolConstants = await getPoolConstants();
  
  const params = {
    tokenIn:poolConstants.token0,
    tokenOut:poolConstants.token1,
    amountIn:fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString(),
    fee:poolConstants.fee,
    sqrtPriceLimitX96:0//poolConstants.sqrtPriceLimitX96
  };
  

  //const listParams = Object.values(params);

  /**1 Ways to call function (from call ethers.Provider.call using [data params])*/
 
 /*  const quoterV2Interface = new ethers.utils.Interface(QuoterV2.abi);
  const quoterV2_Calldata = quoterV2Interface.encodeFunctionData('quoteExactInputSingle', [params]);
  
  
  const rawResult = await getProvider().call({to: QUOTER_V2_CONTRACT_ADDRESS, data:quoterV2_Calldata});

  const parseResult = quoterV2Interface.decodeFunctionResult("quoteExactInputSingle", rawResult);
  console.log({parseResult});
  */ 
  /**2nd Way to call function (from ethers.Contract.callStatic) */
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(params);//pass in list ot object
  return toReadableAmount(quotedAmountOut.amountOut, CurrentConfig.tokens.out.decimals)
}

export async function getPoolConstants() {

  const currentPoolAddress = computePoolAddress({
    deployerAddress: POOL_DEPLOYER_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });
  
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IPancakeV3Pool.abi,
    getProvider()
  )
  const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceLimitX96: slot0[0],
    tick: slot0[1],
  }
}