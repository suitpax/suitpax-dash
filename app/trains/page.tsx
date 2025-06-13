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
  TrainFront,
  Clock,
  ArrowRightLeft,
  Ticket,
  Sparkles,
  CheckCircle,
} from "lucide-react"
import trainsData from "@/data/trains.json" // Assuming this data structure is suitable

interface Train {
  id: string
  company: string
  trainNumber: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  departureDate: string // Keep this if your data has it, or derive
  duration: string
  price: number // Assuming number for easier sorting
  class: string
  stops: number
  stopCity?: string
  amenities: string[]
  travelPolicy: "Compliant" | "Non-Compliant"
  carbonEmission?: string
  trainType?: string // e.g., High-speed, Regional
}

const trainCompanies = {
  Renfe: { code: "RN", logo: "/placeholder.svg?width=32&height=32&text=RN" },
  SNCF: { code: "SF", logo: "/placeholder.svg?width=32&height=32&text=SF" },
  "Deutsche Bahn": { code: "DB", logo: "/placeholder.svg?width=32&height=32&text=DB" },
  Eurostar: { code: "ES", logo: "/placeholder.svg?width=32&height=32&text=ES" },
  // Add more as needed
}

export default function TrainsPage() {
  const [allTrains, setAllTrains] = useState<Train[]>(trainsData as Train[])
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)

  // Search form state
  const [originCity, setOriginCity] = useState("Madrid")
  const [destinationCity, setDestinationCity] = useState("")
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0])
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("second")

  // Filter state
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
    // Initial filter or if search params change
    if (destinationCity) {
      // Trigger search if destination is set (e.g., from URL params)
      performSearch()
    }
  }, []) // Add dependencies if you want to react to URL searchParams

  const performSearch = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API

    const results = allTrains.filter(
      (train) =>
        train.origin.toLowerCase().includes(originCity.toLowerCase()) &&
        train.destination.toLowerCase().includes(destinationCity.toLowerCase()) &&
        new Date(train.departureDate) >= new Date(departureDate), // Basic date check
    )
    setFilteredTrains(results)
    setLoading(false)
    setSelectedTrainId(null) // Reset selection
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const sortedAndFilteredTrains = useMemo(() => {
    return [...filteredTrains].sort((a, b) => {
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
  }, [filteredTrains, sortBy])

  const handleBookTrain = () => {
    if (selectedTrainId) {
      setShowBookingConfirmation(true)
    }
  }

  const selectedTrainDetails = selectedTrainId ? sortedAndFilteredTrains.find((t) => t.id === selectedTrainId) : null

  if (showBookingConfirmation && selectedTrainDetails) {
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
              Your train journey from {selectedTrainDetails.origin} to {selectedTrainDetails.destination} is booked.
            </p>
            <div className="text-left bg-white/5 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <p>
                <span className="text-white/60">Reference:</span> SPX-TRN-{selectedTrainDetails.id.slice(-4)}
              </p>
              <p>
                <span className="text-white/60">Train:</span> {selectedTrainDetails.company}{" "}
                {selectedTrainDetails.trainNumber}
              </p>
              <p>
                <span className="text-white/60">Date:</span> {selectedTrainDetails.departureDate} at{" "}
                {selectedTrainDetails.departureTime}
              </p>
              <p>
                <span className="text-white/60">Price:</span> ${selectedTrainDetails.price}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBookingConfirmation(false)
                setSelectedTrainId(null)
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
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-medium text-white">Trains</h1>
        </header>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Origin, Destination, Date, Passengers, Class inputs */}
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Origin (e.g. Madrid)"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                />
                <InputWithIcon
                  icon={<MapPin className="h-4 w-4 text-white/50" />}
                  placeholder="Destination (e.g. Barcelona)"
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
                {loading ? (
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {loading ? "Searching..." : "Search Trains"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {!loading && filteredTrains.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
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
                      <img
                        src={
                          trainCompanies[train.company as keyof typeof trainCompanies]?.logo ||
                          "/placeholder.svg?width=32&height=32&text=TR"
                        }
                        alt={train.company}
                        className="h-8 w-8 rounded-md bg-white/10 p-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{train.company}</p>
                        <p className="text-xs text-white/50">{train.trainNumber}</p>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 items-center text-center md:text-left">
                      <div>
                        <p className="text-lg font-semibold text-white">{train.departureTime}</p>
                        <p className="text-xs text-white/70">{train.originCode}</p>
                      </div>
                      <div className="px-2">
                        <Clock className="h-3.5 w-3.5 text-white/50 mx-auto mb-0.5" />
                        <p className="text-xs text-white/70">{train.duration}</p>
                        <div className="w-full h-px bg-white/20 my-0.5"></div>
                        <p className="text-xs text-white/50">
                          {train.stops} stop{train.stops !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{train.arrivalTime}</p>
                        <p className="text-xs text-white/70">{train.destinationCode}</p>
                      </div>
                    </div>
                    <div className="md:w-1/6 flex flex-col items-center md:items-end justify-center">
                      <p className="text-xl font-bold text-white">${train.price}</p>
                      <p className="text-xs text-white/50 capitalize">{train.class}</p>
                    </div>
                  </div>
                  {selectedTrainId === train.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Type:</span> {train.trainType || "Standard"}
                          </p>
                          <p className="text-white/70">
                            <span className="font-medium text-white/90">Policy:</span>{" "}
                            <span className={train.travelPolicy === "Compliant" ? "text-green-400" : "text-orange-400"}>
                              {train.travelPolicy}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-white/90 mb-0.5">Amenities:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {train.amenities.map((a) => (
                              <Badge
                                key={a}
                                variant="secondary"
                                className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5"
                              >
                                {a}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleBookTrain}
                        size="sm"
                        className="w-full mt-2 bg-white text-black hover:bg-white/90 rounded-full"
                      >
                        Book This Train
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading or No Results */}
        {loading && (
          <div className="text-center py-10">
            <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white/70">Searching for trains...</p>
          </div>
        )}
        {!loading && filteredTrains.length === 0 && destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <TrainFront className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Trains Found</h3>
              <p className="text-white/70 mt-1">Try different destinations or dates.</p>
            </CardContent>
          </Card>
        )}
        {!loading && !destinationCity && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-10 text-center">
              <Sparkles className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">Find Your Next Journey</h3>
              <p className="text-white/70 mt-1">Enter your origin and destination to see available trains.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const InputWithIcon = ({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none">{icon}</div>
    <Input
      {...props}
      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 focus:bg-white/10"
    />
  </div>
)
