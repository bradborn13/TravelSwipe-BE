'use client'
import { useEffect, useState } from 'react'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Chip } from '@mui/material'
import { Button } from '@mui/material'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'next/image'
export default function LocationCard() {
  const dispatch = useAppDispatch()

  const query = useAppSelector((state) => state.base.search)
  const [activities, setData] = useState([])

  function DarkVariantExample(images) {
    console.log(images, 'IMAGES')
    return (
      <Carousel data-bs-theme="dark" interval={null}>
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <Image
              width={0}
              height={0}
              sizes="130vw"
              src={img.image}
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              unoptimized
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchLocationEvents() {
    await fetch(`http://localhost:5001/locations/search?city=${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setData(data || [])
      })
      .catch((err) => console.error('Error fetching events:', err))
  }

  async function handleUpdateActivityImages() {
    await fetch(`http://localhost:5001/locations/activity/update/images?city=${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(async () => {
        await fetchLocationEvents()
      })
      .catch((err) => console.error('Error updating images:', err))
  }
  useEffect(() => {
    if (query) {
      fetchLocationEvents()
    }
  }, [dispatch, fetchLocationEvents, query])
  // activity/update/images/:city
  return (
    <div className="p-4 ">
      <div className="text-gray-400 text-sm mb-2 justify-center flex gap-3">
        City: {query} - found {activities?.length ?? 0} events
      </div>
      <Button className="my-4" variant="contained" onClick={async () => await handleUpdateActivityImages()}>
        Update Images
      </Button>
      <div className="flex gap-5 flex-row justify-start flex-wrap ">
        {activities?.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="w-120 bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              {activity.imagesURL && activity.imagesURL.length > 0
                ? DarkVariantExample(activity.imagesURL)
                : null}
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
