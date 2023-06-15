const { ethers } = require("ethers");

const parseAddr = (addr)=>ethers.utils.defaultAbiCoder.decode(["address"], addr)[0];

module.exports = {parseAddr}