import { configureStore } from '@reduxjs/toolkit'
import swapReducer from './reducer'

export const store = configureStore({
  reducer: {
    swap: swapReducer,
  },
})