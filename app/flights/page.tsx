"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirportSearch } from "@/components/ui/airport-search"
import { AIQuickInput } from "@/components/ui/ai-quick-input"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Plane,
  Clock,
  ArrowRightLeft,
  Ticket,
  CheckCircle,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react"
import flightsData from "@/data/flights.json"
import citiesData from "@/data/cities.json"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  departureDate: string
  duration: string
  price: number
  currency?: string
  basePrice?: number
  taxAmount?: number
  class: string
  stops: number
  stopCities?: string[]
  amenities: string[]
  travelPolicy: "Compliant" | "Non-Compliant"
  carbonEmission?: string
  aircraftType?: string
  operatingCarrier?: string
  conditions?: any
  expiresAt?: string
  owner?: any
  segments?: any[]
}

const airlines = {
  "American Airlines": { code: "AA", logo: "/placeholder.svg?width=32&height=32&text=AA" },
  "Delta Air Lines": { code: "DL", logo: "/placeholder.svg?width=32&height=32&text=DL" },
  "United Airlines": { code: "UA", logo: "/placeholder.svg?width=32&height=32&text=UA" },
  "British Airways": { code: "BA", logo: "/placeholder.svg?width=32&height=32&text=BA" },
  "Air France": { code: "AF", logo: "/placeholder.svg?width=32&height=32&text=AF" },
  Lufthansa: { code: "LH", logo: "/placeholder.svg?width=32&height=32&text=LH" },
  Emirates: { code: "EK", logo: "/placeholder.svg?width=32&height=32&text=EK" },
  "Qatar Airways": { code: "QR", logo: "/placeholder.svg?width=32&height=32&text=QR" },
  "Singapore Airlines": { code: "SQ", logo: "/placeholder.svg?width=32&height=32&text=SQ" },
  "Turkish Airlines": { code: "TK", logo: "/placeholder.svg?width=32&height=32&text=TK" },
}

