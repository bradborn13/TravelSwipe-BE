import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppState, AppDispatch, AppStore } from './index'

// 1. Use throughout your app instead of plain `useDispatch`
// This gives you autocomplete for your custom thunks/actions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// 2. Use instead of plain `useSelector`
// This ensures 'state' is automatically typed as AppState
export const useAppSelector = useSelector.withTypes<AppState>()

// 3. Use if you ever need to access the store instance directly
export const useAppStore = useStore.withTypes<AppStore>()
