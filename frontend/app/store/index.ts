import { configureStore } from '@reduxjs/toolkit'
import searchSlice from './slices/searchSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      base: searchSlice,
    },
    devTools: true,
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
