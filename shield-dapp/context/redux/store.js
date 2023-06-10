import { configureStore } from '@reduxjs/toolkit'
import swapReducer from '../swap/reducer';

export const store = configureStore({
  reducer: {
    swap: swapReducer
  },
})