"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WETH_ABI = exports.WALLET_KEY = exports.SELECTED_CHAINID = exports.RPCURL = exports.ERC20_ABI = exports.ADMIN = void 0;
var _sdk = require("@pancakeswap/sdk");
var ERC20_ABI = [
// Read-Only Functions
'function balanceOf(address owner) view returns (uint256)', 'function decimals() view returns (uint8)', 'function symbol() view returns (string)', 'function allowance(address _owner, address _spender) view returns (uint256)',
// Authenticated Functions
'function transfer(address to, uint amount) returns (bool)', 'function approve(address _spender, uint256 _value) returns (bool)',
// Events
'event Transfer(address indexed from, address indexed to, uint amount)'];
exports.ERC20_ABI = ERC20_ABI;
var WETH_ABI = [
// Wrap ETH
'function deposit() payable',
// Unwrap ETH
'function withdraw(uint wad) public'];
exports.WETH_ABI = WETH_ABI;
var WALLET_KEY = process.env.WALLET_KEY;
exports.WALLET_KEY = WALLET_KEY;
var RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
exports.RPCURL = RPCURL;
var ADMIN = "0x47207ECD6a722547ec42ee899d2b8973f707090d";
exports.ADMIN = ADMIN;
var SELECTED_CHAINID = _sdk.ChainId.BSC_TESTNET;
exports.SELECTED_CHAINID = SELECTED_CHAINID;