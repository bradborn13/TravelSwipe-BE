import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  search: string | null
}

const initialState: UserState = { search: '' }

const searchSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    clearSearch: (state) => {
      state.search = null
    },
  },
})

export const { setSearch, clearSearch } = searchSlice.actions
export default searchSlice.reducer
