"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Layout from "@/components/ui/layout"
import {
  ArrowRight,
  Calendar,
  Clock,
  PlaneTakeoff,
  Check,
  X,
  ArrowRightLeft,
  Users,
  Briefcase,
  Leaf,
  Search,
} from "lucide-react"

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

import { SiAnthropic } from "react-icons/si"

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

    // Simulate API call
    setTimeout(() => {
      const filtered = allFlights.filter(
        (flight) =>
          flight.destination.toLowerCase() === destination.toLowerCase() ||
          flight.destinationCode.toLowerCase() === destination.toLowerCase(),
      )

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
      <div className="space-y-5">
        {/* Header with Anthropic branding */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex items-center justify-center p-3 bg-white/5 rounded-xl">
              <SiAnthropic className="h-10 w-10 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <PlaneTakeoff className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Flight Search</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                  <span className="text-xs font-medium text-white/70">Anthropic</span>
                  <span className="text-xs text-white/50">•</span>
                  <span className="text-xs text-white/70">AI Engineer</span>
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-medium tracking-tighter text-white mb-1.5">
                Find the best flights for your business trip
              </h1>

              <p className="text-sm text-white/70 mb-3">
                Search and compare flights from top airlines with our AI-powered flight search engine.
              </p>
            </div>
          </div>
        </div>

        {showBookingConfirmation ? (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-white text-center mb-2">Flight Booked!</h2>
            <p className="text-white/70 text-center mb-4">
              Your booking has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Booking reference:</span>
                <span className="text-sm text-white">SUITPAX-12345</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Flight:</span>
                <span className="text-sm text-white">
                  {filteredFlights[selectedFlight || 0].airline} {filteredFlights[selectedFlight || 0].flightNumber}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Date:</span>
                <span className="text-sm text-white">{filteredFlights[selectedFlight || 0].departureDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Total paid:</span>
                <span className="text-sm text-white">{filteredFlights[selectedFlight || 0].price}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <span className="text-xs">Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mb-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="origin" className="block text-xs font-medium text-white/70 mb-1">
                      Origin
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                        placeholder="Madrid"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PlaneTakeoff className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="destination" className="block text-xs font-medium text-white/70 mb-1">
                      Destination
                    </label>
                    <div className="relative">
                      <select
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                      >
                        <option value="" className="bg-black text-white">
                          Select destination
                        </option>
                        {popularDestinations.map((dest, index) => (
                          <option key={index} value={dest} className="bg-black text-white">
                            {dest}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PlaneTakeoff className="h-4 w-4 text-white/50" />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ArrowRight className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-xs font-medium text-white/70 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="passengers" className="block text-xs font-medium text-white/70 mb-1">
                      Passengers
                    </label>
                    <div className="relative">
                      <select
                        id="passengers"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="1"
                      >
                        <option value="1" className="bg-black text-white">
                          1 Passenger
                        </option>
                        <option value="2" className="bg-black text-white">
                          2 Passengers
                        </option>
                        <option value="3" className="bg-black text-white">
                          3 Passengers
                        </option>
                        <option value="4" className="bg-black text-white">
                          4 Passengers
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="class" className="block text-xs font-medium text-white/70 mb-1">
                      Class
                    </label>
                    <div className="relative">
                      <select
                        id="class"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="economy"
                      >
                        <option value="economy" className="bg-black text-white">
                          Economy
                        </option>
                        <option value="premium" className="bg-black text-white">
                          Premium Economy
                        </option>
                        <option value="business" className="bg-black text-white">
                          Business
                        </option>
                        <option value="first" className="bg-black text-white">
                          First Class
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="trip-type" className="block text-xs font-medium text-white/70 mb-1">
                      Trip Type
                    </label>
                    <div className="relative">
                      <select
                        id="trip-type"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="round-trip"
                      >
                        <option value="round-trip" className="bg-black text-white">
                          Round Trip
                        </option>
                        <option value="one-way" className="bg-black text-white">
                          One Way
                        </option>
                        <option value="multi-city" className="bg-black text-white">
                          Multi-City
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ArrowRightLeft className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="policy-compliant"
                      className="rounded border-white/10 bg-white/5 text-white focus:ring-white/20 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="policy-compliant" className="text-xs text-white/70">
                      Show only policy-compliant options
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span className="text-xs">Search Flights</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Popular routes */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm mb-6">
              <h2 className="text-sm font-medium text-white mb-3">Popular Routes</h2>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(route)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-medium text-white">{route.origin}</span>
                    <ArrowRight className="h-3 w-3 text-white/50" />
                    <span className="text-xs font-medium text-white">{route.destination}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoading && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Searching for flights...</h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">We're finding the best options for your trip.</p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-white">Results for: {destination}</h2>
                  <div className="flex items-center">
                    <span className="text-xs text-white/70 mr-2">Sort by:</span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                      <option className="bg-black text-white">Price: low to high</option>
                      <option className="bg-black text-white">Duration: shortest</option>
                      <option className="bg-black text-white">Departure: earliest</option>
                    </select>
                  </div>
                </div>

                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight, index) => (
                    <div
                      key={index}
                      className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                        selectedFlight === index ? "border-white/20" : "border-white/10"
                      } p-4 shadow-sm hover:border-white/20 transition-colors cursor-pointer`}
                      onClick={() => handleSelectFlight(index)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div
                            className={`w-12 h-12 ${airlines[flight.airline]?.color || "bg-white/5"} rounded-lg flex items-center justify-center mr-4 ${airlines[flight.airline]?.textColor || "text-white"}`}
                          >
                            {(() => {
                              const AirlineIcon = airlines[flight.airline]?.icon
                              return AirlineIcon ? (
                                <AirlineIcon className="w-6 h-6" />
                              ) : (
                                <span className="font-medium">
                                  {airlines[flight.airline]?.code || flight.airline.substring(0, 2)}
                                </span>
                              )
                            })()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{flight.airline}</div>
                            <div className="text-xs text-white/50">{flight.flightNumber}</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{flight.departureTime}</div>
                            <div className="text-xs text-white/50">{flight.originCode}</div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-xs text-white/50 mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {flight.duration}
                            </div>
                            <div className="relative w-20 md:w-32">
                              <div className="border-t border-white/20 absolute w-full top-1/2"></div>
                              {flight.stops > 0 ? (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30"></div>
                              ) : null}
                            </div>
                            <div className="text-xs text-white/50 mt-1">
                              {flight.stops === 0 ? "Direct" : `${flight.stops} stop in ${flight.stopCity}`}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{flight.arrivalTime}</div>
                            <div className="text-xs text-white/50">{flight.destinationCode}</div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-medium text-white">{flight.price}</div>
                            <div className="text-xs text-white/50">per passenger</div>
                          </div>
                        </div>
                      </div>

                      {selectedFlight === index && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Flight details</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">{flight.departureDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">{flight.aircraft}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Leaf className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    Carbon footprint: {flight.carbonEmission}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white/70">
                                    {flight.travelPolicy === "Compliant" ? (
                                      <span className="text-emerald-400 flex items-center">
                                        <Check className="h-4 w-4 mr-1" /> Policy compliant
                                      </span>
                                    ) : (
                                      <span className="text-red-400 flex items-center">
                                        <X className="h-4 w-4 mr-1" /> Not policy compliant
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Amenities</h4>
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
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookFlight}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                              <span className="text-xs">Book Now</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <X className="h-12 w-12 text-white/40" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No flights found</h3>
                    <p className="text-white/70 mb-4">
                      We couldn't find any flights matching your search criteria. Please try different dates or
                      destinations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showResults && !isLoading && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-2">
                    <div className="relative h-12 w-12">
                      <Image
                        src="/images/team/genevieve-mclean.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/images/team/cohen-lozano.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/images/team/orlando-diggs.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">
                  Welcome to your flight booking portal
                </h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Select your destination above to find available flights for your business trip.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setDestination("London")
                      handleQuickSearch({ origin: "Madrid", destination: "London" })
                    }}
                    className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <span className="text-xs">Try a sample search</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
