"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTrade = displayTrade;
exports.fromReadableAmount = fromReadableAmount;
exports.toReadableAmount = toReadableAmount;
var _ethers = require("ethers");
var READABLE_FORM_LEN = 24;
function fromReadableAmount(amount, decimals) {
  return _ethers.ethers.utils.parseUnits(amount.toString(), decimals);
}
function toReadableAmount(rawAmount, decimals) {
  return _ethers.ethers.utils.formatUnits(rawAmount, decimals).slice(0, READABLE_FORM_LEN);
}
function displayTrade(trade) {
  return "".concat(trade.inputAmount.toExact(), " ").concat(trade.inputAmount.currency.symbol, " for ").concat(trade.outputAmount.toExact(), " ").concat(trade.outputAmount.currency.symbol);
}