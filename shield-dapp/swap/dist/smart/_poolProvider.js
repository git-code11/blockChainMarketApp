"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalCandidatePoolCache = exports["default"] = exports.RouteType = exports.PoolType = exports.PoolCache = exports.CandidatePoolCache = void 0;
var _utils = require("./_utils");
var _cacheLib = require("./_cacheLib");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var _require = require("@pancakeswap/smart-router/evm"),
  SmartRouter = _require.SmartRouter,
  PoolType = _require.PoolType,
  RouteType = _require.RouteType;
exports.RouteType = RouteType;
exports.PoolType = PoolType;
var _poolProvider = {
  onChain: SmartRouter.createPoolProvider({
    onChainProvider: _utils.viemClients
  }),
  "static": function _static(candidatePools) {
    return SmartRouter.createStaticPoolProvider(candidatePools);
  }
};
var getCandidatePools = function getCandidatePools(_ref) {
  var poolProvider = _ref.poolProvider,
    currencyIn = _ref.currencyIn,
    currencyOut = _ref.currencyOut,
    allowedPoolTypes = _ref.allowedPoolTypes,
    blockNumber = _ref.blockNumber;
  return poolProvider === null || poolProvider === void 0 ? void 0 : poolProvider.getCandidatePools(currencyIn, currencyOut, {
    blockNumber: blockNumber,
    protocols: allowedPoolTypes
  });
};

//const __TIME_FACTOR = 60 * 1000;

// export class CandidatePoolCache{

//     constructor(expiresDuration){
//         this._cache = {}
//         this._expireTime = {}
//         this._expiresDuration = expiresDuration ?? 4 //in minute
//        // this.name = Date.now();
//     }

//     getPool({poolProvider, forceUpdate, ...params}){//forceUpdate means cause refetch of candidate Pool info
//         const _key = this.getKey(params);
//         forceUpdate = forceUpdate || (this._expireTime[_key] <= Date.now());
//         if(!forceUpdate && this._cache[_key]){
//             return this._cache[_key];
//         }else{
//             console.log("UPDATING POOL")
//             return this.setPool(poolProvider, params);
//         }
//     }

//     async setPool(poolProvider, params){
//         const _key = this.getKey(params);
//         this._cache[_key] = await getCandidatePools({poolProvider, ...params});
//         this._expireTime[_key] = Date.now() + this._expiresDuration * __TIME_FACTOR;
//         return this._cache[_key];
//     }

//     getKey({currencyIn, currencyOut, blockNumber, allowedPoolTypes}){
//         const keys =  [
//             //this.name,
//             currencyIn.name ?? currencyIn.symbol,
//             currencyOut.name ?? currencyOut.symbol,
//             currencyIn.chainId ?? currencyOut.chainId ?? 0,
//             blockNumber ?? 0,
//             ...allowedPoolTypes.sort()
//         ]
//         return keys.join('_');
//     }
// }
var CandidatePoolCache = /*#__PURE__*/function (_BaseCandidatePoolCac) {
  _inherits(CandidatePoolCache, _BaseCandidatePoolCac);
  var _super = _createSuper(CandidatePoolCache);
  function CandidatePoolCache(updateInterval) {
    _classCallCheck(this, CandidatePoolCache);
    return _super.call(this, updateInterval, getCandidatePools);
  }
  return _createClass(CandidatePoolCache);
}(_cacheLib._BaseCandidatePoolCache);
exports.CandidatePoolCache = CandidatePoolCache;
var _poolEncoder = function _poolEncoder(_pool) {
  var _chainId;
  var chainId;
  if (_pool.type === PoolType.V2) {
    var _pool$reserve0$chainI;
    chainId = (_pool$reserve0$chainI = _pool.reserve0.chainId) !== null && _pool$reserve0$chainI !== void 0 ? _pool$reserve0$chainI : _pool.reserve1.chainId;
  } else if (_pool.type = PoolType.V3) {
    chainId = _pool.balances[0].chainId;
  } else if (_pool.type) {
    var _pool$token0$chainId;
    chainId = (_pool$token0$chainId = _pool.token0.chainId) !== null && _pool$token0$chainId !== void 0 ? _pool$token0$chainId : _pool.token1.chainId;
  }
  return {
    pool: SmartRouter.Transformer.serializePool(_pool),
    chainId: (_chainId = chainId) !== null && _chainId !== void 0 ? _chainId : 0
  };
};
var _poolDecoder = function _poolDecoder(serial) {
  return SmartRouter.Transformer.parsePool(serial.chainId, serial.pool);
};
var _poolsEncoder = function _poolsEncoder(pools) {
  return pools.map(_poolEncoder);
};
var _poolsDecoder = function _poolsDecoder(serials) {
  return serials.map(_poolDecoder);
};
var PoolCache = /*#__PURE__*/function (_BasePoolCache2) {
  _inherits(PoolCache, _BasePoolCache2);
  var _super2 = _createSuper(PoolCache);
  function PoolCache(updateInterval) {
    _classCallCheck(this, PoolCache);
    return _super2.call(this, {
      updateInterval: updateInterval,
      run: getCandidatePools,
      encoder: _poolsEncoder,
      decoder: _poolsDecoder
    });
  }
  return _createClass(PoolCache);
}(_cacheLib._BasePoolCache);
exports.PoolCache = PoolCache;
var globalCandidatePoolCache = new CandidatePoolCache();
exports.globalCandidatePoolCache = globalCandidatePoolCache;
var _default = _poolProvider;
exports["default"] = _default;