import { configureStore } from '@reduxjs/toolkit'
import swapReducer from '../swap/reducer';
import routeReducer from '../route/reducer'

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    route: routeReducer
  },
})