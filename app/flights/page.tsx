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
  MoveHorizontalIcon as AdjustmentsHorizontalIcon,
  ClockIcon,
  ArrowLeftIcon as ArrowPathIcon,
} from "lucide-react"
import flightsData from "@/data/flights.json"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  duration: string
  price: number
  class: string
}

function FlightsContent() {
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>(flightsData as Flight[])
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")
  const [activeTab, setActiveTab] = useState<"search" | "results" | "saved">("search")
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
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

    if (from || to) {
      setActiveTab("results")
    }
  }, [searchParams])

  const filteredFlights = flights
    .filter((flight) => {
      const matchesFrom = !fromCity || flight.departure.city.toLowerCase().includes(fromCity.toLowerCase())
      const matchesTo = !toCity || flight.arrival.city.toLowerCase().includes(toCity.toLowerCase())
      return matchesFrom && matchesTo
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") return a.duration.localeCompare(b.duration)
      if (sortBy === "departure") return a.departure.time.localeCompare(b.departure.time)
      return 0
    })

  const handleSearch = () => {
    setActiveTab("results")
  }

  const popularDestinations = [
    { city: "New York", code: "NYC", image: "/placeholder.svg?height=100&width=100" },
    { city: "London", code: "LON", image: "/placeholder.svg?height=100&width=100" },
    { city: "Tokyo", code: "TYO", image: "/placeholder.svg?height=100&width=100" },
    { city: "Paris", code: "PAR", image: "/placeholder.svg?height=100&width=100" },
    { city: "Madrid", code: "MAD", image: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Flight Search</h1>
          <p className="text-white/70">Find the best flights for your business travel</p>
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
            Search Flights
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "results"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1.5" />
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
            <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
            Saved Flights
          </button>
        </div>

        {/* Iconos de información */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/5 rounded-full">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">Flexibility</h3>
                <p className="text-[10px] text-white/50">No change fees</p>
              </div>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/5 rounded-full">
                <MapPinIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">Destinations</h3>
                <p className="text-[10px] text-white/50">+200 cities</p>
              </div>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/5 rounded-full">
                <UsersIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">Group Travel</h3>
                <p className="text-[10px] text-white/50">Special rates</p>
              </div>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/5 rounded-full">
                <ArrowPathIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">Airlines</h3>
                <p className="text-[10px] text-white/50">+50 companies</p>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "search" && (
          <>
            {/* Search Form */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-white">
                    From
                  </Label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="from"
                      placeholder="Departure city"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to" className="text-white">
                    To
                  </Label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="to"
                      placeholder="Destination city"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure" className="text-white">
                    Departure
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="departure"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return" className="text-white">
                    Return
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="return"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      disabled={tripType === "one-way"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers" className="text-white">
                    Passengers
                  </Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trip-type" className="text-white">
                    Trip Type
                  </Label>
                  <Select value={tripType} onValueChange={setTripType}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="round-trip">Round Trip</SelectItem>
                      <SelectItem value="one-way">One Way</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSearch} className="mt-4 bg-white text-black hover:bg-white/90 rounded-full">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Flights
              </Button>
            </div>

            {/* Popular Destinations */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Popular Business Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {popularDestinations.map((destination, index) => (
                  <div
                    key={index}
                    className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                    onClick={() => {
                      setToCity(destination.city)
                      setActiveTab("search")
                    }}
                  >
                    <div className="h-24 relative">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.city}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-medium text-sm">{destination.city}</p>
                        <p className="text-white/70 text-xs">{destination.code}</p>
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
            {/* Sorting and Filters */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="departure">Departure Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer rounded-full">
                    Direct Flights
                  </Badge>
                  <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer rounded-full">
                    Morning Departure
                  </Badge>
                  <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer rounded-full">
                    Business Class
                  </Badge>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{filteredFlights.length} flights found</h2>
            </div>

            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{flight.departure.time}</div>
                        <div className="text-white/70 text-sm">{flight.departure.airport}</div>
                        <div className="text-white/50 text-xs">{flight.departure.city}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-white/50 text-sm mb-1">{flight.duration}</div>
                        <div className="w-16 h-px bg-white/20 relative">
                          <div className="absolute right-0 top-0 w-2 h-2 bg-white/50 rounded-full transform translate-x-1 -translate-y-0.5"></div>
                        </div>
                        <div className="text-white/50 text-xs mt-1">Direct</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{flight.arrival.time}</div>
                        <div className="text-white/70 text-sm">{flight.arrival.airport}</div>
                        <div className="text-white/50 text-xs">{flight.arrival.city}</div>
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-white">${flight.price}</div>
                      <div className="text-white/50 text-sm">{flight.class}</div>
                      <Button className="mt-2 bg-white text-black hover:bg-white/90 rounded-full">Select Flight</Button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-white/70">{flight.airline}</span>
                      <span className="text-white/50">{flight.flightNumber}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20 rounded-full">
                      {flight.class}
                    </Badge>
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
                <ClockIcon className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Saved Flights</h3>
              <p className="text-white/70 max-w-md mx-auto">
                You haven't saved any flights yet. Search for flights and save them for quick access later.
              </p>
              <Button
                onClick={() => setActiveTab("search")}
                className="mt-4 bg-white text-black hover:bg-white/90 rounded-full"
              >
                Search Flights
              </Button>
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
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-white/10 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  )
}
