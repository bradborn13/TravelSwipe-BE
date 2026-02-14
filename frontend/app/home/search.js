'use client'
import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { setSearch } from '../store/slices/searchSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
export default function Search() {
  const dispatch = useAppDispatch()
  const [location, setLocation] = useState('')

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2">
        <TextField
          id="outlined-basic"
          label="Search Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button variant="contained" onClick={() => dispatch(setSearch(location))}>
          Search
        </Button>
      </div>
    </div>
  )
}
