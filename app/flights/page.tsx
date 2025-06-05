"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/dashboard-layout"
import { ExportModal } from "@/components/ui/export-modal"
import { Calendar, Clock, PlaneTakeoff, Users, Search, Download, Filter, Star } from "lucide-react"

import {
  SiBritishairways,
  SiLufthansa,
  SiAirfrance,
  SiIberia,
  SiAmericanairlines,
  SiDelta,
  SiEmirates,
  SiQatarairways,
  SiSingaporeairlines,
} from "react-icons/si"

// Airline icons and data
const airlines = {
  "British Airways": {
    code: "BA",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiBritishairways,
  },
  Lufthansa: {
    code: "LH",
    color: "bg-yellow-900/30",
    textColor: "text-yellow-400",
    icon: SiLufthansa,
  },
  "Air France": {
    code: "AF",
    color: "bg-red-900/30",
    textColor: "text-red-400",
    icon: SiAirfrance,
  },
  Iberia: {
    code: "IB",
    color: "bg-red-900/30",
    textColor: "text-red-400",
    icon: SiIberia,
  },
  "American Airlines": {
    code: "AA",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiAmericanairlines,
  },
  "Delta Air Lines": {
    code: "DL",
    color: "bg-red-900/30",
    textColor: "text-red-400",
    icon: SiDelta,
  },
  Emirates: {
    code: "EK",
    color: "bg-red-900/30",
    textColor: "text-red-400",
    icon: SiEmirates,
  },
  "Qatar Airways": {
    code: "QR",
    color: "bg-purple-900/30",
    textColor: "text-purple-400",
    icon: SiQatarairways,
  },
  "Singapore Airlines": {
    code: "SQ",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiSingaporeairlines,
  },
}

// Popular routes for quick selection
const popularRoutes = [
  { origin: "Madrid", destination: "London" },
  { origin: "Madrid", destination: "Paris" },
  { origin: "Madrid", destination: "New York" },
  { origin: "Madrid", destination: "Tokyo" },
  { origin: "Madrid", destination: "Berlin" },
  { origin: "Madrid", destination: "Dubai" },
  { origin: "Madrid", destination: "Singapore" },
  { origin: "Madrid", destination: "Rome" },
  { origin: "Madrid", destination: "Amsterdam" },
  { origin: "Madrid", destination: "Barcelona" },
]

