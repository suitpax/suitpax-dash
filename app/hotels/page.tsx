"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, UsersIcon, StarIcon } from "@heroicons/react/24/outline"
import hotelsData from "@/data/hotels.json"

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  amenities: string[]
  description: string
}

function HotelsContent() {
  const searchParams = useSearchParams()
  const [hotels, setHotels] = useState<Hotel[]>(hotelsData as Hotel[])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("1")

  useEffect(() => {
    // Get search params
    const location = searchParams.get("location") || ""
    const checkin = searchParams.get("checkin") || ""
    const checkout = searchParams.get("checkout") || ""
    const guestCount = searchParams.get("guests") || "1"

    setSelectedLocation(location)
    setCheckIn(checkin)
    setCheckOut(checkout)
    setGuests(guestCount)
    setSearchTerm(location)
  }, [searchParams])

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
    return matchesSearch && matchesLocation
  })

  const handleSearch = () => {
    const filtered = hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = !selectedLocation || hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
      return matchesSearch && matchesLocation
    })
    setHotels(filtered)
  }

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Hotel Search</h1>
          <p className="text-white/70">Find the perfect accommodation for your business trip</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-white">
                Search Hotels
              </Label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="search"
                  placeholder="Hotel name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Location
              </Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="pl-10 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="tokyo">Tokyo</SelectItem>
                    <SelectItem value="madrid">Madrid</SelectItem>
                    <SelectItem value="barcelona">Barcelona</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-white">
                Check-in
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout" className="text-white">
                Check-out
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="text-white">
                Guests
              </Label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="pl-10 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="1 Guest" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={handleSearch} className="mt-4 bg-white text-black hover:bg-white/90">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            Search Hotels
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{filteredHotels.length} hotels found</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="relative h-48">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{hotel.name}</h3>
                  <p className="text-white/70 text-sm mb-2 flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {hotel.location}
                  </p>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{hotel.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-white/10 text-white/70 border-white/20"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white/70 border-white/20">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${hotel.price}</span>
                      <span className="text-white/50 text-sm">/night</span>
                    </div>
                    <Button size="sm" className="bg-white text-black hover:bg-white/90">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black p-3">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
            </div>
          </div>
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  )
}
