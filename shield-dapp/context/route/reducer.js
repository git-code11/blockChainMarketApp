import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  loading:false
}

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    loading:(state, {payload})=>{
        state.loading  = payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const {actions} = routeSlice;

export default routeSlice.reducer