// Sample flights data
const allFlights = [
  {
    airline: "British Airways",
    flightNumber: "BA456",
    origin: "Madrid",
    originCode: "MAD",
    destination: "London",
    destinationCode: "LHR",
    departureDate: "May 15, 2025",
    departureTime: "08:25",
    arrivalTime: "10:05",
    price: "€320",
    duration: "2h 40m",
    stops: 0,
    aircraft: "Boeing 787",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment"],
    carbonEmission: "120kg CO2",
    travelPolicy: "Compliant",
    rating: 4.8,
    reviews: 1247,
  },
  {
    airline: "Iberia",
    flightNumber: "IB3166",
    origin: "Madrid",
    originCode: "MAD",
    destination: "London",
    destinationCode: "LHR",
    departureDate: "May 15, 2025",
    departureTime: "10:25",
    arrivalTime: "12:05",
    price: "€290",
    duration: "2h 40m",
    stops: 0,
    aircraft: "Airbus A320",
    amenities: ["Wi-Fi", "Power outlets"],
    carbonEmission: "115kg CO2",
    travelPolicy: "Compliant",
    rating: 4.6,
    reviews: 892,
  },
  {
    airline: "Air France",
    flightNumber: "AF1000",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Paris",
    destinationCode: "CDG",
    departureDate: "May 15, 2025",
    departureTime: "07:45",
    arrivalTime: "09:55",
    price: "€210",
    duration: "2h 10m",
    stops: 0,
    aircraft: "Airbus A320",
    amenities: ["Wi-Fi", "Power outlets"],
    carbonEmission: "95kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Lufthansa",
    flightNumber: "LH1802",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Berlin",
    destinationCode: "BER",
    departureDate: "May 15, 2025",
    departureTime: "14:30",
    arrivalTime: "17:25",
    price: "€280",
    duration: "2h 55m",
    stops: 0,
    aircraft: "Airbus A320",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment"],
    carbonEmission: "130kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Iberia",
    flightNumber: "IB6275",
    origin: "Madrid",
    originCode: "MAD",
    destination: "New York",
    destinationCode: "JFK",
    departureDate: "May 15, 2025",
    departureTime: "10:25",
    arrivalTime: "13:05",
    price: "€750",
    duration: "8h 40m",
    stops: 0,
    aircraft: "Airbus A350",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Meals"],
    carbonEmission: "450kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Air France",
    flightNumber: "AF1234",
    origin: "Madrid",
    originCode: "MAD",
    destination: "New York",
    destinationCode: "JFK",
    departureDate: "May 15, 2025",
    departureTime: "07:45",
    arrivalTime: "12:55",
    price: "€680",
    duration: "9h 10m",
    stops: 1,
    stopCity: "Paris (CDG)",
    aircraft: "Boeing 777",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Meals"],
    carbonEmission: "480kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Lufthansa",
    flightNumber: "LH4567",
    origin: "Madrid",
    originCode: "MAD",
    destination: "New York",
    destinationCode: "JFK",
    departureDate: "May 15, 2025",
    departureTime: "14:30",
    arrivalTime: "17:40",
    price: "€820",
    duration: "8h 10m",
    stops: 0,
    aircraft: "Airbus A380",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Premium meals"],
    carbonEmission: "430kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Emirates",
    flightNumber: "EK142",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Tokyo",
    destinationCode: "NRT",
    departureDate: "May 15, 2025",
    departureTime: "15:30",
    arrivalTime: "11:40",
    price: "€950",
    duration: "14h 10m",
    stops: 1,
    stopCity: "Dubai (DXB)",
    aircraft: "Boeing 777",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Premium meals"],
    carbonEmission: "620kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Qatar Airways",
    flightNumber: "QR151",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Tokyo",
    destinationCode: "HND",
    departureDate: "May 15, 2025",
    departureTime: "16:15",
    arrivalTime: "12:30",
    price: "€920",
    duration: "14h 15m",
    stops: 1,
    stopCity: "Doha (DOH)",
    aircraft: "Boeing 787",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Premium meals"],
    carbonEmission: "610kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "British Airways",
    flightNumber: "BA490",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Barcelona",
    destinationCode: "BCN",
    departureDate: "May 15, 2025",
    departureTime: "07:30",
    arrivalTime: "08:45",
    price: "€120",
    duration: "1h 15m",
    stops: 0,
    aircraft: "Airbus A320",
    amenities: ["Wi-Fi", "Power outlets"],
    carbonEmission: "75kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Emirates",
    flightNumber: "EK144",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Dubai",
    destinationCode: "DXB",
    departureDate: "May 15, 2025",
    departureTime: "22:05",
    arrivalTime: "07:15",
    price: "€580",
    duration: "7h 10m",
    stops: 0,
    aircraft: "Boeing 777-300ER",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Premium meals"],
    carbonEmission: "380kg CO2",
    travelPolicy: "Compliant",
  },
  {
    airline: "Singapore Airlines",
    flightNumber: "SQ377",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Singapore",
    destinationCode: "SIN",
    departureDate: "May 15, 2025",
    departureTime: "12:25",
    arrivalTime: "07:30",
    price: "€750",
    duration: "13h 05m",
    stops: 0,
    aircraft: "Airbus A350-900",
    amenities: ["Wi-Fi", "Power outlets", "In-flight entertainment", "Premium meals"],
    carbonEmission: "520kg CO2",
    travelPolicy: "Compliant",
  },
]

