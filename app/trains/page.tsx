"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Calendar, Users, Train, Clock, ArrowRightLeft, Zap, CheckCircle, Loader2 } from "lucide-react"
import trainsData from "@/data/trains.json"

interface TrainRoute {
  id: string
  operator: string
  trainNumber: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  departureDate: string
  duration: string
  price: number
  currency: string
  class: string
  trainType: string
  amenities: string[]
  travelPolicy: "Compliant" | "Non-Compliant"
  availability: number
  route?: string[]
  distance?: string
  speed?: string
}

export default function TrainsPage() {
  const [allTrains, setAllTrains] = useState<TrainRoute[]>(trainsData as TrainRoute[])
  const [filteredTrains, setFilteredTrains] = useState<TrainRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)

  // Search form state
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0])
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("second")

  // Filter state
  const [sortBy, setSortBy] = useState("price")

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
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const results = allTrains.filter(
      (train) =>
        train.origin.toLowerCase().includes(origin.toLowerCase()) &&
        train.destination.toLowerCase().includes(destination.toLowerCase()) &&
        new Date(train.departureDate) >= new Date(departureDate),
    )

    setFilteredTrains(results)
    setLoading(false)
    setSelectedTrainId(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredTrains = useMemo(() => {
    return [...filteredTrains].sort((a, b) => {
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
  }, [filteredTrains, sortBy])

  const handleBookTrain = async () => {
    if (!selectedTrainId) return

    const train = sortedAndFilteredTrains.find((t) => t.id === selectedTrainId)
    if (!train) return

    setLoading(true)

    // Simulate booking API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockBooking = {
      id: `booking_${Date.now()}`,
      reference: `SPX${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "confirmed",
      train: train,
      passengers: passengers,
      created_at: new Date().toISOString(),
    }

    setBookingData(mockBooking)
    setShowBookingConfirmation(true)
    setLoading(false)
  }

  const selectedTrainDetails = selectedTrainId ? sortedAndFilteredTrains.find((t) => t.id === selectedTrainId) : null

  if (showBookingConfirmation && bookingData) {
    const train = bookingData.train

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
              Your train from {train?.origin} to {train?.destination} is booked.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> {bookingData.reference}
              </p>
              <p>
                <span className="text-white/60">Train:</span> {train?.operator} {train?.trainNumber}
              </p>
              <p>
                <span className="text-white/60">Date:</span> {train?.departureDate} at {train?.departureTime}
              </p>
              <p>
                <span className="text-white/60">Passengers:</span> {bookingData.passengers}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${train?.price}
              </p>
              <p>
                <span className="text-white/60">Status:</span>
                <span className="text-green-400 ml-1 capitalize">{bookingData.status}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedTrainId(null)
                setBookingData(null)
              }}
              className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
            >
              Book Another Train
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
              <h1 className="text-2xl font-medium text-white">Trains</h1>
              <p className="text-sm text-white/70 mt-1">Book high-speed rail connections across Europe and beyond.</p>
            </div>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-xs text-white/70">High-Speed Rail</span>
            </div>
          </div>
        </header>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Origin (e.g. Paris, London)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Destination (e.g. Brussels, Amsterdam)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
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
                    <Train className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["second", "first", "business"].map((tc) => (
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                {loading ? "Searching..." : "Search Trains"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {!loading && filteredTrains.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
              <h2 className="text-lg font-medium text-white">{sortedAndFilteredTrains.length} trains found</h2>
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

            {sortedAndFilteredTrains.map((train, index) => (
              <Card
                key={train.id}
                className={`bg-white/5 border hover:bg-white/10 transition-all ${selectedTrainId === train.id ? "border-blue-500/50 ring-2 ring-blue-500/30" : "border-white/10"}`}
                style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out forwards`, opacity: 0 }}
              >
                <CardContent
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedTrainId(train.id === selectedTrainId ? null : train.id)}
                >
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex md:flex-col items-center md:items-start md:w-1/6 gap-2">
                      <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Train className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{train.operator}</p>
                        <p className="text-xs text-white/50">{train.trainNumber}</p>
                        <p className="text-xs text-white/40">{train.trainType}</p>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 items-center text-center md:text-left">
                      <div>
                        <p className="text-lg font-medium text-white">{train.departureTime}</p>
                        <p className="text-xs text-white/70">{train.originCode || train.origin}</p>
                      </div>
                      <div className="px-2">
                        <Clock className="h-3.5 w-3.5 text-white/50 mx-auto mb-0.5" />
                        <p className="text-xs text-white/70">{train.duration}</p>
                        <div className="w-full h-px bg-white/20 my-0.5"></div>
                        <p className="text-xs text-white/50">Direct</p>
                        {train.speed && <p className="text-xs text-white/40">{train.speed}</p>}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">{train.arrivalTime}</p>
                        <p className="text-xs text-white/70">{train.destinationCode || train.destination}</p>
                      </div>
                    </div>
                    <div className="md:w-1/6 flex flex-col items-center md:items-end justify-center">
                      <p className="text-xl font-medium text-white">
                        ${train.price}
                        {train.currency && train.currency !== "USD" && (
                          <span className="text-xs text-white/50 ml-1">{train.currency}</span>
                        )}
                      </p>
                      <p className="text-xs text-white/50 capitalize">{train.class} Class</p>
                      <Badge
                        variant={train.travelPolicy === "Compliant" ? "default" : "secondary"}
                        className={`mt-1 text-xs ${train.travelPolicy === "Compliant" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}
                      >
                        {train.travelPolicy}
                      </Badge>
                    </div>
                  </div>
                  {selectedTrainId === train.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Type:</span> {train.trainType}
                          </p>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Availability:</span> {train.availability} seats
                          </p>
                          {train.distance && (
                            <p className="text-white/70">
                              <span className="font-medium text-white/90">Distance:</span> {train.distance}
                            </p>
                          )}
                          {train.route && (
                            <p className="text-white/70">
                              <span className="font-medium text-white/90">Route:</span> {train.route.join(" → ")}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white/90 mb-0.5">Amenities:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {train.amenities.map((amenity) => (
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
                        onClick={handleBookTrain}
                        size="sm"
                        className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {loading ? "Booking..." : "Book This Train"}
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
            <p className="text-white/70">Searching for trains...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredTrains.length === 0 && destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Train className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Trains Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !destination && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Train className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">Find Your Train Journey</h3>
              <p className="text-white/70 mt-1">Search for high-speed rail connections.</p>
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
  if (!document.head.querySelector("style[data-trains-animations]")) {
    style.setAttribute("data-trains-animations", "true")
    document.head.appendChild(style)
  }
}
