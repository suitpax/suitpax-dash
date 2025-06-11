"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MicroscopeIcon as MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
  HeartIcon,
  WifiIcon,
  UtensilsIcon,
  TvIcon,
  ShowerHeadIcon as SwimmingPoolIcon,
} from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<"search" | "results" | "saved">("search")
  const [sortBy, setSortBy] = useState("price")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

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

    if (location) {
      setActiveTab("results")
    }
  }, [searchParams])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const filteredHotels = hotels
    .filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = !selectedLocation || hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      return matchesSearch && matchesLocation && matchesPrice && matchesAmenities
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  const handleSearch = () => {
    setActiveTab("results")
  }

  const featuredHotels = [
    {
      name: "Grand Hyatt New York",
      location: "New York",
      price: 299,
      image: "/images/hotels/grand-hyatt-ny.png",
      rating: 4.7,
    },
    {
      name: "Marriott Madrid",
      location: "Madrid",
      price: 189,
      image: "/images/hotels/marriott-madrid.png",
      rating: 4.5,
    },
    {
      name: "NH Collection Barcelona",
      location: "Barcelona",
      price: 210,
      image: "/images/hotels/nh-collection-barcelona.png",
      rating: 4.8,
    },
    {
      name: "Westin Valencia",
      location: "Valencia",
      price: 175,
      image: "/images/hotels/westin-valencia.png",
      rating: 4.6,
    },
  ]

  const amenities = [
    { name: "WiFi", icon: <WifiIcon className="h-4 w-4" /> },
    { name: "Restaurant", icon: <UtensilsIcon className="h-4 w-4" /> },
    { name: "TV", icon: <TvIcon className="h-4 w-4" /> },
    { name: "Pool", icon: <SwimmingPoolIcon className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Hotel Search</h1>
          <p className="text-white/70">Find the perfect accommodation for your business trip</p>
        </div>

        {/* Tabs de navegación */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "search"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <MagnifyingGlassIcon className="h-3.5 w-3.5 mr-1.5" />
            Search Hotels
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "results"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
            Results
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <HeartIcon className="h-3.5 w-3.5 mr-1.5" />
            Saved Hotels
          </button>
        </div>

        {activeTab === "search" && (
          <>
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
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="new york">New York</SelectItem>
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

              <Button onClick={handleSearch} className="mt-4 bg-white text-black hover:bg-white/90 rounded-full">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Hotels
              </Button>
            </div>

            {/* Featured Hotels */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Featured Business Hotels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredHotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                    onClick={() => {
                      setSearchTerm(hotel.name)
                      setSelectedLocation(hotel.location)
                      setActiveTab("results")
                    }}
                  >
                    <div className="h-36 relative">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs">{hotel.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-white text-sm">{hotel.name}</h3>
                      <p className="text-white/70 text-xs flex items-center mt-1">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {hotel.location}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white font-bold">${hotel.price}</span>
                        <span className="text-white/50 text-xs">/night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "results" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="rating">Rating: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      className={`flex items-center gap-1 cursor-pointer rounded-full ${
                        selectedAmenities.includes(amenity.name)
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      onClick={() => toggleAmenity(amenity.name)}
                    >
                      {amenity.icon}
                      {amenity.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
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
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{hotel.rating}</span>
                      </div>
                    </div>
                    <button className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/70 hover:text-white">
                      <HeartIcon className="h-4 w-4" />
                    </button>
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
                          className="text-xs bg-white/10 text-white/70 border-white/20 rounded-full"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-white/10 text-white/70 border-white/20 rounded-full"
                        >
                          +{hotel.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-white">${hotel.price}</span>
                        <span className="text-white/50 text-sm">/night</span>
                      </div>
                      <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <HeartIcon className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Saved Hotels</h3>
              <p className="text-white/70 max-w-md mx-auto">
                You haven't saved any hotels yet. Search for hotels and save them for quick access later.
              </p>
              <Button
                onClick={() => setActiveTab("search")}
                className="mt-4 bg-white text-black hover:bg-white/90 rounded-full"
              >
                Search Hotels
              </Button>
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-white/10 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  )
}
