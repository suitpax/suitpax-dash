"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AIQuickInput from "@/components/ui/ai-quick-input"
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Heart,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  UtensilsIcon,
  Filter,
  ArrowUpDown,
} from "lucide-react"

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  amenities: string[]
  description: string
  stars: number
  chain?: string
  distance?: string
}

function HotelsContent() {
  const searchParams = useSearchParams()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [savedHotels, setSavedHotels] = useState<string[]>([])

  // Search form state
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [rooms, setRooms] = useState("1")

  // Filter state
  const [sortBy, setSortBy] = useState("price")
  const [maxPrice, setMaxPrice] = useState(500)
  const [minRating, setMinRating] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [starRating, setStarRating] = useState<number[]>([])

  useEffect(() => {
    // Get URL parameters
    const dest = searchParams.get("destination") || ""
    const checkin = searchParams.get("checkin") || ""
    const checkout = searchParams.get("checkout") || ""
    const guestCount = searchParams.get("guests") || "2"

    setDestination(dest)
    setCheckIn(checkin)
    setCheckOut(checkout)
    setGuests(guestCount)

    // Load saved hotels from localStorage
    const saved = localStorage.getItem("savedHotels")
    if (saved) {
      setSavedHotels(JSON.parse(saved))
    }

    // If we have search params, perform search
    if (dest && checkin && checkout) {
      performSearch()
    }
  }, [searchParams])

  const performSearch = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate realistic hotel data
    const generatedHotels = generateHotels(destination, checkIn, checkOut)
    setHotels(generatedHotels)
    setLoading(false)
  }

  const generateHotels = (dest: string, checkin: string, checkout: string): Hotel[] => {
    const hotelChains = [
      "Marriott",
      "Hilton",
      "Hyatt",
      "InterContinental",
      "Sheraton",
      "Westin",
      "Radisson",
      "Holiday Inn",
      "Novotel",
      "Crowne Plaza",
    ]

    const hotelTypes = ["Hotel", "Suites", "Resort", "Inn", "Plaza", "Grand"]
    const amenitiesList = [
      "Free WiFi",
      "Parking",
      "Pool",
      "Gym",
      "Spa",
      "Restaurant",
      "Bar",
      "Room Service",
      "Business Center",
      "Airport Shuttle",
      "Pet Friendly",
      "Laundry",
      "Concierge",
      "Breakfast",
    ]

    const hotels: Hotel[] = []
    const numHotels = 12 + Math.floor(Math.random() * 8)

    for (let i = 0; i < numHotels; i++) {
      const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)]
      const type = hotelTypes[Math.floor(Math.random() * hotelTypes.length)]
      const stars = 3 + Math.floor(Math.random() * 3) // 3-5 stars
      const rating = 3.5 + Math.random() * 1.5 // 3.5-5.0 rating
      const reviews = 50 + Math.floor(Math.random() * 500)
      const basePrice = stars * 50 + Math.floor(Math.random() * 100)

      // Select random amenities
      const numAmenities = 4 + Math.floor(Math.random() * 6)
      const hotelAmenities = []
      const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random())
      for (let j = 0; j < numAmenities; j++) {
        hotelAmenities.push(shuffled[j])
      }

      hotels.push({
        id: `HTL${1000 + i}`,
        name: `${chain} ${type} ${dest}`,
        location: `${Math.floor(Math.random() * 50) + 1} ${["Main St", "Business District", "Downtown", "City Center"][Math.floor(Math.random() * 4)]}, ${dest}`,
        price: basePrice,
        rating: Math.round(rating * 10) / 10,
        reviews,
        image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(chain + " " + dest)}`,
        amenities: hotelAmenities,
        description: `Experience luxury and comfort at ${chain} ${type} ${dest}. Perfect for business travelers with modern amenities and excellent service.`,
        stars,
        chain,
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km from city center`,
      })
    }

    return hotels.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "stars") return b.stars - a.stars
      return 0
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (destination && checkIn && checkOut) {
      performSearch()
    }
  }

  const toggleSaveHotel = (hotelId: string) => {
    const updated = savedHotels.includes(hotelId)
      ? savedHotels.filter((id) => id !== hotelId)
      : [...savedHotels, hotelId]

    setSavedHotels(updated)
    localStorage.setItem("savedHotels", JSON.stringify(updated))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const filteredHotels = hotels.filter((hotel) => {
    if (hotel.price > maxPrice) return false
    if (hotel.rating < minRating) return false
    if (starRating.length > 0 && !starRating.includes(hotel.stars)) return false
    if (selectedAmenities.length > 0 && !selectedAmenities.every((amenity) => hotel.amenities.includes(amenity)))
      return false
    return true
  })

  const featuredDestinations = [
    { city: "New York", hotels: "1,200+ hotels", image: "/placeholder.svg?height=120&width=200&text=NYC" },
    { city: "London", hotels: "800+ hotels", image: "/placeholder.svg?height=120&width=200&text=London" },
    { city: "Paris", hotels: "600+ hotels", image: "/placeholder.svg?height=120&width=200&text=Paris" },
    { city: "Tokyo", hotels: "900+ hotels", image: "/placeholder.svg?height=120&width=200&text=Tokyo" },
    { city: "Dubai", hotels: "400+ hotels", image: "/placeholder.svg?height=120&width=200&text=Dubai" },
    { city: "Singapore", hotels: "300+ hotels", image: "/placeholder.svg?height=120&width=200&text=Singapore" },
  ]

  const amenityIcons: { [key: string]: React.ReactNode } = {
    "Free WiFi": <Wifi className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    Pool: <Waves className="h-4 w-4" />,
    Gym: <Dumbbell className="h-4 w-4" />,
    Restaurant: <UtensilsIcon className="h-4 w-4" />,
    Breakfast: <Coffee className="h-4 w-4" />,
  }

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-2">
          <h1 className="text-3xl font-light text-white mb-2">Hotel Search</h1>
          <p className="text-white/70 font-light">Find the perfect accommodation for your business stay</p>

          {/* AI Quick Input */}
          <AIQuickInput placeholder="Ask AI: 'Find hotels in Barcelona for 3 nights'" className="mt-4" />
        </div>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-2 px-2">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-light">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="City or hotel name"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-light">Check-in</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white font-light"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-light">Check-out</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white font-light"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-light">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-light">Rooms</Label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Room</SelectItem>
                      <SelectItem value="2">2 Rooms</SelectItem>
                      <SelectItem value="3">3 Rooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-white text-black hover:bg-white/90 rounded-full font-light"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Hotels
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Featured Destinations */}
        {hotels.length === 0 && !loading && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-2 px-2">
              <h2 className="text-xl font-light text-white mb-4">Popular Business Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredDestinations.map((dest) => (
                  <div
                    key={dest.city}
                    className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all group"
                    onClick={() => {
                      setDestination(dest.city)
                    }}
                  >
                    <div className="h-20 relative">
                      <img
                        src={dest.image || "/placeholder.svg"}
                        alt={dest.city}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-1 left-2 right-2">
                        <p className="text-white font-light text-xs">{dest.city}</p>
                        <p className="text-white/70 text-[10px] font-light">{dest.hotels}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {hotels.length > 0 && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg py-2 px-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-white/70" />
                  <span className="text-white/70 text-sm font-light">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-[120px] font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  {["Free WiFi", "Parking", "Pool", "Gym"].map((amenity) => (
                    <Badge
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`cursor-pointer rounded-full flex items-center gap-1 font-light ${
                        selectedAmenities.includes(amenity)
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {amenityIcons[amenity]}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-white/70 text-sm font-light">{filteredHotels.length} hotels found</div>
            </div>

            {/* Hotel Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card
                  key={hotel.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-light">{hotel.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveHotel(hotel.id)}
                      className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/70 hover:text-white"
                    >
                      <Heart
                        className={`h-4 w-4 ${savedHotels.includes(hotel.id) ? "fill-current text-red-400" : ""}`}
                      />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <CardContent className="py-2 px-2">
                    <h3 className="font-light text-white mb-1">{hotel.name}</h3>
                    <p className="text-white/70 text-sm mb-2 flex items-center font-light">
                      <MapPin className="h-3 w-3 mr-1" />
                      {hotel.distance}
                    </p>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2 font-light">{hotel.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <Badge
                          key={amenity}
                          className="text-xs bg-white/10 text-white/70 border-white/20 rounded-full flex items-center gap-1 font-light"
                        >
                          {amenityIcons[amenity]}
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <Badge className="text-xs bg-white/10 text-white/70 border-white/20 rounded-full font-light">
                          +{hotel.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-light text-white">${hotel.price}</span>
                        <span className="text-white/50 text-sm font-light">/night</span>
                        <div className="text-white/50 text-xs font-light">{hotel.reviews} reviews</div>
                      </div>
                      <Button className="bg-white text-black hover:bg-white/90 rounded-full font-light">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/70 font-light">Finding the best hotels for you...</p>
            </div>
          </div>
        )}
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
            <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-2">
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  )
}
