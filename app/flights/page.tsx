"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Calendar, Users, Plane, Clock, ArrowRightLeft, Ticket, CheckCircle } from "lucide-react"
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
  class: string
  stops: number
  stopCity?: string
  amenities: string[]
  travelPolicy: "Compliant" | "Non-Compliant"
  carbonEmission?: string
  aircraftType?: string
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

  // Search form state
  const [originCity, setOriginCity] = useState("New York")
  const [destinationCity, setDestinationCity] = useState("")
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0])
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")

  // Filter state
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
    // Check URL params for pre-filled search
    const urlParams = new URLSearchParams(window.location.search)
    const destination = urlParams.get("destination")
    if (destination) {
      setDestinationCity(destination)
      performSearch()
    }
  }, [])

  const performSearch = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = allFlights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(originCity.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destinationCity.toLowerCase()) &&
        new Date(flight.departureDate) >= new Date(departureDate),
    )
    setFilteredFlights(results)
    setLoading(false)
    setSelectedFlightId(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredFlights = useMemo(() => {
    return [...filteredFlights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") {
        const durA =
          Number.parseInt(a.duration.split("h")[0]) * 60 +
          Number.parseInt(a.duration.split("h")[1]?.replace("m", "") || "0")
        const durB =
          Number.parseInt(b.duration.split("h")[0]) * 60 +
          Number.parseInt(b.duration.split("h")[1]?.replace("m", "") || "0")
        return durA - durB
      }
      if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime)
      return 0
    })
  }, [filteredFlights, sortBy])

  const handleBookFlight = () => {
    if (selectedFlightId) {
      setShowBookingConfirmation(true)
    }
  }

  const selectedFlightDetails = selectedFlightId
    ? sortedAndFilteredFlights.find((f) => f.id === selectedFlightId)
    : null

  if (showBookingConfirmation && selectedFlightDetails) {
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
              Your flight from {selectedFlightDetails.origin} to {selectedFlightDetails.destination} is booked.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> SPX-{selectedFlightDetails.id.slice(-4)}
              </p>
              <p>
                <span className="text-white/60">Flight:</span> {selectedFlightDetails.airline}{" "}
                {selectedFlightDetails.flightNumber}
              </p>
              <p>
                <span className="text-white/60">Date:</span> {selectedFlightDetails.departureDate} at{" "}
                {selectedFlightDetails.departureTime}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${selectedFlightDetails.price}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedFlightId(null)
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
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-light text-white tracking-tight">Flights</h1>
        </header>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Origin (e.g. New York)"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                />
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Destination (e.g. London)"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                />
                <InputWithIcon
                  icon={<Calendar className="h-4 w-4 text-white/50" />}
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
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
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                    <Ticket className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["economy", "premium", "business", "first"].map((tc) => (
                      <SelectItem key={tc} value={tc} className="capitalize">
                        {tc} Class
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
                {loading ? "Searching..." : "Search Flights"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {!loading && filteredFlights.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
              <h2 className="text-lg font-medium text-white">{sortedAndFilteredFlights.length} flights found</h2>
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
                        <p className="text-sm font-medium text-white">{flight.airline}</p>
                        <p className="text-xs text-white/50">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 items-center text-center md:text-left">
                      <div>
                        <p className="text-lg font-semibold text-white">{flight.departureTime}</p>
                        <p className="text-xs text-white/70">{flight.originCode}</p>
                      </div>
                      <div className="px-2">
                        <Clock className="h-3.5 w-3.5 text-white/50 mx-auto mb-0.5" />
                        <p className="text-xs text-white/70">{flight.duration}</p>
                        <div className="w-full h-px bg-white/20 my-0.5"></div>
                        <p className="text-xs text-white/50">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{flight.arrivalTime}</p>
                        <p className="text-xs text-white/70">{flight.destinationCode}</p>
                      </div>
                    </div>
                    <div className="md:w-1/6 flex flex-col items-center md:items-end justify-center">
                      <p className="text-xl font-bold text-white">${flight.price}</p>
                      <p className="text-xs text-white/50 capitalize">{flight.class}</p>
                    </div>
                  </div>
                  {selectedFlightId === flight.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Aircraft:</span>{" "}
                            {flight.aircraftType || "Boeing 737"}
                          </p>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Policy:</span>{" "}
                            <span
                              className={flight.travelPolicy === "Compliant" ? "text-green-400" : "text-orange-400"}
                            >
                              {flight.travelPolicy}
                            </span>
                          </p>
                          {flight.carbonEmission && (
                            <p className="text-white/70">
                              <span className="font-medium text-white/90">CO₂:</span> {flight.carbonEmission}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white/90 mb-0.5">Amenities:</p>
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
                      <Button
                        onClick={handleBookFlight}
                        size="sm"
                        className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
                      >
                        Book This Flight
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
            <p className="text-white/70">Searching for flights...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredFlights.length === 0 && destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Plane className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Flights Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Plane className="h-12 w-12 text-white/30 mx-auto mb-3" />
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
        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 focus:ring-1 focus:ring-white/20"
      />
    </div>
  )
}

// Add CSS for animations
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
document.head.appendChild(style)
