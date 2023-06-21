import {defaultAbiCoder, parseEther, parseUnits}  from 'ethers/lib/utils.js';

const BPS = 10000;
const p_BPS = 100
export const parseAddress = addr=>defaultAbiCoder.decode(["address"], addr)[0];

const _OutputPerinputValueBps = (input, output)=> to_Bips(output / input);
//belive for input to have 18 decimals
export const _1inputToOutputValueBps = (output, decimals)=>_OutputPerinputValueBps(parseEther("1"), parseUnits(output, decimals));

export const to_pBips = val=>Math.round(val*p_BPS);

export const from_pBips = val=>val/p_BPS;

export const to_Bips = val=>Math.round(val*BPS);

export const from_Bips = val=>val/BPS;
