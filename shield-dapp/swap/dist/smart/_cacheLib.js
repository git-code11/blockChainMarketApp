"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._BaseTradeCache = exports._BasePoolCache = exports._BaseCandidatePoolCache = exports.AbstractCacheExtended = exports.AbstractCache = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * @cache follows 
 * { [key]:
 *         {
 *           value,
 *           expiresIn
 *         }
 * }
 */
var AbstractCache = /*#__PURE__*/function () {
  function AbstractCache(_ref) {
    var updateInterval = _ref.updateInterval,
      cache = _ref.cache;
    _classCallCheck(this, AbstractCache);
    this.updateInterval = (updateInterval !== null && updateInterval !== void 0 ? updateInterval : 1) * 60 * 10000; //1 min
    //this.__cache = cache ?? {};
    this.reset(cache);
  }
  _createClass(AbstractCache, [{
    key: "reset",
    value: function reset(cache) {
      //reset the cache

      this.__cache = cache !== null && cache !== void 0 ? cache : {};
    }

    //to enable perfect caching of value
  }, {
    key: "encode",
    value: function encode(value) {
      return value;
    }
  }, {
    key: "decode",
    value: function decode(value) {
      return value;
    }
  }, {
    key: "getKey",
    value: function getKey() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return JSON.stringify(args);
    }
  }, {
    key: "runFunc",
    value: function () {
      var _runFunc = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              throw Error("Method is abstract");
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function runFunc() {
        return _runFunc.apply(this, arguments);
      }
      return runFunc;
    }()
  }, {
    key: "_getValue",
    value: function () {
      var _getValue2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var key,
          value,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              key = this.getKey.apply(this, _args2);
              value = this._getCache(key);
              if (!(value === null)) {
                _context2.next = 7;
                break;
              }
              _context2.next = 5;
              return this.runFunc.apply(this, _args2);
            case 5:
              value = _context2.sent;
              this._updateCache(key, value);
            case 7:
              return _context2.abrupt("return", value);
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _getValue() {
        return _getValue2.apply(this, arguments);
      }
      return _getValue;
    }()
  }, {
    key: "_updateCache",
    value: function _updateCache(key, value) {
      value = this.encode(value);
      this.__cache[key] = {
        value: value,
        expiresIn: Date.now() + this.updateInterval
      };
    }
  }, {
    key: "_getCache",
    value: function _getCache(key) {
      var cached = this.__cache[key];
      if (cached && cached.expiresIn >= Date.now()) {
        return this.decode(cached.value);
      }
      return null;
    }
  }, {
    key: "_clearCache",
    value: function _clearCache() {
      var key = this.getKey.apply(this, arguments);
      var cached = this.__cache[key];
      if (cached) {
        cached.expiresIn = 0;
      }
    }
  }]);
  return AbstractCache;
}();
exports.AbstractCache = AbstractCache;
var AbstractCacheExtended = /*#__PURE__*/function (_AbstractCache) {
  _inherits(AbstractCacheExtended, _AbstractCache);
  var _super = _createSuper(AbstractCacheExtended);
  function AbstractCacheExtended(_ref2) {
    var _this;
    var updateInterval = _ref2.updateInterval,
      encoder = _ref2.encoder,
      decoder = _ref2.decoder,
      run = _ref2.run;
    _classCallCheck(this, AbstractCacheExtended);
    _this = _super.call(this, {
      updateInterval: updateInterval !== null && updateInterval !== void 0 ? updateInterval : 4
    });
    _this.encoder = encoder !== null && encoder !== void 0 ? encoder : function (arg) {
      return arg;
    };
    _this.decoder = decoder !== null && decoder !== void 0 ? decoder : function (arg) {
      return arg;
    };
    _this.run = run;
    return _this;
  }
  _createClass(AbstractCacheExtended, [{
    key: "encode",
    value: function encode(value) {
      return this.encoder(value, this);
    }
  }, {
    key: "decode",
    value: function decode(value) {
      return this.decoder(value, this);
    }
  }, {
    key: "runFunc",
    value: function runFunc() {
      return this.run.apply(this, arguments);
    }
    //params should be array due to it been spread in the function
  }, {
    key: "_result",
    value: function _result(param, forceUpdate) {
      if (forceUpdate) {
        this._clearCache.apply(this, _toConsumableArray(param));
      }
      return this._getValue.apply(this, _toConsumableArray(param));
    }
  }]);
  return AbstractCacheExtended;
}(AbstractCache);
exports.AbstractCacheExtended = AbstractCacheExtended;
var _BaseCandidatePoolCache = /*#__PURE__*/function (_AbstractCacheExtende) {
  _inherits(_BaseCandidatePoolCache, _AbstractCacheExtende);
  var _super2 = _createSuper(_BaseCandidatePoolCache);
  function _BaseCandidatePoolCache(updateInterval, getCandidatePools) {
    _classCallCheck(this, _BaseCandidatePoolCache);
    return _super2.call(this, {
      updateInterval: updateInterval !== null && updateInterval !== void 0 ? updateInterval : 4,
      run: getCandidatePools
    });
  }
  _createClass(_BaseCandidatePoolCache, [{
    key: "getKey",
    value: function getKey(_ref3) {
      var _currencyIn$name, _currencyOut$name, _ref4, _currencyIn$chainId;
      var currencyIn = _ref3.currencyIn,
        currencyOut = _ref3.currencyOut,
        blockNumber = _ref3.blockNumber,
        allowedPoolTypes = _ref3.allowedPoolTypes;
      var keys = [(_currencyIn$name = currencyIn.name) !== null && _currencyIn$name !== void 0 ? _currencyIn$name : currencyIn.symbol, (_currencyOut$name = currencyOut.name) !== null && _currencyOut$name !== void 0 ? _currencyOut$name : currencyOut.symbol, (_ref4 = (_currencyIn$chainId = currencyIn.chainId) !== null && _currencyIn$chainId !== void 0 ? _currencyIn$chainId : currencyOut.chainId) !== null && _ref4 !== void 0 ? _ref4 : 0, blockNumber !== null && blockNumber !== void 0 ? blockNumber : 0].concat(_toConsumableArray(allowedPoolTypes.sort()));
      var result = keys.join('_');
      return result;
    }
  }, {
    key: "getPool",
    value: function getPool(_ref5) {
      var forceUpdate = _ref5.forceUpdate,
        args = _ref5.args;
      return this._result(args, forceUpdate);
    }
  }]);
  return _BaseCandidatePoolCache;
}(AbstractCacheExtended);
exports._BaseCandidatePoolCache = _BaseCandidatePoolCache;
var _BasePoolCache = /*#__PURE__*/function (_AbstractCacheExtende2) {
  _inherits(_BasePoolCache, _AbstractCacheExtende2);
  var _super3 = _createSuper(_BasePoolCache);
  function _BasePoolCache(_ref6) {
    var updateInterval = _ref6.updateInterval,
      encoder = _ref6.encoder,
      decoder = _ref6.decoder,
      run = _ref6.run;
    _classCallCheck(this, _BasePoolCache);
    return _super3.call(this, {
      updateInterval: updateInterval,
      encoder: encoder,
      decoder: decoder,
      run: run
    });
  }
  _createClass(_BasePoolCache, [{
    key: "getKey",
    value: function getKey(_ref7) {
      var _currencyIn$name2, _currencyOut$name2, _ref8, _currencyIn$chainId2;
      var currencyIn = _ref7.currencyIn,
        currencyOut = _ref7.currencyOut,
        blockNumber = _ref7.blockNumber,
        allowedPoolTypes = _ref7.allowedPoolTypes;
      var keys = [(_currencyIn$name2 = currencyIn.name) !== null && _currencyIn$name2 !== void 0 ? _currencyIn$name2 : currencyIn.symbol, (_currencyOut$name2 = currencyOut.name) !== null && _currencyOut$name2 !== void 0 ? _currencyOut$name2 : currencyOut.symbol, (_ref8 = (_currencyIn$chainId2 = currencyIn.chainId) !== null && _currencyIn$chainId2 !== void 0 ? _currencyIn$chainId2 : currencyOut.chainId) !== null && _ref8 !== void 0 ? _ref8 : 0, blockNumber !== null && blockNumber !== void 0 ? blockNumber : 0].concat(_toConsumableArray(allowedPoolTypes.sort()));
      var result = keys.join('_');
      return result;
    }
  }, {
    key: "getPool",
    value: function getPool(_ref9) {
      var forceUpdate = _ref9.forceUpdate,
        args = _ref9.args;
      return this._result(args, forceUpdate);
    }
  }]);
  return _BasePoolCache;
}(AbstractCacheExtended);
exports._BasePoolCache = _BasePoolCache;
var _BaseTradeCache = /*#__PURE__*/function (_AbstractCacheExtende3) {
  _inherits(_BaseTradeCache, _AbstractCacheExtende3);
  var _super4 = _createSuper(_BaseTradeCache);
  function _BaseTradeCache(_ref10) {
    var updateInterval = _ref10.updateInterval,
      encoder = _ref10.encoder,
      decoder = _ref10.decoder,
      run = _ref10.run;
    _classCallCheck(this, _BaseTradeCache);
    return _super4.call(this, {
      updateInterval: updateInterval,
      encoder: encoder,
      decoder: decoder,
      run: run
    });
  }
  _createClass(_BaseTradeCache, [{
    key: "getKey",
    value: function getKey(amount, currency, tradeType, _ref11) {
      var _ref12, _amount$currency$chai, _allowedPoolTypes$sor;
      var allowedPoolTypes = _ref11.allowedPoolTypes;
      var keys = [amount.currency.symbol, amount.quotient.toString(), currency.symbol, tradeType, (_ref12 = (_amount$currency$chai = amount.currency.chainId) !== null && _amount$currency$chai !== void 0 ? _amount$currency$chai : currency.chainId) !== null && _ref12 !== void 0 ? _ref12 : 0, allowedPoolTypes === null || allowedPoolTypes === void 0 ? void 0 : (_allowedPoolTypes$sor = allowedPoolTypes.sort()) === null || _allowedPoolTypes$sor === void 0 ? void 0 : _allowedPoolTypes$sor.join('_')];
      var result = keys.join('_');
      return result;
    }
  }, {
    key: "getTrade",
    value: function getTrade(_ref13) {
      var forceUpdate = _ref13.forceUpdate,
        args = _ref13.args;
      return this._result(args, forceUpdate);
    }
  }]);
  return _BaseTradeCache;
}(AbstractCacheExtended);
exports._BaseTradeCache = _BaseTradeCache;