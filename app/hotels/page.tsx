import type { Metadata } from "next"
import HotelCard from "@/components/HotelCard"
import { Suspense } from "react"
import Loading from "./loading"

export const metadata: Metadata = {
  title: "Hotels - Travel App",
  description: "Find the best hotels for your trip.",
}

async function getHotels() {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: 1,
      name: "Luxury Resort & Spa",
      location: "Miami Beach, FL",
      image: "/hotel1.jpg",
      rating: 4.5,
      price: 299,
    },
    {
      id: 2,
      name: "Mountain View Lodge",
      location: "Aspen, CO",
      image: "/hotel2.jpg",
      rating: 4.2,
      price: 199,
    },
    {
      id: 3,
      name: "Oceanfront Paradise Hotel",
      location: "Maui, HI",
      image: "/hotel3.jpg",
      rating: 4.8,
      price: 399,
    },
  ]
}

export default async function HotelsPage() {
  const hotelsPromise = getHotels()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Our Featured Hotels</h1>
      <Suspense fallback={<Loading />}>
        <Hotels hotelsPromise={hotelsPromise} />
      </Suspense>
    </div>
  )
}

async function Hotels({ hotelsPromise }: { hotelsPromise: Promise<any> }) {
  const hotels = await hotelsPromise

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel: any) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  )
}
