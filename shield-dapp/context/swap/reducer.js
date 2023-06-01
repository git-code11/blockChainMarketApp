import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const fetchOutput = createAsyncThunk(
  'swap/fetchOutput',
  async (_arg, thunkAPI) => {
    const {input, dev} = thunkAPI.getState().input;
    
    return "result"
  }
)



const initialState = {
  status:"idle",
  error:null,
  chainId:97,

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
    account:"0x",
    feePercent:10 // 0.1% or 10bps
  },
  
  dev:{
    pool:"main",
    quoter:"main",
    trade:"main"
  },
  trade:{
    chainId:0,
    value:''
  }
}

export const counterSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    inputChange: (state, {payload}) => {
      state.input = {...state.input, ...payload}
      
      if(payload.amount && !isNaN(payload.amount) && state.output.currency){
        console.log("the", payload, !isNaN(payload.amount) && state.output.currency)
        state.output.amount = 0;
        state.output._$ = {
          amount:state.input.amount,
          currency:state.input.currency,
          loading:true
        };
      }else{
        state.output._$.loading = false;
        state.output.amount = 0;
      }

    },

    outputChange: (state, {payload}) => {  
      if(payload.currency){
        state.output = { 
          currency:payload.currency,
          amount:0,
          _$:{
            amount:state.input.amount,
            currency:state.input.currency,
            loading:true
          }
        };
      }else if(state.output._$.loading && 
          state.output._$.currency === state.input.currency && 
          state.output._$.amount === state.input.amount &&
          !isNaN(payload.amount)
        ){
          //incase of invalid result
          state.output = {...state.output, ...payload}
          state.output._$.loading = false;
      }else{
        console.log("DEBUG ERROR", {payload});
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
        _$:{
          ...state.input,
          loading:true
        }
      };
    },

    settingsChange: (state, {payload}) => {
      state.settings.tolerance = payload.tolerance ?? state.settings.tolerance;
      state.settings.deadline = payload.deadline ?? state.settings.deadline;
      state.settings.pool = {...state.settings.pool, ...payload.pool}
    },

    toggleModal:(state, {payload})=>{
      state.modal = {...initialState.modal, ...payload};
    },

    tradeChange:(state, {payload})=>{
      state.trade.chainId = payload.chainId;
      state.trade.value = payload.value;
    },

    chainChange:(state, {payload})=>{
      state.chainId = payload;
    }
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchOutput.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload)
    })
  },
})

// Action creators are generated for each case reducer function
export const {actions} = counterSlice;

export default counterSlice.reducer