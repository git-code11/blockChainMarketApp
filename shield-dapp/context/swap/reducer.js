import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const fetchOutput = createAsyncThunk(
  'swap/fetchOutput',
  async (_arg, thunkAPI) => {
    const {input, dev} = thunkAPI.getState().input;
    
    return "result"
  }
)

const FIXED_NO = 8;

const initialState = {
  status:"idle",
  error:null,
  chainId:97,

  rate:0,
  input: {
    amount:0,
    currency:"0x"
  },

  output: {
    amount:0,
    currency:"0x",
    _$:{
      amount:0,
      currency:"0x",
      loading:false,
    }
  },

  settings:{
    tolerance: 100, //100bips 1%
    deadline: 30, //30 seconds
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
    account:"0x47207ECD6a722547ec42ee899d2b8973f707090d",//test Admin
    feeBips:10 // 0.1% or 10bps
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
    success:null
  }
}

export const counterSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    inputChange: (state, {payload}) => {
      if(payload.amount){
        payload.amount = isNaN(payload.amount)||payload.amount.endsWith('.')||payload.amount.endsWith('0')?
                    payload.amount:
                    Number(Number(payload.amount).toFixed(FIXED_NO)).toString();
        if(state.input.amount===payload.amount)
          return;
      }

      if(
        (payload.amount && !isNaN(payload.amount) && 
          Number(payload.amount) !== Number(state.input.amount)) || 
            payload.currency){
        state.trade.value = "";
        state.output.amount = 0;
      }
      state.input = {...state.input, ...payload}

      
    },

    outputChange: (state, {payload}) => {
      console.log({outputChange:payload})
      if(payload.currency){
        state.output.currency = payload.currency;

        state.trade.value = "";
        state.output.amount = 0;
        state.rate = 0;
      }
    },

    valuesReversed: (state) => {
      const {input, output} = state;
      state.input = {
          currency: output.currency,
          amount: output.amount
      };

      state.output = {
        currency: input.currency,
        amount: 0,//input.amount,
      };

      state.trade.value = "";
      state.rate = 0;
    },

    settingsChange: (state, {payload}) => {
      state.settings.tolerance = payload.tolerance ?? state.settings.tolerance;
      state.settings.deadline = payload.deadline ?? state.settings.deadline;
      state.settings.pool = {...state.settings.pool, ...payload.pool}
      if(payload.pool){
        state.trade.value = "";//reset trade when pool changes
        state.output.amount = 0;
        state.rate = 0;
      }
    },

    toggleModal:(state, {payload})=>{
      state.modal = {...initialState.modal, ...payload};
    },

    tradeChange:(state, {payload})=>{
      //console.log({tradeR:payload})
      console.log({
        rule:Number(state.input.amount) === Number(payload.input.amount),
        data:[Number(state.input.amount).toString(), payload.input.amount]
      });
         
      if(
          payload.input && payload.output &&
          state.input.currency === payload.input.currency &&
          Number(state.input.amount) === Number(payload.input.amount) &&
          state.output.currency === payload.output.currency){
            
            state.trade.chainId = payload.chainId;
            state.trade.value = payload.value;

            state.output.amount = Number(Number(payload.output.amount).toFixed(FIXED_NO)).toString();
            
            state.rate = Number(state.output.amount)/Number(state.input.amount);
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
    },

    chainChange:(state, {payload})=>{
      state.chainId = payload;
    }
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchOutput.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload);
    })
  },
})

// Action creators are generated for each case reducer function
export const {actions} = counterSlice;

export default counterSlice.reducer