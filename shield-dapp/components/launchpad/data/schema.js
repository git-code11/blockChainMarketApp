import * as yup from 'yup';
import { utils } from "ethers";

const addressSchema = yup.string().test({
    name:"validate Token",
    message:"Invalid Token Address Checksum",
    test:(value)=>utils.isAddress(value)
});

const tokenSchema = yup.object({
    address:addressSchema,
    buyToken:addressSchema,
    feeTier:yup.number(),
});

const detailSchema = yup.object({
    logoUrl:yup.string().required(),
    name:yup.string().required(),
    web:yup.string().required(),
    social:yup.string(),
    desc:yup.string().required(),
    cid:yup.string()//to hold uploaded cid
}).required();

const launchSchema = yup.object({
    preSale:yup.number().required(),
    dexSale:yup.number().required(),
    capped:yup.number().required(),
    minBuy:yup.number().required(),
    maxBuy:yup.number().required(),
    swapLiquidityPercent:yup.number().min(50).required(),
    startTime:yup.date().required(),
    endTime:yup.date().required(),
    lockUp:yup.number().required(),
    enablewhitelist:yup.bool()
}).required();


export const createLaunchPadSchema = yup.object({
    token:tokenSchema,
    launch:launchSchema,
    detail:detailSchema,
}).required();


export const createTokenSchema = yup.object({
    name:yup.string().required(),
    symbol:yup.string().required(),
    decimals:yup.number().required(),
    totalSupply:yup.number().required()
}).required();


export const purchaseLaunchSchema= yup.object({
    buyToken:addressSchema,
    value:yup.number().required()
}).required();