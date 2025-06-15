"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirportSearch } from "@/components/ui/airport-search"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  TicketIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import flightsData from "@/data/flights.json"

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

interface FlightSegment {
  id: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
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
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("round-trip")
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    {
      id: "1",
      origin: "JFK",
      destination: "",
      departureDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  ])

  // Enhanced search form state
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  })
  const [travelClass, setTravelClass] = useState("economy")
  const [flexibleDates, setFlexibleDates] = useState(false)
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false)
  const [preferredAirlines, setPreferredAirlines] = useState<string[]>([])

  // Filter state
  const [sortBy, setSortBy] = useState("price")
  const [filters, setFilters] = useState({
    maxPrice: 5000,
    maxStops: 3,
    departureTime: "any",
    airlines: [] as string[],
  })

  useEffect(() => {
    // Check URL params for pre-filled search
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const destination = urlParams.get("destination")
      if (destination) {
        setFlightSegments((prev) => [{ ...prev[0], destination }])
        performSearch()
      }
    }
  }, [])

  const addFlightSegment = () => {
    const newSegment: FlightSegment = {
      id: Date.now().toString(),
      origin: flightSegments[flightSegments.length - 1]?.destination || "",
      destination: "",
      departureDate: new Date().toISOString().split("T")[0],
    }
    setFlightSegments([...flightSegments, newSegment])
  }

  const removeFlightSegment = (id: string) => {
    if (flightSegments.length > 1) {
      setFlightSegments(flightSegments.filter((segment) => segment.id !== id))
    }
  }

  const updateFlightSegment = (id: string, updates: Partial<FlightSegment>) => {
    setFlightSegments(flightSegments.map((segment) => (segment.id === id ? { ...segment, ...updates } : segment)))
  }

  const performSearch = async () => {
    setLoading(true)
    setSearchError(null)

    try {
      if (useDuffelAPI && flightSegments[0].origin && flightSegments[0].destination) {
        console.log("Searching with Duffel API...")

        const searchPayload = {
          segments: flightSegments.map((segment) => ({
            origin: segment.origin.toUpperCase(),
            destination: segment.destination.toUpperCase(),
            departure_date: segment.departureDate,
          })),
          passengers: [
            ...Array(passengers.adults).fill({ type: "adult" }),
            ...Array(passengers.children).fill({ type: "child" }),
            ...Array(passengers.infants).fill({ type: "infant_without_seat" }),
          ],
          cabin_class: travelClass,
          return_date: tripType === "round-trip" ? flightSegments[0].returnDate : undefined,
        }

        const response = await fetch("/api/flights/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchPayload),
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
        flight.origin.toLowerCase().includes(flightSegments[0].origin.toLowerCase()) &&
        flight.destination.toLowerCase().includes(flightSegments[0].destination.toLowerCase()) &&
        new Date(flight.departureDate) >= new Date(flightSegments[0].departureDate),
    )
    setFilteredFlights(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredFlights = useMemo(() => {
    let filtered = [...filteredFlights]

    // Apply filters
    if (filters.maxPrice < 5000) {
      filtered = filtered.filter((flight) => flight.price <= filters.maxPrice)
    }
    if (filters.maxStops < 3) {
      filtered = filtered.filter((flight) => flight.stops <= filters.maxStops)
    }
    if (directFlightsOnly) {
      filtered = filtered.filter((flight) => flight.stops === 0)
    }
    if (filters.airlines.length > 0) {
      filtered = filtered.filter((flight) => filters.airlines.includes(flight.airline))
    }

    // Sort results
    return filtered.sort((a, b) => {
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
  }, [filteredFlights, sortBy, filters, directFlightsOnly])

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

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  if (showBookingConfirmation && bookingData) {
    const flight = bookingData.flight || selectedFlightDetails

    return (
      <div className="min-h-screen bg-black p-3 text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 w-full max-w-md backdrop-blur-sm">
          <CardHeader className="items-center">
            <div className="p-3 bg-green-500/20 rounded-full mb-3">
              <CheckCircleIcon className="h-10 w-10 text-green-400" />
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
              className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-lg"
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
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight">Flight Search</h1>
              <p className="text-white/70 text-sm mt-1">Find and book your perfect business flight</p>
            </div>
            <div className="flex items-center gap-2">
              <BoltIcon className="h-4 w-4 text-yellow-400" />
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
        </div>

        {/* Enhanced Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Trip Type Selector */}
            <Tabs value={tripType} onValueChange={(value) => setTripType(value as any)} className="mb-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="round-trip" className="text-white/70 data-[state=active]:text-white">
                  Round Trip
                </TabsTrigger>
                <TabsTrigger value="one-way" className="text-white/70 data-[state=active]:text-white">
                  One Way
                </TabsTrigger>
                <TabsTrigger value="multi-city" className="text-white/70 data-[state=active]:text-white">
                  Multi-City
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* Flight Segments */}
              <div className="space-y-4">
                {flightSegments.map((segment, index) => (
                  <div key={segment.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">
                        {tripType === "multi-city" ? `Flight ${index + 1}` : "Flight Details"}
                      </h3>
                      {tripType === "multi-city" && flightSegments.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFlightSegment(segment.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {useDuffelAPI ? (
                        <AirportSearch
                          placeholder="From (e.g. JFK, New York)"
                          value={segment.origin}
                          onChange={(value) => updateFlightSegment(segment.id, { origin: value })}
                        />
                      ) : (
                        <InputWithIcon
                          icon={<MapPinIcon className="h-4 w-4 text-white/50" />}
                          placeholder="From (e.g. New York)"
                          value={segment.origin}
                          onChange={(e) => updateFlightSegment(segment.id, { origin: e.target.value })}
                        />
                      )}

                      {useDuffelAPI ? (
                        <AirportSearch
                          placeholder="To (e.g. LHR, London)"
                          value={segment.destination}
                          onChange={(value) => updateFlightSegment(segment.id, { destination: value })}
                        />
                      ) : (
                        <InputWithIcon
                          icon={<MapPinIcon className="h-4 w-4 text-white/50" />}
                          placeholder="To (e.g. London)"
                          value={segment.destination}
                          onChange={(e) => updateFlightSegment(segment.id, { destination: e.target.value })}
                        />
                      )}

                      <InputWithIcon
                        icon={<CalendarIcon className="h-4 w-4 text-white/50" />}
                        type="date"
                        value={segment.departureDate}
                        onChange={(e) => updateFlightSegment(segment.id, { departureDate: e.target.value })}
                      />

                      {tripType === "round-trip" && index === 0 && (
                        <InputWithIcon
                          icon={<CalendarIcon className="h-4 w-4 text-white/50" />}
                          type="date"
                          value={segment.returnDate || ""}
                          onChange={(e) => updateFlightSegment(segment.id, { returnDate: e.target.value })}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {tripType === "multi-city" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFlightSegment}
                    className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Another Flight
                  </Button>
                )}
              </div>

              {/* Passengers and Class */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Passengers</label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={passengers.adults.toString()}
                      onValueChange={(value) => setPassengers({ ...passengers, adults: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <UserGroupIcon className="h-4 w-4 text-white/50 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Adult{num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {passengers.children > 0 && (
                      <Badge className="bg-blue-500/20 text-blue-300">{passengers.children} Child</Badge>
                    )}
                  </div>
                </div>

                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <TicketIcon className="h-4 w-4 text-white/50 mr-2" />
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

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={directFlightsOnly}
                      onChange={(e) => setDirectFlightsOnly(e.target.checked)}
                      className="rounded border-white/20 bg-white/5"
                    />
                    Direct flights only
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={flexibleDates}
                      onChange={(e) => setFlexibleDates(e.target.checked)}
                      className="rounded border-white/20 bg-white/5"
                    />
                    Flexible dates
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto bg-white text-black hover:bg-white/90 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <ClockIcon className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                )}
                {loading ? "Searching..." : useDuffelAPI ? "Search Live Flights" : "Search Flights"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* API Status */}
        {useDuffelAPI && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-4 w-4 text-blue-400" />
              <p className="text-blue-400 text-sm">Live API Mode: Searching real flights via Duffel API</p>
            </div>
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-sm">{searchError}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && filteredFlights.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
              <h2 className="text-lg font-medium text-white">{sortedAndFilteredFlights.length} flights found</h2>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-transparent border-none text-white/70 h-8 text-xs w-auto focus:ring-0">
                    <ArrowsRightLeftIcon className="h-3.5 w-3.5 mr-1.5" />
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
            </div>

            {sortedAndFilteredFlights.map((flight, index) => (
              <Card
                key={flight.id}
                className={`bg-white/5 border hover:bg-white/10 transition-all ${
                  selectedFlightId === flight.id ? "border-blue-500/50 ring-2 ring-blue-500/30" : "border-white/10"
                }`}
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
                        className="h-8 w-8 rounded-lg bg-white/10 p-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{flight.airline}</p>
                        <p className="text-xs text-white/50">{flight.flightNumber}</p>
                        {flight.operatingCarrier && (
                          <p className="text-xs text-white/40">Operated by {flight.operatingCarrier}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 items-center text-center md:text-left">
                      <div>
                        <p className="text-lg font-medium text-white">{flight.departureTime}</p>
                        <p className="text-xs text-white/70">{flight.originCode}</p>
                      </div>
                      <div className="px-2">
                        <ClockIcon className="h-3.5 w-3.5 text-white/50 mx-auto mb-0.5" />
                        <p className="text-xs text-white/70">{flight.duration}</p>
                        <div className="w-full h-px bg-white/20 my-0.5"></div>
                        <p className="text-xs text-white/50">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </p>
                        {flight.stopCities && flight.stopCities.length > 0 && (
                          <p className="text-xs text-white/40">via {flight.stopCities.join(", ")}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">{flight.arrivalTime}</p>
                        <p className="text-xs text-white/70">{flight.destinationCode}</p>
                      </div>
                    </div>
                    <div className="md:w-1/6 flex flex-col items-center md:items-end justify-center">
                      <p className="text-xl font-medium text-white">
                        ${flight.price}
                        {flight.currency && flight.currency !== "USD" && (
                          <span className="text-xs text-white/50 ml-1">{flight.currency}</span>
                        )}
                      </p>
                      <p className="text-xs text-white/50 capitalize">{flight.class.replace("_", " ")}</p>
                      {flight.basePrice && flight.taxAmount && (
                        <p className="text-xs text-white/40">
                          Base: ${flight.basePrice} + Tax: ${flight.taxAmount}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedFlightId === flight.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/70">
                            <span className="text-white/90">Aircraft:</span> {flight.aircraftType || "Boeing 737"}
                          </p>
                          <p className="text-white/70">
                            <span className="text-white/90">Policy:</span>{" "}
                            <span
                              className={flight.travelPolicy === "Compliant" ? "text-green-400" : "text-orange-400"}
                            >
                              {flight.travelPolicy}
                            </span>
                          </p>
                          {flight.expiresAt && (
                            <p className="text-white/70">
                              <span className="text-white/90">Expires:</span>{" "}
                              {new Date(flight.expiresAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-white/90 mb-0.5">Amenities:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {flight.amenities.map((amenity) => (
                              <Badge
                                key={amenity}
                                variant="secondary"
                                className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5"
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
                          <p className="text-white/90 mb-1 text-xs">Booking Conditions:</p>
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
                        className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-lg"
                        disabled={loading}
                      >
                        {loading ? <ClockIcon className="h-4 w-4 animate-spin mr-2" /> : null}
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
            <ClockIcon className="h-8 w-8 animate-spin mx-auto mb-3 text-white/70" />
            <p className="text-white/70">{useDuffelAPI ? "Searching live flights..." : "Searching for flights..."}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredFlights.length === 0 && flightSegments[0].destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <PaperAirplaneIcon className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Flights Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !flightSegments[0].destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <PaperAirplaneIcon className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">Find Your Perfect Flight</h3>
              <p className="text-white/70 mt-1">Search for flights to your destination.</p>
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
        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg hover:bg-white/10 focus:ring-1 focus:ring-white/20"
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
