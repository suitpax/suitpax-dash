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
import { Search, MapPin, Calendar, Plane, Star, Filter, ArrowUpDown, Bookmark, BookmarkCheck } from "lucide-react"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
  }
  duration: string
  price: number
  class: string
  stops: number
  aircraft: string
  rating: number
}

function FlightsContent() {
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [savedFlights, setSavedFlights] = useState<string[]>([])

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate realistic flight data
    const generatedFlights = generateFlights(fromCity, toCity, departureDate)
    setFlights(generatedFlights)
    setLoading(false)
  }

  const generateFlights = (from: string, to: string, date: string): Flight[] => {
    const airlines = [
      "American Airlines",
      "Delta",
      "United",
      "British Airways",
      "Lufthansa",
      "Air France",
      "Emirates",
      "Qatar Airways",
    ]

    const flights: Flight[] = []
    const numFlights = 8 + Math.floor(Math.random() * 7)

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
      const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.8 ? 2 : 1

      flights.push({
        id: `FL${1000 + i}`,
        airline,
        flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + i}`,
        departure: {
          airport: `${from.substring(0, 3).toUpperCase()}`,
          city: from,
          time: `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
          date: date,
        },
        arrival: {
          airport: `${to.substring(0, 3).toUpperCase()}`,
          city: to,
          time: `${(departureHour + durationHours).toString().padStart(2, "0")}:${((departureMinute + durationMinutes) % 60).toString().padStart(2, "0")}`,
          date: date,
        },
        duration: `${durationHours}h ${durationMinutes}m`,
        price,
        class: travelClass,
        stops,
        aircraft: "Boeing 737",
        rating: 3.5 + Math.random() * 1.5,
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

  const popularDestinations = [
    { city: "New York", code: "NYC", image: "/placeholder.svg?height=120&width=200&text=NYC" },
    { city: "London", code: "LHR", image: "/placeholder.svg?height=120&width=200&text=London" },
    { city: "Paris", code: "CDG", image: "/placeholder.svg?height=120&width=200&text=Paris" },
    { city: "Tokyo", code: "NRT", image: "/placeholder.svg?height=120&width=200&text=Tokyo" },
    { city: "Dubai", code: "DXB", image: "/placeholder.svg?height=120&width=200&text=Dubai" },
    { city: "Singapore", code: "SIN", image: "/placeholder.svg?height=120&width=200&text=Singapore" },
  ]

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Flight Search</h1>
          <p className="text-white/70">Find and book the perfect flights for your business travel</p>
        </div>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Trip Type */}
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="round-trip"
                    checked={tripType === "round-trip"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="text-white"
                  />
                  <span className="text-white text-sm">Round Trip</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="one-way"
                    checked={tripType === "one-way"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="text-white"
                  />
                  <span className="text-white text-sm">One Way</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Departure city"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Destination city"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Departure</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Return</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      disabled={tripType === "one-way"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Passengers</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
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

                <div className="space-y-2">
                  <Label className="text-white">Class</Label>
                  <Select value={travelClass} onValueChange={setTravelClass}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
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

              <Button type="submit" className="bg-white text-black hover:bg-white/90 rounded-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Flights
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        {flights.length === 0 && !loading && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Popular Business Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularDestinations.map((destination) => (
                  <div
                    key={destination.code}
                    className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all group"
                    onClick={() => {
                      setToCity(destination.city)
                    }}
                  >
                    <div className="h-20 relative">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.city}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-1 left-2 right-2">
                        <p className="text-white font-medium text-xs">{destination.city}</p>
                        <p className="text-white/70 text-[10px]">{destination.code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {flights.length > 0 && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-white/70" />
                  <span className="text-white/70 text-sm">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="departure">Departure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <Badge
                    onClick={() => setDirectOnly(!directOnly)}
                    className={`cursor-pointer rounded-full ${
                      directOnly ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Direct Only
                  </Badge>
                </div>
              </div>

              <div className="text-white/70 text-sm">{filteredFlights.length} flights found</div>
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card key={flight.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1">
                        {/* Airline */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <Plane className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{flight.airline}</p>
                            <p className="text-white/50 text-xs">{flight.flightNumber}</p>
                          </div>
                        </div>

                        {/* Flight Details */}
                        <div className="flex items-center justify-between flex-1">
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">{flight.departure.time}</div>
                            <div className="text-white/70 text-sm">{flight.departure.airport}</div>
                            <div className="text-white/50 text-xs">{flight.departure.city}</div>
                          </div>

                          <div className="flex flex-col items-center mx-4">
                            <div className="text-white/50 text-xs mb-1">{flight.duration}</div>
                            <div className="w-16 h-px bg-white/20 relative">
                              <div className="absolute right-0 top-0 w-2 h-2 bg-white/50 rounded-full transform translate-x-1 -translate-y-0.5" />
                            </div>
                            <div className="text-white/50 text-xs mt-1">
                              {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-xl font-bold text-white">{flight.arrival.time}</div>
                            <div className="text-white/70 text-sm">{flight.arrival.airport}</div>
                            <div className="text-white/50 text-xs">{flight.arrival.city}</div>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">${flight.price}</div>
                          <div className="text-white/50 text-sm">{flight.class}</div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white/70 text-xs ml-1">{flight.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => toggleSaveFlight(flight.id)}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {savedFlights.includes(flight.id) ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Button className="bg-white text-black hover:bg-white/90 rounded-full">Select Flight</Button>
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
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/70">Searching for the best flights...</p>
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
