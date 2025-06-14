"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  ArrowRightLeft,
  Building2,
  CheckCircle,
  Loader2,
} from "lucide-react"
import hotelsData from "@/data/hotels.json"

interface Hotel {
  id: string
  name: string
  location: string
  city: string
  country: string
  rating: number
  price: number
  currency: string
  image: string
  amenities: string[]
  description: string
  checkIn: string
  checkOut: string
  roomType: string
  availability: number
  travelPolicy: "Compliant" | "Non-Compliant"
  distance?: string
  reviews?: {
    count: number
    score: number
  }
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Free WiFi": <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
  Restaurant: <Coffee className="h-3 w-3" />,
  "Fitness Center": <Dumbbell className="h-3 w-3" />,
  "Business Center": <Building2 className="h-3 w-3" />,
}

export default function HotelsPage() {
  const [allHotels, setAllHotels] = useState<Hotel[]>(hotelsData as Hotel[])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)

  // Search form state
  const [destination, setDestination] = useState("")
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0])
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [guests, setGuests] = useState("1")

  // Filter state
  const [sortBy, setSortBy] = useState("price")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")

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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = allHotels.filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.country.toLowerCase().includes(destination.toLowerCase()),
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
    let results = [...filteredHotels]

    // Apply filters
    if (maxPrice) {
      results = results.filter((hotel) => hotel.price <= Number.parseInt(maxPrice))
    }
    if (minRating) {
      results = results.filter((hotel) => hotel.rating >= Number.parseFloat(minRating))
    }

    // Apply sorting
    return results.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })
  }, [filteredHotels, sortBy, maxPrice, minRating])

  const handleBookHotel = async () => {
    if (!selectedHotelId) return

    const hotel = sortedAndFilteredHotels.find((h) => h.id === selectedHotelId)
    if (!hotel) return

    setLoading(true)

    // Simulate booking API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockBooking = {
      id: `booking_${Date.now()}`,
      reference: `SPX${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "confirmed",
      hotel: hotel,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests,
      created_at: new Date().toISOString(),
    }

    setBookingData(mockBooking)
    setShowBookingConfirmation(true)
    setLoading(false)
  }

  const selectedHotelDetails = selectedHotelId ? sortedAndFilteredHotels.find((h) => h.id === selectedHotelId) : null

  if (showBookingConfirmation && bookingData) {
    const hotel = bookingData.hotel

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
              Your stay at {hotel?.name} in {hotel?.city} is confirmed.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> {bookingData.reference}
              </p>
              <p>
                <span className="text-white/60">Hotel:</span> {hotel?.name}
              </p>
              <p>
                <span className="text-white/60">Check-in:</span> {bookingData.checkIn}
              </p>
              <p>
                <span className="text-white/60">Check-out:</span> {bookingData.checkOut}
              </p>
              <p>
                <span className="text-white/60">Guests:</span> {bookingData.guests}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${hotel?.price}/night
              </p>
              <p>
                <span className="text-white/60">Status:</span>
                <span className="text-green-400 ml-1 capitalize">{bookingData.status}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedHotelId(null)
                setBookingData(null)
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
        {/* Header - Consistent with Transfers */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-medium text-white">Hotels</h1>
              <p className="text-sm text-white/70 mt-1">
                Find and book the perfect accommodation for your business trip.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-white/70">Global Inventory</span>
            </div>
          </div>
        </header>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Destination (e.g. New York, London)"
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
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto bg-white text-black hover:bg-white/90 rounded-full"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                {loading ? "Searching..." : "Search Hotels"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        {filteredHotels.length > 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-transparent border-white/10 text-white h-9 text-sm w-auto">
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["price", "rating", "name"].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize text-sm">
                        Sort by {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9 w-24 bg-white/5 border-white/10 text-white text-sm rounded-lg"
                />
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm w-auto">
                    <Star className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Min rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 3.5, 4, 4.5, 5].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r}+ Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(maxPrice || minRating) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMaxPrice("")
                      setMinRating("")
                    }}
                    className="text-white/70 hover:text-white h-9 text-sm"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && sortedAndFilteredHotels.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
              <h2 className="text-lg font-medium text-white">{sortedAndFilteredHotels.length} hotels found</h2>
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
                    <div className="md:w-1/4">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-48 md:h-32 object-cover rounded-lg bg-white/10"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-white">{hotel.name}</h3>
                          <p className="text-sm text-white/70">{hotel.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
                                />
                              ))}
                              <span className="text-xs text-white/70 ml-1">{hotel.rating}</span>
                            </div>
                            {hotel.reviews && (
                              <span className="text-xs text-white/50">({hotel.reviews.count} reviews)</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-medium text-white">
                            ${hotel.price}
                            <span className="text-sm text-white/70">/night</span>
                          </p>
                          <p className="text-xs text-white/50">{hotel.roomType}</p>
                          <Badge
                            variant={hotel.travelPolicy === "Compliant" ? "default" : "secondary"}
                            className={`mt-1 text-xs ${hotel.travelPolicy === "Compliant" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}
                          >
                            {hotel.travelPolicy}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 line-clamp-2">{hotel.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 4).map((amenity) => (
                          <div key={amenity} className="flex items-center gap-1 text-xs text-white/60">
                            {amenityIcons[amenity] || <div className="h-3 w-3 rounded-full bg-white/20" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="text-xs text-white/50">+{hotel.amenities.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedHotelId === hotel.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/90 font-medium mb-2">All Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity) => (
                              <Badge key={amenity} variant="secondary" className="bg-white/10 text-white/70 text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-white/90 font-medium mb-2">Booking Details:</p>
                          <div className="space-y-1 text-xs text-white/70">
                            <p>Check-in: {checkInDate}</p>
                            <p>Check-out: {checkOutDate}</p>
                            <p>Guests: {guests}</p>
                            <p>Availability: {hotel.availability} rooms</p>
                            {hotel.distance && <p>Distance: {hotel.distance}</p>}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleBookHotel}
                        size="sm"
                        className="w-full mt-3 bg-white text-black hover:bg-white/90 rounded-full"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {loading ? "Booking..." : "Book This Hotel"}
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
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-white/70" />
            <p className="text-white/70">Searching for hotels...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredHotels.length === 0 && destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Building2 className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Hotels Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or adjust your filters.</p>
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
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `
  if (!document.head.querySelector("style[data-hotels-animations]")) {
    style.setAttribute("data-hotels-animations", "true")
    document.head.appendChild(style)
  }
}
