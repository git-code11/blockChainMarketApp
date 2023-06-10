"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TradeCache = void 0;
var _web_worker = require("./_web_worker");
var _poolProvider2 = _interopRequireWildcard(require("./_poolProvider"));
var _cacheLib = require("./_cacheLib");
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = require("@pancakeswap/smart-router/evm"),
  SmartRouter = _require.SmartRouter;
var QUOTING_API = "https://swap-quoting.pancakeswap.com/quoting-service/v0/quote";
var __getBestTradeApi = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(amount, currency, tradeType, _ref) {
    var _maxHops, _maxSplits, _yield$gasPriceWei, _amount$currency;
    var maxHops, maxSplits, gasPriceWei, allowedPoolTypes, poolProvider, candidatePools, serverRes, serializedRes;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          maxHops = _ref.maxHops, maxSplits = _ref.maxSplits, gasPriceWei = _ref.gasPriceWei, allowedPoolTypes = _ref.allowedPoolTypes, poolProvider = _ref.poolProvider;
          maxHops = (_maxHops = maxHops) !== null && _maxHops !== void 0 ? _maxHops : 3;
          maxSplits = (_maxSplits = maxSplits) !== null && _maxSplits !== void 0 ? _maxSplits : 4;
          //allowedPoolTypes = allowedPoolTypes ?? getAllPoolTypes()
          _context.next = 5;
          return poolProvider.getCandidatePools(amount.currency, currency, {
            protocols: allowedPoolTypes
          });
        case 5:
          candidatePools = _context.sent;
          _context.t0 = _axios["default"];
          _context.t1 = "".concat(QUOTING_API);
          _context.t2 = currency.chainId;
          _context.t3 = SmartRouter.Transformer.serializeCurrency(currency);
          _context.t4 = tradeType;
          _context.t5 = {
            currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
            value: amount.quotient.toString()
          };
          if (!(typeof gasPriceWei !== 'function')) {
            _context.next = 16;
            break;
          }
          _context.t6 = gasPriceWei === null || gasPriceWei === void 0 ? void 0 : gasPriceWei.toString();
          _context.next = 28;
          break;
        case 16:
          _context.next = 18;
          return gasPriceWei === null || gasPriceWei === void 0 ? void 0 : gasPriceWei((_amount$currency = amount.currency) !== null && _amount$currency !== void 0 ? _amount$currency : currency);
        case 18:
          _context.t8 = _yield$gasPriceWei = _context.sent;
          _context.t7 = _context.t8 === null;
          if (_context.t7) {
            _context.next = 22;
            break;
          }
          _context.t7 = _yield$gasPriceWei === void 0;
        case 22:
          if (!_context.t7) {
            _context.next = 26;
            break;
          }
          _context.t9 = void 0;
          _context.next = 27;
          break;
        case 26:
          _context.t9 = _yield$gasPriceWei.toString();
        case 27:
          _context.t6 = _context.t9;
        case 28:
          _context.t10 = _context.t6;
          _context.t11 = maxHops;
          _context.t12 = maxSplits;
          _context.t13 = allowedPoolTypes;
          _context.t14 = candidatePools.map(SmartRouter.Transformer.serializePool);
          _context.t15 = {
            chainId: _context.t2,
            currency: _context.t3,
            tradeType: _context.t4,
            amount: _context.t5,
            gasPriceWei: _context.t10,
            maxHops: _context.t11,
            maxSplits: _context.t12,
            poolTypes: _context.t13,
            candidatePools: _context.t14
          };
          _context.t16 = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          _context.next = 37;
          return _context.t0.post.call(_context.t0, _context.t1, _context.t15, _context.t16);
        case 37:
          serverRes = _context.sent;
          _context.next = 40;
          return serverRes.data;
        case 40:
          serializedRes = _context.sent;
          return _context.abrupt("return", SmartRouter.Transformer.parseTrade(currency.chainId, serializedRes));
        case 42:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function __getBestTradeApi(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

//const cache1 = new CandidatePoolCache();
//cachedPool instance of CandidatePoolCache
//example: __getBestTradeCached(_getBestTrade.api, cache1);

var __getBestTradeCached = function __getBestTradeCached(_getBestTrade, _cachedPool) {
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(amount, currency, tradeType, config) {
      var _yield$config$blockNu, _config$blockNumber;
      var _gasPriceWei, cachedPool, candidatePools, poolProvider, result;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _gasPriceWei = config.gasPriceWei;
            config.gasPriceWei = typeof _gasPriceWei !== 'function' ? _gasPriceWei : function () {
              var _amount$currency2;
              return _gasPriceWei === null || _gasPriceWei === void 0 ? void 0 : _gasPriceWei((_amount$currency2 = amount.currency) !== null && _amount$currency2 !== void 0 ? _amount$currency2 : currency);
            };
            cachedPool = _cachedPool !== null && _cachedPool !== void 0 ? _cachedPool : _poolProvider2.globalCandidatePoolCache;
            _context2.t0 = cachedPool;
            _context2.t1 = config.poolProvider;
            _context2.t2 = amount.currency;
            _context2.t3 = currency;
            _context2.t4 = config.allowedPoolTypes;
            _context2.next = 10;
            return (_config$blockNumber = config.blockNumber) === null || _config$blockNumber === void 0 ? void 0 : _config$blockNumber.call(config);
          case 10:
            _context2.t6 = _yield$config$blockNu = _context2.sent;
            _context2.t5 = _context2.t6 !== null;
            if (!_context2.t5) {
              _context2.next = 14;
              break;
            }
            _context2.t5 = _yield$config$blockNu !== void 0;
          case 14:
            if (!_context2.t5) {
              _context2.next = 18;
              break;
            }
            _context2.t7 = _yield$config$blockNu;
            _context2.next = 19;
            break;
          case 18:
            _context2.t7 = config.blockNumber;
          case 19:
            _context2.t8 = _context2.t7;
            _context2.t9 = {
              poolProvider: _context2.t1,
              currencyIn: _context2.t2,
              currencyOut: _context2.t3,
              allowedPoolTypes: _context2.t4,
              blockNumber: _context2.t8
            };
            _context2.t10 = [_context2.t9];
            _context2.t11 = {
              forceUpdate: false,
              args: _context2.t10
            };
            _context2.next = 25;
            return _context2.t0.getPool.call(_context2.t0, _context2.t11);
          case 25:
            candidatePools = _context2.sent;
            poolProvider = _poolProvider2["default"]["static"](candidatePools); //console.log({config})
            _context2.next = 29;
            return _getBestTrade(amount, currency, tradeType, _objectSpread(_objectSpread({}, config), {}, {
              poolProvider: poolProvider
            }));
          case 29:
            result = _context2.sent;
            return _context2.abrupt("return", result);
          case 31:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x5, _x6, _x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }();
};
var __getBestTradeWorkerCached = function __getBestTradeWorkerCached(_cache, _worker) {
  return function () {
    return _getBestTrade.cached(_getBestTrade.worker(_worker), _cache).apply(void 0, arguments);
  };
};
var __getBestTradeApiCached = function __getBestTradeApiCached(_cache) {
  return _getBestTrade.cached(_getBestTrade.api, _cache);
};
var __getBestTradeMainCached = function __getBestTradeMainCached(_cache) {
  return _getBestTrade.cached(_getBestTrade.main, _cache);
};
var _getBestTrade = {
  main: SmartRouter.getBestTrade,
  api: __getBestTradeApi,
  worker: _web_worker.createWorkerGetBestTrade,
  //new Worker Should be created everytime
  cache: {
    worker: __getBestTradeWorkerCached,
    api: __getBestTradeApiCached,
    main: __getBestTradeMainCached
  },
  cached: __getBestTradeCached
};
var _tradeEncoder = function _tradeEncoder(trade) {
  var _trade$inputAmount$cu;
  return {
    trade: SmartRouter.Transformer.serializeTrade(trade),
    chainId: (_trade$inputAmount$cu = trade.inputAmount.currency.chainId) !== null && _trade$inputAmount$cu !== void 0 ? _trade$inputAmount$cu : trade.outputAmount.currency.chainId
  };
};
var _tradeDecoder = function _tradeDecoder(serial) {
  return SmartRouter.Transformer.parseTrade(serial.chainId, serial.trade);
};
var TradeCache = /*#__PURE__*/function (_BaseTradeCache2) {
  _inherits(TradeCache, _BaseTradeCache2);
  var _super = _createSuper(TradeCache);
  function TradeCache(getBestTradeFunc) {
    _classCallCheck(this, TradeCache);
    return _super.call(this, {
      run: getBestTradeFunc,
      encoder: _tradeEncoder,
      decoder: _tradeDecoder
    });
  }
  return _createClass(TradeCache);
}(_cacheLib._BaseTradeCache);
exports.TradeCache = TradeCache;
var _default = _getBestTrade;
/**
 * NOTE: 
 * const poolCache1 = new CandidatePoolCache();
 * const tradeCache1 = new TradeCache(_getBestTrade.cache.main(poolCache1))
 * _getBestTrade.cache.main(poolCache1) => pool = cached; trade = not cached
 * is the same as _getBestTrade.main => pool = not cached; trade = not cached
 * is the same as tradeCache1.getTrade => pool = cached; trade = cached
 */
exports["default"] = _default;