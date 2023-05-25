import { ethers } from 'ethers'

const READABLE_FORM_LEN = 24

export function fromReadableAmount(
  amount,
  decimals
) {
  return ethers.utils.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount, decimals) {
  return ethers.utils
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN)
}

export function displayTrade(trade){
  return `${trade.inputAmount.toExact()} ${
    trade.inputAmount.currency.symbol
  } for ${trade.outputAmount.toExact()} ${trade.outputAmount.currency.symbol}`
}