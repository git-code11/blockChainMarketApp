"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PUBLIC_RPC_URL = exports.CHAINS = void 0;
var _sdk = require("@pancakeswap/sdk");
var _chains = require("viem/chains");
var _DEF_RPC_URL, _PUBLIC_RPC_URL;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CHAINS = [_chains.bsc, _chains.bscTestnet, _chains.goerli, _chains.mainnet];
exports.CHAINS = CHAINS;
var DEF_RPC_URL = (_DEF_RPC_URL = {}, _defineProperty(_DEF_RPC_URL, _sdk.ChainId.BSC_TESTNET, [_chains.bscTestnet.rpcUrls["default"].http[0]]), _defineProperty(_DEF_RPC_URL, _sdk.ChainId.GOERLI, [_chains.goerli.rpcUrls["default"].http[0], _chains.goerli.rpcUrls.infura.http[0], _chains.goerli.rpcUrls.alchemy.http[0]]), _defineProperty(_DEF_RPC_URL, _sdk.ChainId.BSC, [_chains.bsc.rpcUrls["default"].http[0]]), _defineProperty(_DEF_RPC_URL, _sdk.ChainId.ETHEREUM, [_chains.mainnet.rpcUrls["default"].http[0], _chains.mainnet.rpcUrls.infura.http[0], _chains.mainnet.rpcUrls.alchemy.http[0]]), _DEF_RPC_URL);
var PUBLIC_RPC_URL = (_PUBLIC_RPC_URL = {}, _defineProperty(_PUBLIC_RPC_URL, _sdk.ChainId.BSC_TESTNET, ["https://data-seed-prebsc-1-s1.binance.org:8545/", "http://data-seed-prebsc-1-s2.binance.org:8545/", "https://bsc-testnet.publicnode.com", "https://bsc-testnet.public.blastapi.io"]), _defineProperty(_PUBLIC_RPC_URL, _sdk.ChainId.GOERLI, ['https://eth-goerli.public.blastapi.io', "https://ethereum-goerli.publicnode.com"]), _defineProperty(_PUBLIC_RPC_URL, _sdk.ChainId.BSC, ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed1.defibit.io']), _defineProperty(_PUBLIC_RPC_URL, _sdk.ChainId.ETHEREUM, ['https://eth.llamarpc.com', 'https://cloudflare-eth.com', "https://rpc.builder0x69.io", "https://ethereum.publicnode.com", "https://rpc.mevblocker.io", "https://eth-rpc.gateway.pokt.network", "https://rpc.flashbots.net/", "https://rpc.ankr.com/eth", "https://eth-mainnet.nodereal.io/v1/", "https://eth-mainnet.public.blastapi.io", "https://llamanodes.com/"]), _PUBLIC_RPC_URL);
exports.PUBLIC_RPC_URL = PUBLIC_RPC_URL;