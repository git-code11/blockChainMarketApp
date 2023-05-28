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

  input: {
    amount:0,
    curremcy:"0x"
  },
  output: {
    amount:0,
    curremcy:"0x"
  },
  settings:{
    slippage: 100, //100bips 1%
    deadline: 30, //30 seconds
    pool: { //enabled pool
      v2:true,
      v3:true,
      stable:true
    },
  },
  admin:{
    account:"0x",
    feePercent:10 // 0.1% or 10bps
  },
  dev:{
    pool:"main",
    quoter:"main",
    trade:"main"
  }
}

export const counterSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    inputChange: (state, action) => {
      state.input.amount = action.amount;
      state.input.currency = action.currency
    },

    outputChange: (state, action) => {
      state.output.amount = action.amount;
      state.output.currency = action.currency
    },

    valuesReversed: (state) => {
      const {input, output} = state;
      state.input = {...output};
      state.output = {...input};
    },

    settingsChange: (state, action) => {
      state.settings.slippage = action.slippage ?? state.settings.slippage;
      state.settings.deadline = action.deadline ?? state.settings.deadline;
      state.settings.pool = {...state.settings.pool, ...action.pool}
    },
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