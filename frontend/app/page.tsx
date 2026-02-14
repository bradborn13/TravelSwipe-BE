import Search from './home/search'
import LocationCard from './home/locationCard'

export default function Home() {
  return (
    <main className="flex min-h-screen w-full  flex-col items-center justify-between py-32 px-16 bg-red-50 sm:items-start">
      <div className="w-full h-full">
        <Search />
        <LocationCard />
      </div>
    </main>
  )
}
