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
import {
  Search,
  MapPin,
  Calendar,
  Plane,
  Filter,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  User,
  Clock,
  ArrowRight,
} from "lucide-react"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
    terminal?: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
    terminal?: string
  }
  duration: string
  price: number
  originalPrice?: number
  class: string
  stops: number
  aircraft: string
  rating: number
  amenities: string[]
  co2Emission: number
  popularity: "high" | "medium" | "low"
  dealType?: "best-price" | "fastest" | "popular"
  refundable: boolean
}

// City images from Pexels
const cityImages: Record<string, string> = {
  Madrid: "https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg?auto=compress&cs=tinysrgb&w=400",
  Barcelona: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400",
  London: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400",
  Paris: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400",
  "New York": "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400",
  Tokyo: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400",
  Berlin: "https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=400",
  Rome: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400",
  Amsterdam: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400",
  Dubai: "https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=400",
}

function FlightsContent() {
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [savedFlights, setSavedFlights] = useState<string[]>([])
  const [travelType, setTravelType] = useState<"business" | "personal">("business")

  // Search form state
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")
  const [travelClass, setTravelClass] = useState("economy")

  // Filter state
  const [sortBy, setSortBy] = useState("price")
  const [maxPrice, setMaxPrice] = useState(2000)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [directOnly, setDirectOnly] = useState(false)

  useEffect(() => {
    // Get URL parameters
    const from = searchParams.get("from") || ""
    const to = searchParams.get("to") || ""
    const departure = searchParams.get("departure") || ""
    const returnD = searchParams.get("return") || ""
    const pax = searchParams.get("passengers") || "1"

    setFromCity(from)
    setToCity(to)
    setDepartureDate(departure)
    setReturnDate(returnD)
    setPassengers(pax)

    // Load saved flights from localStorage
    const saved = localStorage.getItem("savedFlights")
    if (saved) {
      setSavedFlights(JSON.parse(saved))
    }

    // If we have search params, perform search
    if (from && to && departure) {
      performSearch()
    }
  }, [searchParams])

  const performSearch = async () => {
    setLoading(true)

    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate realistic flight data
    const generatedFlights = generateSpectacularFlights(fromCity, toCity, departureDate)
    setFlights(generatedFlights)
    setLoading(false)
  }

  const generateSpectacularFlights = (from: string, to: string, date: string): Flight[] => {
    const airlines = [
      { name: "American Airlines", code: "AA" },
      { name: "Delta", code: "DL" },
      { name: "United", code: "UA" },
      { name: "British Airways", code: "BA" },
      { name: "Lufthansa", code: "LH" },
      { name: "Air France", code: "AF" },
      { name: "Emirates", code: "EK" },
      { name: "Qatar Airways", code: "QR" },
    ]

    const amenitiesPool = ["wifi", "entertainment", "meals", "drinks", "power", "comfort"]
    const aircraftTypes = ["Boeing 737", "Airbus A320", "Boeing 777", "Airbus A350", "Boeing 787"]

    const flights: Flight[] = []
    const numFlights = 12 + Math.floor(Math.random() * 8)

    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)]
      const departureHour = 6 + Math.floor(Math.random() * 16)
      const departureMinute = Math.floor(Math.random() * 60)
      const durationHours = 2 + Math.floor(Math.random() * 8)
      const durationMinutes = Math.floor(Math.random() * 60)

      const basePrice =
        travelClass === "economy"
          ? 200
          : travelClass === "premium-economy"
            ? 400
            : travelClass === "business"
              ? 800
              : 1500
      const price = basePrice + Math.floor(Math.random() * basePrice * 0.5)
      const originalPrice = price + Math.floor(Math.random() * 200) + 50
      const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.8 ? 2 : 1

      // Random amenities
      const flightAmenities = amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3))

      // CO2 calculation (mock)
      const co2Base = stops === 0 ? 150 : stops === 1 ? 180 : 220
      const co2Emission = co2Base + Math.floor(Math.random() * 100)

      // Popularity and deal types
      const popularityOptions: ("high" | "medium" | "low")[] = ["high", "medium", "low"]
      const popularity = popularityOptions[Math.floor(Math.random() * popularityOptions.length)]

      let dealType: "best-price" | "fastest" | "popular" | undefined
      if (Math.random() > 0.7) {
        const dealTypes: ("best-price" | "fastest" | "popular")[] = ["best-price", "fastest", "popular"]
        dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)]
      }

      flights.push({
        id: `FL${1000 + i}`,
        airline: airline.name,
        flightNumber: `${airline.code}${100 + i}`,
        departure: {
          airport: `${from.substring(0, 3).toUpperCase()}`,
          city: from,
          time: `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
          date: date,
          terminal: `T${Math.floor(Math.random() * 4) + 1}`,
        },
        arrival: {
          airport: `${to.substring(0, 3).toUpperCase()}`,
          city: to,
          time: `${(departureHour + durationHours).toString().padStart(2, "0")}:${((departureMinute + durationMinutes) % 60).toString().padStart(2, "0")}`,
          date: date,
          terminal: `T${Math.floor(Math.random() * 4) + 1}`,
        },
        duration: `${durationHours}h ${durationMinutes}m`,
        price,
        originalPrice,
        class: travelClass,
        stops,
        aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
        rating: 3.5 + Math.random() * 1.5,
        amenities: flightAmenities,
        co2Emission,
        popularity,
        dealType,
        refundable: Math.random() > 0.5,
      })
    }

    return flights.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") return Number.parseInt(a.duration) - Number.parseInt(b.duration)
      if (sortBy === "departure") return a.departure.time.localeCompare(b.departure.time)
      return 0
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (fromCity && toCity && departureDate) {
      performSearch()
    }
  }

  const toggleSaveFlight = (flightId: string) => {
    const updated = savedFlights.includes(flightId)
      ? savedFlights.filter((id) => id !== flightId)
      : [...savedFlights, flightId]

    setSavedFlights(updated)
    localStorage.setItem("savedFlights", JSON.stringify(updated))
  }

  const filteredFlights = flights.filter((flight) => {
    if (flight.price > maxPrice) return false
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false
    if (directOnly && flight.stops > 0) return false
    return true
  })

  const getDealBadge = (dealType: string) => {
    switch (dealType) {
      case "best-price":
        return (
          <Badge className="bg-white/10 text-white/80 border-white/20 text-[10px] px-2 py-0.5 rounded-full">
            Best Price
          </Badge>
        )
      case "fastest":
        return (
          <Badge className="bg-white/10 text-white/80 border-white/20 text-[10px] px-2 py-0.5 rounded-full">
            Fastest
          </Badge>
        )
      case "popular":
        return (
          <Badge className="bg-white/10 text-white/80 border-white/20 text-[10px] px-2 py-0.5 rounded-full">
            Popular
          </Badge>
        )
      default:
        return null
    }
  }

  const popularDestinations = [
    { city: "New York", code: "JFK", flights: 156 },
    { city: "London", code: "LHR", flights: 142 },
    { city: "Paris", code: "CDG", flights: 128 },
    { city: "Tokyo", code: "HND", flights: 98 },
    { city: "Dubai", code: "DXB", flights: 87 },
    { city: "Barcelona", code: "BCN", flights: 76 },
  ]

  return (
    <div className="min-h-screen bg-black p-3 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-4 relative z-10">
        {/* Header */}
        <div className="relative bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-medium text-white mb-2 tracking-tight">Flights</h1>
            </div>

            {/* Travel Type Badges */}
            <div className="flex space-x-2">
              <Badge
                onClick={() => setTravelType("business")}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ${
                  travelType === "business"
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
                }`}
              >
                <Briefcase className="h-4 w-4 mr-2 text-white/70" />
                Business Travel
              </Badge>
              <Badge
                onClick={() => setTravelType("personal")}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ${
                  travelType === "personal"
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4 mr-2 text-white/70" />
                Personal Travel
              </Badge>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="flex space-x-6 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      value="round-trip"
                      checked={tripType === "round-trip"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        tripType === "round-trip"
                          ? "border-white/50 bg-white/10"
                          : "border-white/30 group-hover:border-white/50"
                      }`}
                    >
                      {tripType === "round-trip" && (
                        <div className="w-2 h-2 bg-white/70 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-white font-light">Round Trip</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      value="one-way"
                      checked={tripType === "one-way"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        tripType === "one-way"
                          ? "border-white/50 bg-white/10"
                          : "border-white/30 group-hover:border-white/50"
                      }`}
                    >
                      {tripType === "one-way" && (
                        <div className="w-2 h-2 bg-white/70 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-white font-light">One Way</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="space-y-3">
                  <Label className="text-white font-light">From</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    <Input
                      placeholder="Departure city"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg hover:bg-white/10 focus:bg-white/10 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-light">To</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    <Input
                      placeholder="Destination city"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg hover:bg-white/10 focus:bg-white/10 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-light">Departure</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    <Input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10 focus:bg-white/10 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-light">Return</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10 focus:bg-white/10 transition-all duration-200 disabled:opacity-50"
                      disabled={tripType === "one-way"}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-light">Passengers</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-light">Class</Label>
                  <Select value={travelClass} onValueChange={setTravelClass}>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-white/10 hover:bg-white/15 text-white font-light py-3 px-8 rounded-lg border border-white/10 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Searching for flights...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-3 text-white/70" />
                    Search Flights
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        {flights.length === 0 && !loading && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-light text-white mb-4">Popular Business Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {popularDestinations.map((destination) => (
                  <div
                    key={destination.code}
                    className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 group hover:bg-white/10"
                    onClick={() => {
                      setToCity(destination.city)
                    }}
                  >
                    <div className="h-24 relative overflow-hidden">
                      <img
                        src={cityImages[destination.city] || "/placeholder.svg?height=120&width=200"}
                        alt={destination.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/20 text-white text-[10px] px-2 py-1 backdrop-blur-sm rounded-full">
                          {destination.flights} flights
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-white font-light text-sm">{destination.city}</p>
                        <p className="text-white/80 text-xs font-light">{destination.code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {flights.length > 0 && (
          <>
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center space-x-3">
                  <ArrowUpDown className="h-5 w-5 text-white/70" />
                  <span className="text-white/70 font-light">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-10 text-sm w-[140px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Best Price</SelectItem>
                      <SelectItem value="duration">Shortest</SelectItem>
                      <SelectItem value="departure">Earliest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-3">
                  <Filter className="h-5 w-5 text-white/70" />
                  <Badge
                    onClick={() => setDirectOnly(!directOnly)}
                    className={`cursor-pointer rounded-full px-4 py-2 transition-all duration-300 ${
                      directOnly
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    Direct Only
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-white/70 font-light">{filteredFlights.length} flights found</span>
              </div>
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              {filteredFlights.map((flight, index) => (
                <Card
                  key={flight.id}
                  className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 group backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1">
                        {/* Airline Section */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <Plane className="h-6 w-6 text-white/70" />
                          </div>
                          <div>
                            <p className="text-white font-light text-lg">{flight.airline}</p>
                            <p className="text-white/60 text-sm font-light">
                              {flight.flightNumber} • {flight.aircraft}
                            </p>
                          </div>
                        </div>

                        {/* Flight Route */}
                        <div className="flex items-center justify-between flex-1 relative">
                          <div className="text-center">
                            <div className="text-2xl font-light text-white">{flight.departure.time}</div>
                            <div className="text-white/80 font-light">{flight.departure.airport}</div>
                            <div className="text-white/60 text-sm font-light">{flight.departure.city}</div>
                          </div>

                          <div className="flex flex-col items-center mx-8 relative">
                            <div className="text-white/60 text-sm mb-2 font-light">{flight.duration}</div>
                            <div className="w-24 h-px bg-white/20 relative">
                              <div className="absolute right-0 top-0 w-3 h-3 bg-white/60 rounded-full transform translate-x-1.5 -translate-y-1.5">
                                <ArrowRight className="h-2 w-2 text-black absolute top-0.5 left-0.5" />
                              </div>
                            </div>
                            <div className="text-white/60 text-sm mt-2 font-light">
                              {flight.stops === 0 ? (
                                <span className="text-white/80 font-light">Direct</span>
                              ) : (
                                <span className="text-white/60">
                                  {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-light text-white">{flight.arrival.time}</div>
                            <div className="text-white/80 font-light">{flight.arrival.airport}</div>
                            <div className="text-white/60 text-sm font-light">{flight.arrival.city}</div>
                          </div>
                        </div>

                        {/* Destination Image */}
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-12 rounded-md overflow-hidden">
                            <img
                              src={cityImages[flight.arrival.city] || "/placeholder.svg?height=48&width=64"}
                              alt={flight.arrival.city}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions Section */}
                      <div className="flex items-center justify-between lg:flex-col lg:items-end gap-6">
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-2 mb-2">
                            {flight.dealType && getDealBadge(flight.dealType)}
                          </div>
                          <div className="flex items-baseline space-x-2">
                            {flight.originalPrice && (
                              <span className="text-white/50 text-lg line-through font-light">
                                ${flight.originalPrice}
                              </span>
                            )}
                            <div className="text-3xl font-light text-white">${flight.price}</div>
                          </div>
                          <div className="text-white/60 text-sm capitalize font-light">{flight.class}</div>
                        </div>

                        <div className="flex flex-col space-y-3">
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={() => toggleSaveFlight(flight.id)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                            >
                              {savedFlights.includes(flight.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-white/70" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-white/70" />
                              )}
                            </Button>
                            <Button className="bg-white/10 hover:bg-white/15 text-white font-light rounded-lg px-6 py-2 border border-white/10 transition-all duration-300">
                              Select Flight
                            </Button>
                          </div>

                          {/* Additional Info */}
                          <div className="flex items-center space-x-4 text-xs text-white/50 font-light">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-white/50" />
                              {flight.popularity} demand
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-white/20 border-t-white/50 rounded-full animate-spin mx-auto mb-6"></div>
                <Plane className="h-6 w-6 text-white/70 absolute top-5 left-1/2 transform -translate-x-1/2" />
              </div>
              <p className="text-white/70 text-lg font-light">Searching for the best flights...</p>
              <p className="text-white/50 text-sm mt-2 font-light">Comparing prices from 500+ airlines</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black p-3">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  )
}
