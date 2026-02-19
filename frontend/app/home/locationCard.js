'use client'
import { useCallback, useEffect, useState } from 'react'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
import { useAppSelector } from '../store/hooks'
import { Box, Chip } from '@mui/material'
import { Button, CircularProgress } from '@mui/material'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'next/image'
import axios from 'axios'
import { green } from '@mui/material/colors'

export default function LocationCard() {
  const query = useAppSelector((state) => state.base.search)
  const [activities, setActivities] = useState({ data: [], loading: false })
  function ImageCarousel(images) {
    return (
      <Carousel data-bs-theme="dark" interval={null}>
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <Image
              width={0}
              height={0}
              sizes="130vw"
              src={
                img.image ??
                'https://media.istockphoto.com/id/887464786/vector/no-cameras-allowed-sign-flat-icon-in-red-crossed-out-circle-vector.jpg?s=612x612&w=0&k=20&c=LVkPMBiZas8zxBPmhEApCv3UiYjcbYZJsO-CVQjAJeU='
              }
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              unoptimized
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )
  }
  const handleUpdateActivityImages = useCallback(async () => {
    setActivities((prev) => ({ ...prev, loading: true }))
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/activities/update/images`, {
          params: { city: query },
        })
        .then(async () => {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities/search`, {
            params: { city: query },
          })
          setActivities((prev) => ({ ...prev, data: response.data }))
        })
    } catch (err) {
      console.error('Error updating activity images:', err)
    } finally {
      setActivities((prev) => ({ ...prev, loading: false }))
    }
  }, [query])
  useEffect(() => {
    async function fetchLocationEvents() {
      setActivities((prev) => ({ ...prev, loading: true }))
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities/search`, {
          params: { city: query },
        })
        const data = Array.isArray(response.data) ? response.data : []
        setActivities((prev) => ({ ...prev, data: data }))
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setActivities((prev) => ({ ...prev, loading: false }))
      }
    }

    if (query) {
      fetchLocationEvents()
    }
  }, [query])
  return (
    <div className="p-4 ">
      <div className="text-gray-400 text-sm mb-2 justify-center flex gap-3">
        City: {query} - found {activities?.data.length ?? 0} events
      </div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            variant="contained"
            sx={
              activities.loading && {
                bgcolor: green[500],
                '&:hover': {
                  bgcolor: green[700],
                },
              }
            }
            disabled={activities.loading}
            onClick={async () => await handleUpdateActivityImages()}
          >
            Update Images
          </Button>
          {activities.loading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
      <div className="flex gap-5 flex-row justify-start flex-wrap ">
        {activities?.data?.length > 0 ? (
          activities.data?.map((activity, index) => (
            <div
              key={index}
              className="w-120 bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              {activity.imagesURL && activity.imagesURL.length > 0 ? ImageCarousel(activity.imagesURL) : null}
              <div className="m-4">
                <h2 className="text-lg font-bold">{activity.name}</h2>
                <div className="text-sm text-gray-400">{activity.address}</div>
                <div className="mt-2 text-gray-200 text-sm flex flex-row flex-wrap  gap-1">
                  TAGS:
                  <div className="w-full" />
                  {activity.categories?.map((cat) => (
                    <Chip key={cat.id} label={cat.name} className="mr-2 w-max" color="warning" />
                  ))}
                </div>
              </div>
              <div className="px-4 py-2 flex gap-2 border-t border-gray-700 ">
                <button className="flex items-center gap-1 hover:text-red-400 transition">
                  <FaHeart /> Like
                </button>
                <button className="flex items-center gap-1 hover:text-blue-400 transition">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-5">No events found for this location.</p>
        )}
      </div>
    </div>
  )
}
