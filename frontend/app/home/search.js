'use client'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { setSearch } from '../store/slices/searchSlice'
import Stack from '@mui/material/Stack'
import { useAppDispatch } from '../store/hooks'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
export default function Search() {
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocation(inputValue)
      dispatch(setSearch(inputValue))
    }, 400)

    return () => clearTimeout(timeout)
  }, [dispatch, inputValue, location])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/location/getAll`)
        setLocationSuggestions(response.data)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
      }
    }

    fetchLocations()
  }, [])
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2">
        <Stack spacing={1} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            id="Autocomplete-locations"
            options={locationSuggestions}
            value={location}
            onChange={(event, newValue) => {
              setLocation(newValue ?? '')
              setInputValue(newValue ?? '')
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Look up a location" placeholder="Type or select" />
            )}
          />
        </Stack>
      </div>
    </div>
  )
}
