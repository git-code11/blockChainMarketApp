"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TradeType", {
  enumerable: true,
  get: function get() {
    return _sdk.TradeType;
  }
});
exports.prepareTradeQuoteParams = exports.prepareTradeCallData = void 0;
var _sdk = require("@pancakeswap/sdk");
var _quoteProvider2 = _interopRequireDefault(require("./_quoteProvider"));
var _poolProvider2 = _interopRequireDefault(require("./_poolProvider"));
var _utils = require("./_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
//import { SwapRouter } from '@pancakeswap/smart-router/evm';
var _require = require("@pancakeswap/smart-router/evm"),
  SwapRouter = _require.SwapRouter;
var prepareTradeQuoteParamsConfig = {
  gasPriceWei: 10,
  poolProvider: _poolProvider2["default"].onChain,
  quoteProvider: _quoteProvider2["default"].onChain,
  allowedPoolTypes: (0, _utils.getAllPoolTypes)()
};
var prepareTradeQuoteParams = function prepareTradeQuoteParams(_ref) {
  var amountIn = _ref.amountIn,
    currencyIn = _ref.currencyIn,
    currencyOut = _ref.currencyOut,
    tradeType = _ref.tradeType,
    config = _ref.config;
  //console.log({amountIn, currencyIn, currencyOut, tradeType, config})

  var _config = _objectSpread(_objectSpread({}, prepareTradeQuoteParamsConfig), config);
  var params = [_sdk.CurrencyAmount.fromRawAmount(currencyIn, (0, _utils.fromVReadableAmount)(amountIn, currencyIn.decimals)), currencyOut, tradeType !== null && tradeType !== void 0 ? tradeType : _sdk.TradeType.EXACT_INPUT, _config];
  return params;
};
exports.prepareTradeQuoteParams = prepareTradeQuoteParams;
var prepareTradeCallData = function prepareTradeCallData(_ref2) {
  var _options$toleranceBip;
  var trade = _ref2.trade,
    _chainId = _ref2.chainId,
    options = _ref2.options;
  var _options = {};
  _options.slippageTolerance = new _sdk.Percent(Number((_options$toleranceBip = options.toleranceBips) !== null && _options$toleranceBip !== void 0 ? _options$toleranceBip : 1), 10000); //1bips
  _options.deadlineOrPreviousBlockhash = Math.round(Date.now() / 1000) + (Number(options.deadline) || 60 * 60); //1hr
  _options.recipient = options.recipient;
  if (options.admin) {
    var _options$feeBips;
    _options.fee = {
      recipient: options.admin,
      fee: new _sdk.Percent((_options$feeBips = options.feeBips) !== null && _options$feeBips !== void 0 ? _options$feeBips : 1, 10000) //1bips
    };
  }

  var chainId = _chainId || trade.inputAmount.currency.chainId || trade.outputAmount.currency.chainId;
  var callParams = SwapRouter.swapCallParameters(trade, _options);
  var swapRouterAddress = (0, _utils.getSwapRouterAddr)(chainId);
  return {
    address: swapRouterAddress,
    param: callParams,
    //to support other calltypes
    data: callParams.calldata,
    value: callParams.value,
    to: swapRouterAddress,
    chainId: chainId
  };
};
exports.prepareTradeCallData = prepareTradeCallData;