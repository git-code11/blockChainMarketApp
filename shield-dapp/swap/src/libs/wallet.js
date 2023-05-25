// This file contains code to easily connect to and get information from a wallet on chain

import { BigNumber, ethers } from 'ethers'
import JSBI from 'jsbi'

import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  WETH_ABI
} from './constants'
import { getProvider, getWalletAddress, sendTransaction } from './providers'
import { toReadableAmount } from './utils'

export async function getCurrencyBalance(
  provider,
  address,
  currency
){
  // Handle ETH directly
  if (currency.isNative) {
    return ethers.utils.formatEther(await provider.getBalance(address))
  }

  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(
    currency.address,
    ERC20_ABI,
    provider
  )
  const balance = await ERC20Contract.balanceOf(address)
  const decimals = await ERC20Contract.decimals()

  // Format with proper units (approximate)
  return toReadableAmount(balance, decimals)
}

// wraps ETH (rounding up to the nearest ETH for decimal places)
export async function wrapETH(eth) {
  const provider = getProvider()
  const address = getWalletAddress()
  if (!provider || !address) {
    throw new Error('Cannot wrap ETH without a provider and wallet address')
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  )

  const transaction = {
    data: wethContract.interface.encodeFunctionData('deposit'),
    value: ethers.parseEther(eth.toString()),
    from: address,
    to: WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  await sendTransaction(transaction)
}

// unwraps ETH (rounding up to the nearest ETH for decimal places)
export async function unwrapETH(eth) {
  const provider = getProvider()
  const address = getWalletAddress()
  if (!provider || !address) {
    throw new Error('Cannot unwrap ETH without a provider and wallet address')
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  )

  const transaction = {
    data: wethContract.interface.encodeFunctionData('withdraw', [
        ethers.parseEther(eth.toString())
    ]),
    from: address,
    to: WETH_CONTRACT_ADDRESS,
    //maxFeePerGas: MAX_FEE_PER_GAS,
    //maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  await sendTransaction(transaction)
}