"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  quoteProviders: true,
  poolProviders: true,
  bestTrades: true,
  getWorker: true,
  utils: true
};
Object.defineProperty(exports, "bestTrades", {
  enumerable: true,
  get: function get() {
    return _getBestTrade["default"];
  }
});
Object.defineProperty(exports, "getWorker", {
  enumerable: true,
  get: function get() {
    return _web_worker.getWorker;
  }
});
Object.defineProperty(exports, "poolProviders", {
  enumerable: true,
  get: function get() {
    return _poolProvider["default"];
  }
});
Object.defineProperty(exports, "quoteProviders", {
  enumerable: true,
  get: function get() {
    return _quoteProvider["default"];
  }
});
exports.utils = void 0;
var _quoteProvider = _interopRequireDefault(require("./_quoteProvider"));
var _poolProvider = _interopRequireWildcard(require("./_poolProvider"));
Object.keys(_poolProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _poolProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _poolProvider[key];
    }
  });
});
var _getBestTrade = _interopRequireWildcard(require("./_getBestTrade"));
Object.keys(_getBestTrade).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _getBestTrade[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getBestTrade[key];
    }
  });
});
var _web_worker = require("./_web_worker");
var _prepare = require("./_prepare");
Object.keys(_prepare).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _prepare[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _prepare[key];
    }
  });
});
var _utils = _interopRequireWildcard(require("./_utils"));
exports.utils = _utils;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }