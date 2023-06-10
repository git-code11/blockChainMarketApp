import { BigNumber } from "ethers";

export const toBigNumber = val=>BigNumber.from(val);

export const NumberToBigInt = num=>{
    const value = toBigNumber(num);
    return value.toBigInt();
}

export const BigIntToNumber = int=>{
    const value = toBigNumber(int);
    return value.toNumber();
}
