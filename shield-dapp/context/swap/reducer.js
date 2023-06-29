import { createSlice } from '@reduxjs/toolkit'
import _contract from "../../contract/address.js"
import mainConfig from '../../mainConfig'
import { formatEther, parseEther } from 'ethers/lib/utils.js';

const FIXED_NO = 8;

const initialState = {
  status:"idle",
  error:null,
  chainId:mainConfig.mainActiveChain,
  
  raw:{
    inputAmount:0
  },

  input: {
    amount:0,
    currency:null
  },

  output: {
    amount:0,
    currency:null,
  },

  settings:{
    tolerance: 1000, //10bips 0.1%
    deadline: 5, // 5seconds
    pool: { //enabled pool
      V2:true,
      V3:true,
      STABLE:true
    },
  },

  modal:{
    settings:false,
    confirm:false,
    select:false,
    success:false,
    failed:false,
    ioContext:0 //to determine input or output input = 1, output = 2, io=0
  },

  admin:{
    account:mainConfig.admin,//"0x47207ECD6a722547ec42ee899d2b8973f707090d",//test Admin
    feeBips:mainConfig.swapFeeBps// 0.1% == 100bps
  },
  
  dev:{
    pool:"main",
    quoter:"main",
    trade:"main"
  },
  trade:{
    chainId:0,
    value:''
  },

  tradeVault:{
    chainId:0,
    value:''
  },

  tx:{
    hash:null,
    success:null,
    error:null,
    explorer:{
      name:null,
      link:"#"
    }
  }
}

export const counterSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    inputChange: (state, {payload}) => {
      if(payload.amount !== undefined){
        state.raw.inputAmount = payload.amount;
        if(payload.amount && !isNaN(payload.amount)){
          const newValue = formatEther(parseEther(payload.amount));//to normalize the value
          if(newValue !== state.input.amount){
            state.input.amount = newValue;
            state.trade.value = "";
            state.output.amount = 0;
          }
        }
      }

      if(payload.currency){
        state.input.currency = payload.currency;
        state.trade.value = "";
        state.output.amount = 0;
      }
      
/* 
      if(payload.amount){
        payload.amount = isNaN(payload.amount)||payload.amount.endsWith('.')||payload.amount.endsWith('0')?
                    payload.amount:
                    Number(Number(payload.amount).toFixed(FIXED_NO)).toString();
        if(state.input.amount===payload.amount)
          return;
      } */

      /* if(
        (payload.amount && !isNaN(payload.amount) && 
          Number(payload.amount) !== Number(state.input.amount)) || 
            payload.currency){
        state.trade.value = "";
        state.output.amount = 0;
      } */
      //state.input = {...state.input, ...payload}
    },

    outputChange: (state, {payload}) => {
      if(payload.currency){
        state.output.currency = payload.currency;
        state.trade.value = "";
        state.output.amount = 0;
      }
    },

    valuesReversed: (state) => {
      state.raw.inputAmount = 0;

      const {input, output} = state;
      state.input = {
          currency: output.currency,
          amount: 0//output.amount
      };

      state.output = {
        currency: input.currency,
        amount: 0,//input.amount,
      };

      state.trade.value = "";
    },

    settingsChange: (state, {payload}) => {
      state.settings.tolerance = payload.tolerance ?? state.settings.tolerance;
      state.settings.deadline = payload.deadline ?? state.settings.deadline;
      state.settings.pool = {...state.settings.pool, ...payload.pool}
      if(payload.pool){
        state.trade.value = "";//reset trade when pool changes
        state.output.amount = 0;
      }
    },

    toggleModal:(state, {payload})=>{
      state.modal = {...initialState.modal, ...payload};
    },

    tradeChange:(state, {payload})=>{
      //console.log({tradeR:payload})
      /* console.log({
        rule:Number(state.input.amount) === Number(payload.input.amount),
        data:[Number(state.input.amount).toString(), payload.input.amount]
      }); */
      
      
      if( payload.input && payload.output &&
          state.input.currency === payload.input.currency &&
          state.input.amount === payload.input.amount &&
          state.output.currency === payload.output.currency){
            
            state.trade.chainId = payload.chainId;
            state.trade.value = payload.value;

            state.output.amount = payload.output.amount;/* Number(Number(payload.output.amount).toFixed(FIXED_NO)).toString() */;
          }
    },
    lockTrade:(state)=>{
      state.tradeVault = {
        chainId:state.trade.chainId,
        value:state.trade.value
      }
    },

    unlockTrade:(state)=>{
      state.tradeVault = {
        chainId:0,
        value:""
      }
    },

    saveTx:(state,{payload})=>{
      state.tx.hash = payload.hash;
      state.tx.success = payload.success;
      state.tx.error = payload.error;
      state.tx.explorer = payload.explorer;
    },

    chainChange:(state, {payload:chainId})=>{
      return {...initialState, chainId}
    }
  },

  /* extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    
  }, */
})

// Action creators are generated for each case reducer function
export const {actions} = counterSlice;

export default counterSlice.reducer