"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transformer = exports.MAP_ID_CHAIN = exports.CHAIN_NAME = void 0;
exports.amountFixed = amountFixed;
exports.fromReadableAmount = fromReadableAmount;
exports.fromVReadableAmount = fromVReadableAmount;
exports.timeit = exports.minimumAmountOut = exports.maximumAmountIn = exports.getTxExplorer = exports.getSwapRouterAddr = exports.getPoolTypes = exports.getExecutionPrice = exports.getAllPoolTypes = exports.gasPriceWei = void 0;
exports.toReadableAmount = toReadableAmount;
exports.toVReadableAmount = toVReadableAmount;
exports.viemClients = void 0;
var _sdk = require("@pancakeswap/sdk");
var _viem = require("viem");
var _utils = require("ethers/lib/utils.js");
var _rpc = require("./_rpc");
var _CHAIN_NAME;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
//import {PoolType, SWAP_ROUTER_ADDRESSES} from '@pancakeswap/smart-router/evm';
var _require = require("@pancakeswap/smart-router/evm"),
  PoolType = _require.PoolType,
  SWAP_ROUTER_ADDRESSES = _require.SWAP_ROUTER_ADDRESSES,
  SmartRouter = _require.SmartRouter;
//import { GraphQLClient } from 'graphql-request'

// const V3_SUBGRAPH_URLS = {
//     [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
//     [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
//     [ChainId.BSC]: `https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc`,
//     [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
// }
var MAP_ID_CHAIN = _rpc.CHAINS.reduce(function (_map, _chain) {
  return _objectSpread(_objectSpread({}, _map), {}, _defineProperty({}, _chain.id, _chain));
}, {});
exports.MAP_ID_CHAIN = MAP_ID_CHAIN;
var CHAIN_NAME = (_CHAIN_NAME = {}, _defineProperty(_CHAIN_NAME, _sdk.ChainId.BSC_TESTNET, "BScTestnet"), _defineProperty(_CHAIN_NAME, _sdk.ChainId.BSC, "BSC"), _defineProperty(_CHAIN_NAME, _sdk.ChainId.GOERLI, "Goerli"), _defineProperty(_CHAIN_NAME, _sdk.ChainId.ETHEREUM, "Ethereum"), _CHAIN_NAME);
exports.CHAIN_NAME = CHAIN_NAME;
var viemClients = function viemClients(_ref) {
  var chainId = _ref.chainId;
  return (0, _viem.createPublicClient)({
    chain: MAP_ID_CHAIN[chainId],
    transport: (0, _viem.fallback)(_rpc.PUBLIC_RPC_URL[chainId].map(function (_url) {
      return (0, _viem.http)(_url, {
        timeout: 15000
      });
    }), {
      rank: false
    }),
    batch: {
      multicall: {
        batchSize: 1024 * 200
      }
    }
  });
};

// export const v3Clients = {
//     [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
//     [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
//     [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC]),
//     [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET]),
// }
exports.viemClients = viemClients;
var gasPriceWei = function gasPriceWei(_ref2) {
  var chainId = _ref2.chainId;
  return viemClients({
    chainId: chainId !== null && chainId !== void 0 ? chainId : _sdk.ChainId.BSC
  }).getGasPrice();
};
exports.gasPriceWei = gasPriceWei;
var getPoolTypes = function getPoolTypes(_ref3) {
  var V2 = _ref3.V2,
    V3 = _ref3.V3,
    STABLE = _ref3.STABLE;
  var types = [];
  if (V2) {
    types.push(PoolType.V2);
  }
  if (V3) {
    types.push(PoolType.V3);
  }
  if (STABLE) {
    types.push(PoolType.STABLE);
  }
  return types;
};
exports.getPoolTypes = getPoolTypes;
var getAllPoolTypes = function getAllPoolTypes() {
  return getPoolTypes({
    V2: true,
    V3: true,
    STABLE: true
  });
};
exports.getAllPoolTypes = getAllPoolTypes;
var getSwapRouterAddr = function getSwapRouterAddr(chainId) {
  return SWAP_ROUTER_ADDRESSES[chainId];
};
exports.getSwapRouterAddr = getSwapRouterAddr;
var timeit = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref4) {
    var _func$constructor;
    var func, name, args, startTime;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          func = _ref4.func, name = _ref4.name, args = _ref4.args;
          console.log("CALLING FUNC", name !== null && name !== void 0 ? name : func === null || func === void 0 ? void 0 : (_func$constructor = func.constructor) === null || _func$constructor === void 0 ? void 0 : _func$constructor.name);
          startTime = Date.now();
          _context.prev = 3;
          _context.next = 6;
          return func(args);
        case 6:
          _context.next = 12;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          console.log("Error Occured");
        case 12:
          return _context.abrupt("return", Date.now() - startTime);
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 8]]);
  }));
  return function timeit(_x) {
    return _ref5.apply(this, arguments);
  };
}();
exports.timeit = timeit;
function fromReadableAmount(amount, decimals) {
  return (0, _utils.parseUnits)(amount.toString(), decimals !== null && decimals !== void 0 ? decimals : 18);
}
function fromVReadableAmount(amount, decimals) {
  return (0, _viem.parseUnits)(amount.toString(), decimals !== null && decimals !== void 0 ? decimals : 18);
}
var READABLE_FORM_LEN = 24;
function toReadableAmount(rawAmount, decimals) {
  return (0, _utils.formatUnits)(rawAmount, decimals !== null && decimals !== void 0 ? decimals : 18);
}
function toVReadableAmount(rawAmount, decimals) {
  return (0, _viem.formatUnits)(rawAmount, decimals !== null && decimals !== void 0 ? decimals : 18);
}
function amountFixed(amount) {
  var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  try {
    return Number(amount.toFixed(fixed));
  } catch (_unused) {}
  return Number(Number(toVReadableAmount(amount.quotient, amount.currency.decimals)).toFixed(fixed));
}
var getTxExplorer = function getTxExplorer(tx, chainId) {
  var _MAP_ID_CHAIN, _MAP_ID_CHAIN$blockEx;
  var explorer = (_MAP_ID_CHAIN = MAP_ID_CHAIN[chainId !== null && chainId !== void 0 ? chainId : tx.chainId]) === null || _MAP_ID_CHAIN === void 0 ? void 0 : (_MAP_ID_CHAIN$blockEx = _MAP_ID_CHAIN.blockExplorers) === null || _MAP_ID_CHAIN$blockEx === void 0 ? void 0 : _MAP_ID_CHAIN$blockEx["default"];
  var hash = tx === null || tx === void 0 ? void 0 : tx.transactionHash;
  if (!(explorer && hash)) return null;
  return {
    name: explorer.name,
    url: new URL("/tx/".concat(hash), explorer.url).href
  };
};
exports.getTxExplorer = getTxExplorer;
var Transformer = SmartRouter.Transformer,
  getExecutionPrice = SmartRouter.getExecutionPrice,
  minimumAmountOut = SmartRouter.minimumAmountOut,
  maximumAmountIn = SmartRouter.maximumAmountIn;
exports.maximumAmountIn = maximumAmountIn;
exports.minimumAmountOut = minimumAmountOut;
exports.getExecutionPrice = getExecutionPrice;
exports.Transformer = Transformer;