export default function FlightsPage() {
  const router = useRouter()
  const [origin, setOrigin] = useState("Madrid")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("2025-05-15")
  const [filteredFlights, setFilteredFlights] = useState<any[]>([])
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")
  const [popularDestinations, setPopularDestinations] = useState<string[]>([])

  useEffect(() => {
    // Extract unique destinations for the dropdown
    const destinations = [...new Set(allFlights.map((flight) => flight.destination))]
    setPopularDestinations(destinations)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination) return

    setIsLoading(true)
    setShowResults(false)

    setTimeout(() => {
      let filtered = allFlights.filter(
        (flight) =>
          flight.destination.toLowerCase() === destination.toLowerCase() ||
          flight.destinationCode.toLowerCase() === destination.toLowerCase(),
      )

      // Apply sorting
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case "price":
            return Number.parseInt(a.price.replace(/[€$,]/g, "")) - Number.parseInt(b.price.replace(/[€$,]/g, ""))
          case "duration":
            return Number.parseInt(a.duration.split("h")[0]) - Number.parseInt(b.duration.split("h")[0])
          case "rating":
            return b.rating - a.rating
          default:
            return 0
        }
      })

      // Apply filters
      if (filterBy !== "all") {
        filtered = filtered.filter((flight) => {
          switch (filterBy) {
            case "direct":
              return flight.stops === 0
            case "morning":
              return Number.parseInt(flight.departureTime.split(":")[0]) < 12
            case "evening":
              return Number.parseInt(flight.departureTime.split(":")[0]) >= 18
            default:
              return true
          }
        })
      }

      setFilteredFlights(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleQuickSearch = (route: { origin: string; destination: string }) => {
    setOrigin(route.origin)
    setDestination(route.destination)

    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      const filtered = allFlights.filter((flight) => flight.destination === route.destination)

      setFilteredFlights(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleSelectFlight = (index: number) => {
    setSelectedFlight(index === selectedFlight ? null : index)
  }

  const handleBookFlight = () => {
    setShowBookingConfirmation(true)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-white mb-2">Flight Search</h1>
              <p className="text-white/70">Find and book the best flights for your business travel</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm">Export</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors">
                <Filter size={16} />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">From</label>
                <div className="relative">
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Madrid"
                  />
                  <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">To</label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select destination
                    </option>
                    <option value="London" className="bg-black text-white">
                      London
                    </option>
                    <option value="Paris" className="bg-black text-white">
                      Paris
                    </option>
                    <option value="New York" className="bg-black text-white">
                      New York
                    </option>
                    <option value="Tokyo" className="bg-black text-white">
                      Tokyo
                    </option>
                  </select>
                  <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Departure</label>
                <div className="relative">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Passengers</label>
                <div className="relative">
                  <select className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none">
                    <option value="1" className="bg-black text-white">
                      1 Passenger
                    </option>
                    <option value="2" className="bg-black text-white">
                      2 Passengers
                    </option>
                  </select>
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Search size={16} />
                <span>Search Flights</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sort and Filter Controls */}
        {showResults && (
          <div className="bg-black/95 rounded-lg border border-white/10 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    <option value="price" className="bg-black">
                      Price
                    </option>
                    <option value="duration" className="bg-black">
                      Duration
                    </option>
                    <option value="rating" className="bg-black">
                      Rating
                    </option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Filter:</span>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    <option value="all" className="bg-black">
                      All flights
                    </option>
                    <option value="direct" className="bg-black">
                      Direct only
                    </option>
                    <option value="morning" className="bg-black">
                      Morning
                    </option>
                    <option value="evening" className="bg-black">
                      Evening
                    </option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-white/70">{filteredFlights.length} flights found</div>
            </div>
          </div>
        )}

        {/* Enhanced Flight Results */}
        {showResults && !isLoading && (
          <div className="space-y-4">
            {filteredFlights.map((flight, index) => (
              <div
                key={index}
                className={`bg-black/95 backdrop-blur-sm rounded-xl border ${
                  selectedFlight === index ? "border-white/20" : "border-white/10"
                } p-6 shadow-sm hover:border-white/20 transition-colors cursor-pointer`}
                onClick={() => setSelectedFlight(index === selectedFlight ? null : index)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Airline Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${airlines[flight.airline]?.color || "bg-white/5"} rounded-lg flex items-center justify-center`}
                    >
                      {(() => {
                        const AirlineIcon = airlines[flight.airline]?.icon
                        return AirlineIcon ? (
                          <AirlineIcon className="w-6 h-6 text-white" />
                        ) : (
                          <span className="font-medium text-white">
                            {airlines[flight.airline]?.code || flight.airline.substring(0, 2)}
                          </span>
                        )
                      })()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{flight.airline}</div>
                      <div className="text-sm text-white/50">{flight.flightNumber}</div>
                      {flight.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white/70">{flight.rating}</span>
                          <span className="text-xs text-white/50">({flight.reviews})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="font-medium text-white">{flight.departureTime}</div>
                      <div className="text-sm text-white/50">{flight.originCode}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-sm text-white/50 mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {flight.duration}
                      </div>
                      <div className="relative w-24">
                        <div className="border-t border-white/20 absolute w-full top-1/2"></div>
                        {flight.stops > 0 && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30"></div>
                        )}
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {flight.stops === 0 ? "Direct" : `${flight.stops} stop`}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-medium text-white">{flight.arrivalTime}</div>
                      <div className="text-sm text-white/50">{flight.destinationCode}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{flight.price}</div>
                      <div className="text-sm text-white/50">per passenger</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedFlight === index && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-3">Flight Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Aircraft:</span>
                            <span className="text-white">{flight.aircraft}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Carbon footprint:</span>
                            <span className="text-white">{flight.carbonEmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Policy:</span>
                            <span className="text-emerald-400">{flight.travelPolicy}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {flight.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-end justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowBookingConfirmation(true)
                          }}
                          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Book Flight
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Export Modal */}
        <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} dataType="flights" />
      </div>
    </Layout>
  )
}
