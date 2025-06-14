"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Building2,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  ArrowRightLeft,
  CheckCircle,
} from "lucide-react"
import hotelsData from "@/data/hotels.json"

interface Hotel {
  id: string
  name: string
  location: string
  city: string
  rating: number
  price: number
  originalPrice?: number
  currency: string
  image: string
  amenities: string[]
  roomType: string
  availability: number
  travelPolicy: "Compliant" | "Non-Compliant"
  description?: string
  distance?: string
  checkIn?: string
  checkOut?: string
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Free WiFi": <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
  Restaurant: <Coffee className="h-3 w-3" />,
  Gym: <Dumbbell className="h-3 w-3" />,
  Pool: <div className="h-3 w-3 rounded-full bg-blue-400" />,
  Spa: <div className="h-3 w-3 rounded-full bg-green-400" />,
  "Business Center": <Building2 className="h-3 w-3" />,
}

export default function HotelsPage() {
  const [allHotels, setAllHotels] = useState<Hotel[]>(hotelsData as Hotel[])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)

  // Search form state
  const [destination, setDestination] = useState("New York")
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0])
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [guests, setGuests] = useState("2")
  const [rooms, setRooms] = useState("1")

  // Filter state
  const [sortBy, setSortBy] = useState("price")
  const [minRating, setMinRating] = useState("0")

  useEffect(() => {
    // Check URL params for pre-filled search
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const dest = urlParams.get("destination")
      if (dest) {
        setDestination(dest)
        performSearch()
      }
    }
  }, [])

  const performSearch = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = allHotels.filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.location.toLowerCase().includes(destination.toLowerCase()),
    )
    setFilteredHotels(results)
    setLoading(false)
    setSelectedHotelId(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredHotels = useMemo(() => {
    return [...filteredHotels]
      .filter((hotel) => hotel.rating >= Number.parseFloat(minRating))
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price
        if (sortBy === "rating") return b.rating - a.rating
        if (sortBy === "name") return a.name.localeCompare(b.name)
        return 0
      })
  }, [filteredHotels, sortBy, minRating])

  const handleBookHotel = () => {
    if (selectedHotelId) {
      setShowBookingConfirmation(true)
    }
  }

  const selectedHotelDetails = selectedHotelId ? sortedAndFilteredHotels.find((h) => h.id === selectedHotelId) : null

  if (showBookingConfirmation && selectedHotelDetails) {
    return (
      <div className="min-h-screen bg-black p-3 text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 w-full max-w-md backdrop-blur-sm">
          <CardHeader className="items-center">
            <div className="p-3 bg-green-500/20 rounded-full mb-3">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <CardTitle className="text-xl font-medium text-white">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-white/70">
              Your stay at {selectedHotelDetails.name} in {selectedHotelDetails.city} is confirmed.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> SPX-HTL-{selectedHotelDetails.id.slice(-4)}
              </p>
              <p>
                <span className="text-white/60">Hotel:</span> {selectedHotelDetails.name}
              </p>
              <p>
                <span className="text-white/60">Check-in:</span> {checkInDate}
              </p>
              <p>
                <span className="text-white/60">Check-out:</span> {checkOutDate}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${selectedHotelDetails.price}/night
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedHotelId(null)
              }}
              className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
            >
              Book Another Hotel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-light text-white tracking-tight">Hotels</h1>
        </header>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Destination (e.g. New York)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <InputWithIcon
                  icon={<Calendar className="h-4 w-4 text-white/50" />}
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
                <InputWithIcon
                  icon={<Calendar className="h-4 w-4 text-white/50" />}
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                    <Users className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        {g} Guest{g > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                    <Building2 className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} Room{r > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto bg-white text-black hover:bg-white/90 rounded-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {loading ? "Searching..." : "Search Hotels"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters and Results */}
        {!loading && filteredHotels.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
              <h2 className="text-lg font-medium text-white">{sortedAndFilteredHotels.length} hotels found</h2>
              <div className="flex gap-2">
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="bg-transparent border-none text-white/70 h-8 text-xs w-auto focus:ring-0">
                    <Star className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["0", "3", "4", "4.5"].map((rating) => (
                      <SelectItem key={rating} value={rating} className="text-xs">
                        {rating === "0" ? "All Ratings" : `${rating}+ Stars`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-transparent border-none text-white/70 h-8 text-xs w-auto focus:ring-0">
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["price", "rating", "name"].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sortedAndFilteredHotels.map((hotel, index) => (
              <Card
                key={hotel.id}
                className={`bg-white/5 border hover:bg-white/10 transition-all ${selectedHotelId === hotel.id ? "border-blue-500/50 ring-2 ring-blue-500/30" : "border-white/10"}`}
                style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out forwards`, opacity: 0 }}
              >
                <CardContent
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedHotelId(hotel.id === selectedHotelId ? null : hotel.id)}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-white/10">
                      <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium text-white">{hotel.name}</h3>
                          <p className="text-sm text-white/70">{hotel.location}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
                              />
                            ))}
                            <span className="text-xs text-white/70 ml-1">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {hotel.originalPrice && (
                              <span className="text-sm text-white/50 line-through">${hotel.originalPrice}</span>
                            )}
                            <span className="text-xl font-bold text-white">${hotel.price}</span>
                          </div>
                          <p className="text-xs text-white/50">per night</p>
                          <Badge
                            className={`text-xs mt-1 ${hotel.travelPolicy === "Compliant" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"}`}
                          >
                            {hotel.travelPolicy}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 6).map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs text-white/70"
                          >
                            {amenityIcons[amenity] || <div className="h-3 w-3 rounded-full bg-white/50" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {hotel.amenities.length > 6 && (
                          <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                            +{hotel.amenities.length - 6} more
                          </Badge>
                        )}
                      </div>
                      {hotel.description && <p className="text-sm text-white/60 line-clamp-2">{hotel.description}</p>}
                    </div>
                  </div>
                  {selectedHotelId === hotel.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Room Type:</span> {hotel.roomType}
                          </p>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Availability:</span> {hotel.availability} rooms
                            left
                          </p>
                          {hotel.distance && (
                            <p className="text-white/70">
                              <span className="font-medium text-white/90">Distance:</span> {hotel.distance}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white/90 mb-1">All Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.map((amenity) => (
                              <Badge
                                key={amenity}
                                variant="secondary"
                                className="bg-white/10 text-white/70 text-xs px-2 py-0.5"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleBookHotel}
                        size="sm"
                        className="w-full mt-3 bg-white text-black hover:bg-white/90 rounded-full"
                      >
                        Book This Hotel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white/70">Searching for hotels...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredHotels.length === 0 && destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Building2 className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Hotels Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Building2 className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">Find Your Perfect Stay</h3>
              <p className="text-white/70 mt-1">Search for hotels in your destination.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Helper component for inputs with icons
function InputWithIcon({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <Input
        {...props}
        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 focus:ring-1 focus:ring-white/20"
      />
    </div>
  )
}

// Add CSS for animations
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  if (!document.head.querySelector("style[data-hotels-animations]")) {
    style.setAttribute("data-hotels-animations", "true")
    document.head.appendChild(style)
  }
}