export default function FlightsPage() {
  const [allFlights, setAllFlights] = useState<Flight[]>(flightsData as Flight[])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const [useDuffelAPI, setUseDuffelAPI] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Search form state
  const [originCity, setOriginCity] = useState("JFK")
  const [destinationCity, setDestinationCity] = useState("")
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0])
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")

  // Filter state
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
    // Check URL params for pre-filled search
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const destination = urlParams.get("destination")
      if (destination) {
        setDestinationCity(destination)
        performSearch()
      }
    }
  }, [])

  const performSearch = async () => {
    setLoading(true)
    setSearchError(null)

    try {
      if (useDuffelAPI && originCity && destinationCity) {
        console.log("Searching with Duffel API...")

        const response = await fetch("/api/flights/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: originCity.toUpperCase(),
            destination: destinationCity.toUpperCase(),
            departureDate: departureDate,
            passengers: passengers,
            cabinClass: travelClass,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          console.log("Duffel search successful:", data.data.length, "flights found")
          setFilteredFlights(data.data)
        } else {
          console.error("Duffel API error:", data.error)
          setSearchError(data.error || "Failed to search flights")
          // Fallback to mock data
          performMockSearch()
        }
      } else {
        // Use mock data
        performMockSearch()
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("Network error occurred")
      // Fallback to mock data
      performMockSearch()
    }

    setLoading(false)
    setSelectedFlightId(null)
  }

  const performMockSearch = () => {
    console.log("Using mock data...")
    const results = allFlights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(originCity.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destinationCity.toLowerCase()) &&
        new Date(flight.departureDate) >= new Date(),
    )
    setFilteredFlights(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredFlights = useMemo(() => {
    return [...filteredFlights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") {
        const getDurationMinutes = (duration: string) => {
          const match = duration.match(/(\d+)h?\s*(\d+)?m?/)
          if (match) {
            const hours = Number.parseInt(match[1]) || 0
            const minutes = Number.parseInt(match[2]) || 0
            return hours * 60 + minutes
          }
          return 0
        }
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
      }
      if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime)
      return 0
    })
  }, [filteredFlights, sortBy])

  const handleBookFlight = async () => {
    if (!selectedFlightId) return

    const flight = sortedAndFilteredFlights.find((f) => f.id === selectedFlightId)
    if (!flight) return

    setLoading(true)

    try {
      if (useDuffelAPI) {
        // Book with Duffel API
        const response = await fetch("/api/flights/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerId: flight.id,
            passengers: [
              {
                type: "adult",
                title: "mr",
                given_name: "John",
                family_name: "Doe",
                born_on: "1990-01-01",
                email: "john.doe@example.com",
                phone_number: "+1234567890",
              },
            ],
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setBookingData(data.booking)
          setShowBookingConfirmation(true)
        } else {
          console.error("Booking error:", data.error)
          // Fallback to mock booking
          createMockBooking(flight)
        }
      } else {
        // Mock booking
        createMockBooking(flight)
      }
    } catch (error) {
      console.error("Booking error:", error)
      createMockBooking(flight)
    }

    setLoading(false)
  }

  const createMockBooking = (flight: Flight) => {
    const mockBooking = {
      id: `booking_${Date.now()}`,
      reference: `SPX${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "confirmed",
      flight: flight,
      created_at: new Date().toISOString(),
    }
    setBookingData(mockBooking)
    setShowBookingConfirmation(true)
  }

  const selectedFlightDetails = selectedFlightId
    ? sortedAndFilteredFlights.find((f) => f.id === selectedFlightId)
    : null

  if (showBookingConfirmation && bookingData) {
    const flight = bookingData.flight || selectedFlightDetails

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
              Your flight from {flight?.origin} to {flight?.destination} is booked.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> {bookingData.reference}
              </p>
              <p>
                <span className="text-white/60">Flight:</span> {flight?.airline} {flight?.flightNumber}
              </p>
              <p>
                <span className="text-white/60">Date:</span> {flight?.departureDate} at {flight?.departureTime}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${flight?.price}
              </p>
              <p>
                <span className="text-white/60">Status:</span>
                <span className="text-green-400 ml-1 capitalize">{bookingData.status}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedFlightId(null)
                setBookingData(null)
              }}
              className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
            >
              Book Another Flight
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
        <header className="bg-white/5 border border-white/10 rounded-md p-6 md:p-8 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light text-white tracking-tight">Flight Search</h1>
              <p className="text-white/70 text-sm font-light mt-1">Find and book your perfect business flight</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-white/70">Live API</span>
              <button
                onClick={() => setUseDuffelAPI(!useDuffelAPI)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useDuffelAPI ? "bg-blue-600" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useDuffelAPI ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* AI Quick Input */}
        <AIQuickInput placeholder="Ask about flights, destinations, or travel tips..." className="mb-4" />

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {useDuffelAPI ? (
                  <AirportSearch
                    placeholder="Origin (e.g. JFK, New York)"
                    value={originCity}
                    onChange={setOriginCity}
                  />
                ) : (
                  <InputWithIcon
                    icon={<MapPin className="h-4 w-4 text-white/50" />}
                    placeholder="Origin (e.g. New York)"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                  />
                )}

                {useDuffelAPI ? (
                  <AirportSearch
                    placeholder="Destination (e.g. LHR, London)"
                    value={destinationCity}
                    onChange={setDestinationCity}
                  />
                ) : (
                  <InputWithIcon
                    icon={<MapPin className="h-4 w-4 text-white/50" />}
                    placeholder="Destination (e.g. London)"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                  />
                )}

                <InputWithIcon
                  icon={<Calendar className="h-4 w-4 text-white/50" />}
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-md hover:bg-white/10">
                    <Users className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((p) => (
                      <SelectItem key={p} value={String(p)}>
                        {p} Passenger{p > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-md hover:bg-white/10">
                    <Ticket className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["economy", "premium_economy", "business", "first"].map((tc) => (
                      <SelectItem key={tc} value={tc} className="capitalize">
                        {tc.replace("_", " ")} Class
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto bg-white text-black hover:bg-white/90 rounded-full font-light"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                {loading ? "Searching..." : useDuffelAPI ? "Search Live Flights" : "Search Flights"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* API Status */}
        {useDuffelAPI && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <p className="text-blue-400 text-sm font-light">Live API Mode: Searching real flights via Duffel API</p>
            </div>
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-sm font-light">{searchError}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && filteredFlights.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-md border border-white/10">
              <h2 className="text-lg font-light text-white">{sortedAndFilteredFlights.length} flights found</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-transparent border-none text-white/70 h-8 text-xs w-auto focus:ring-0">
                  <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["price", "duration", "departure"].map((s) => (
                    <SelectItem key={s} value={s} className="capitalize text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sortedAndFilteredFlights.map((flight, index) => (
              <Card
                key={flight.id}
                className={`bg-white/5 border hover:bg-white/10 transition-all ${selectedFlightId === flight.id ? "border-blue-500/50 ring-2 ring-blue-500/30" : "border-white/10"}`}
                style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out forwards`, opacity: 0 }}
              >
                <CardContent
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedFlightId(flight.id === selectedFlightId ? null : flight.id)}
                >
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex md:flex-col items-center md:items-start md:w-1/6 gap-2">
                      <img
                        src={
                          airlines[flight.airline as keyof typeof airlines]?.logo ||
                          "/placeholder.svg?width=32&height=32&text=FL" ||
                          "/placeholder.svg"
                        }
                        alt={flight.airline}
                        className="h-8 w-8 rounded-md bg-white/10 p-1"
                      />
                      <div>
                        <p className="text-sm font-light text-white">{flight.airline}</p>
                        <p className="text-xs text-white/50 font-light">{flight.flightNumber}</p>
                        {flight.operatingCarrier && (
                          <p className="text-xs text-white/40 font-light">Operated by {flight.operatingCarrier}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 items-center text-center md:text-left">
                      <div>
                        <p className="text-lg font-light text-white">{flight.departureTime}</p>
                        <p className="text-xs text-white/70 font-light">{flight.originCode}</p>
                      </div>
                      <div className="px-2">
                        <Clock className="h-3.5 w-3.5 text-white/50 mx-auto mb-0.5" />
                        <p className="text-xs text-white/70 font-light">{flight.duration}</p>
                        <div className="w-full h-px bg-white/20 my-0.5"></div>
                        <p className="text-xs text-white/50 font-light">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </p>
                        {flight.stopCities && flight.stopCities.length > 0 && (
                          <p className="text-xs text-white/40 font-light">via {flight.stopCities.join(", ")}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-light text-white">{flight.arrivalTime}</p>
                        <p className="text-xs text-white/70 font-light">{flight.destinationCode}</p>
                      </div>
                    </div>
                    <div className="md:w-1/6 flex flex-col items-center md:items-end justify-center">
                      <p className="text-xl font-light text-white">
                        ${flight.price}
                        {flight.currency && flight.currency !== "USD" && (
                          <span className="text-xs text-white/50 ml-1">{flight.currency}</span>
                        )}
                      </p>
                      <p className="text-xs text-white/50 capitalize font-light">{flight.class.replace("_", " ")}</p>
                      {flight.basePrice && flight.taxAmount && (
                        <p className="text-xs text-white/40 font-light">
                          Base: ${flight.basePrice} + Tax: ${flight.taxAmount}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedFlightId === flight.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/70 font-light">
                            <span className="font-light text-white/90">Aircraft:</span>{" "}
                            {flight.aircraftType || "Boeing 737"}
                          </p>
                          <p className="text-white/70 font-light">
                            <span className="font-light text-white/90">Policy:</span>{" "}
                            <span
                              className={flight.travelPolicy === "Compliant" ? "text-green-400" : "text-orange-400"}
                            >
                              {flight.travelPolicy}
                            </span>
                          </p>
                          {flight.expiresAt && (
                            <p className="text-white/70 font-light">
                              <span className="font-light text-white/90">Expires:</span>{" "}
                              {new Date(flight.expiresAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-light text-white/90 mb-0.5">Amenities:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {flight.amenities.map((amenity) => (
                              <Badge
                                key={amenity}
                                variant="secondary"
                                className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5 font-light"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Flight Conditions */}
                      {flight.conditions && (
                        <div className="bg-white/5 p-2 rounded border border-white/10">
                          <p className="font-light text-white/90 mb-1 text-xs">Booking Conditions:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {flight.conditions.change_before_departure && (
                              <div>
                                <span className="text-white/70">Changes: </span>
                                <span
                                  className={
                                    flight.conditions.change_before_departure.allowed
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {flight.conditions.change_before_departure.allowed ? "Allowed" : "Not Allowed"}
                                </span>
                                {flight.conditions.change_before_departure.penalty_amount && (
                                  <span className="text-white/50">
                                    {" "}
                                    (${flight.conditions.change_before_departure.penalty_amount})
                                  </span>
                                )}
                              </div>
                            )}
                            {flight.conditions.cancel_before_departure && (
                              <div>
                                <span className="text-white/70">Cancellation: </span>
                                <span
                                  className={
                                    flight.conditions.cancel_before_departure.allowed
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {flight.conditions.cancel_before_departure.allowed ? "Allowed" : "Not Allowed"}
                                </span>
                                {flight.conditions.cancel_before_departure.penalty_amount && (
                                  <span className="text-white/50">
                                    {" "}
                                    (${flight.conditions.cancel_before_departure.penalty_amount})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleBookFlight}
                        size="sm"
                        className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full font-light"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {loading ? "Booking..." : "Book This Flight"}
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
            <p className="text-white/70 font-light">
              {useDuffelAPI ? "Searching live flights..." : "Searching for flights..."}
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredFlights.length === 0 && destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Plane className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-light text-white">No Flights Found</h3>
              <p className="text-white/70 mt-1 font-light">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Plane className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-light text-white">Find Your Perfect Flight</h3>
              <p className="text-white/70 mt-1 font-light">Search for flights to your destination.</p>
            </CardContent>
          </Card>
        )}

        {/* Popular Destinations */}
        <div className="mt-8">
          <h3 className="text-xl font-light text-white mb-4">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {citiesData.cities.slice(0, 12).map((city) => (
              <div
                key={city.id}
                onClick={() => {
                  setDestinationCity(city.airportCode)
                  performSearch()
                }}
                className="bg-white/5 border border-white/10 rounded-md p-3 cursor-pointer hover:bg-white/10 transition-all group"
              >
                <div className="relative h-20 w-full rounded-md overflow-hidden mb-2">
                  <Image
                    src={city.image || `/placeholder.svg?height=80&width=120&text=${city.name}`}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-light text-white">{city.name}</p>
                  <p className="text-xs text-white/50 font-light">{city.airportCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-md hover:bg-white/10 focus:ring-1 focus:ring-white/20 font-light"
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
  if (!document.head.querySelector("style[data-flights-animations]")) {
    style.setAttribute("data-flights-animations", "true")
    document.head.appendChild(style)
  }
}
