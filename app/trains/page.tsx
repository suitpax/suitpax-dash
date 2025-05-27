"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Check,
  X,
  ArrowRight,
  Clock,
  Calendar,
  Users,
  Briefcase,
  Leaf,
  Search,
  Train,
  MapPin,
  Star,
  Zap,
  Wifi,
  Coffee,
  Car,
} from "lucide-react"
import { SiAnthropic } from "react-icons/si"

// Importar datos de trenes
import trainsData from "@/data/trains.json"

// Iconos de compañías ferroviarias con colores mejorados
const trainCompanies = {
  Renfe: {
    code: "RN",
    color: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
  SNCF: {
    code: "SF",
    color: "bg-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  "Deutsche Bahn": {
    code: "DB",
    color: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
  Eurostar: {
    code: "ES",
    color: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
  },
  Trenitalia: {
    code: "TI",
    color: "bg-green-500/20",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
  },
  Italo: {
    code: "IT",
    color: "bg-purple-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30",
  },
  Thalys: {
    code: "TH",
    color: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
  ÖBB: {
    code: "OB",
    color: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
  SBB: {
    code: "SB",
    color: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
  "Renfe-SNCF": {
    code: "RS",
    color: "bg-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
}

// Rutas populares mejoradas
const popularRoutes = [
  { origin: "Madrid", destination: "Barcelona", duration: "2h 30m", price: "€45" },
  { origin: "Madrid", destination: "Valencia", duration: "1h 40m", price: "€35" },
  { origin: "Paris", destination: "Lyon", duration: "2h 00m", price: "€65" },
  { origin: "Berlin", destination: "Munich", duration: "4h 00m", price: "€89" },
  { origin: "London", destination: "Paris", duration: "2h 15m", price: "€120" },
  { origin: "Rome", destination: "Florence", duration: "1h 30m", price: "€45" },
  { origin: "Madrid", destination: "Seville", duration: "2h 20m", price: "€55" },
  { origin: "Paris", destination: "Marseille", duration: "3h 20m", price: "€75" },
]

export default function TrainsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [origin, setOrigin] = useState("Madrid")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("2025-05-15")
  const [showResults, setShowResults] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState<null | number>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [filteredTrains, setFilteredTrains] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (destination) {
      filterTrains()
    }
  }, [destination])

  const filterTrains = () => {
    if (!destination) return

    setIsLoading(true)

    setTimeout(() => {
      const filtered = trainsData.filter(
        (train: any) =>
          train.destination.toLowerCase().includes(destination.toLowerCase()) ||
          train.destinationCode.toLowerCase() === destination.toLowerCase(),
      )

      setFilteredTrains(filtered)
      setShowResults(true)
      setIsLoading(false)
    }, 800)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterTrains()
  }

  const handleQuickSearch = (route: { origin: string; destination: string }) => {
    setOrigin(route.origin)
    setDestination(route.destination)
    setSearchQuery(route.destination)
    filterTrains()
  }

  const handleSelectTrain = (index: number) => {
    setSelectedTrain(index === selectedTrain ? null : index)
  }

  const handleBookTrain = () => {
    setShowBookingConfirmation(true)
  }

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("Wi-Fi")) return <Wifi className="h-3.5 w-3.5" />
    if (amenity.includes("Coffee")) return <Coffee className="h-3.5 w-3.5" />
    if (amenity.includes("Power")) return <Zap className="h-3.5 w-3.5" />
    if (amenity.includes("Parking")) return <Car className="h-3.5 w-3.5" />
    return <Check className="h-3.5 w-3.5" />
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header mejorado */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                <Train className="h-10 w-10 text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                    <Train className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Train Search</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <SiAnthropic className="h-4 w-4 text-white/70" />
                    <span className="text-xs font-medium text-white/70">Powered by AI</span>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
                  High-Speed Rail Network
                </h1>
                <p className="text-white/70 text-lg">
                  Travel sustainably across Europe with our premium train booking platform
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm font-medium">Eco-Friendly Travel</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">High-Speed Routes</span>
                </div>
              </div>
            </div>
          </div>

          {showBookingConfirmation ? (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white text-center mb-3">
                Train Booked Successfully!
              </h2>
              <p className="text-white/70 text-center mb-6 text-lg">
                Your booking has been confirmed. Check your email for the e-ticket.
              </p>
              <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/70">Booking Reference:</span>
                    <span className="text-sm text-white font-mono">SUITPAX-TR12345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/70">Train:</span>
                    <span className="text-sm text-white">
                      {filteredTrains[selectedTrain || 0]?.company} {filteredTrains[selectedTrain || 0]?.trainNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/70">Date:</span>
                    <span className="text-sm text-white">{filteredTrains[selectedTrain || 0]?.departureDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/70">Total Paid:</span>
                    <span className="text-sm text-white font-semibold">
                      {filteredTrains[selectedTrain || 0]?.price}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Formulario de búsqueda mejorado */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-white/70 mb-2">
                        From
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="origin"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/40"
                          placeholder="Madrid"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-white/70 mb-2">
                        To
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="destination"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setDestination(e.target.value)
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/40"
                          placeholder="Barcelona"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-2">
                        Departure Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="date"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="passengers" className="block text-sm font-medium text-white/70 mb-2">
                        Passengers
                      </label>
                      <div className="relative">
                        <select
                          id="passengers"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white appearance-none"
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
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="class" className="block text-sm font-medium text-white/70 mb-2">
                        Class
                      </label>
                      <div className="relative">
                        <select
                          id="class"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white appearance-none"
                          defaultValue="second"
                        >
                          <option value="second" className="bg-black text-white">
                            Second Class
                          </option>
                          <option value="first" className="bg-black text-white">
                            First Class
                          </option>
                          <option value="business" className="bg-black text-white">
                            Business
                          </option>
                        </select>
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="trip-type" className="block text-sm font-medium text-white/70 mb-2">
                        Trip Type
                      </label>
                      <div className="relative">
                        <select
                          id="trip-type"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white appearance-none"
                          defaultValue="round-trip"
                        >
                          <option value="round-trip" className="bg-black text-white">
                            Round Trip
                          </option>
                          <option value="one-way" className="bg-black text-white">
                            One Way
                          </option>
                        </select>
                        <ArrowRight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Search className="h-4 w-4" />
                        Search Trains
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="policy-compliant"
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 mr-3"
                      defaultChecked
                    />
                    <label htmlFor="policy-compliant" className="text-sm text-white/70">
                      Show only policy-compliant options
                    </label>
                  </div>
                </form>
              </div>

              {/* Rutas populares mejoradas */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Popular Routes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {popularRoutes.map((route, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(route)}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{route.origin}</span>
                        <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-white">{route.destination}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {route.duration}
                        </span>
                        <span className="font-medium text-blue-400">{route.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {isLoading && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center shadow-lg">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                      <Train className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-3">Searching for trains...</h2>
                  <p className="text-white/70 text-lg max-w-md mx-auto">
                    Finding the best high-speed rail options for your journey
                  </p>
                </div>
              )}

              {showResults && !isLoading && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                      Results for: {searchQuery || destination}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/70">Sort by:</span>
                      <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                        <option className="bg-black text-white">Price: low to high</option>
                        <option className="bg-black text-white">Duration: shortest</option>
                        <option className="bg-black text-white">Departure: earliest</option>
                      </select>
                    </div>
                  </div>

                  {filteredTrains.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTrains.map((train, index) => (
                        <div
                          key={index}
                          className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                            selectedTrain === index ? "border-blue-500/50 ring-1 ring-blue-500/30" : "border-white/10"
                          } p-6 shadow-lg hover:border-white/20 transition-all duration-200 cursor-pointer`}
                          onClick={() => handleSelectTrain(index)}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-16 h-16 ${trainCompanies[train.company]?.color || "bg-white/5"} rounded-xl flex items-center justify-center border ${trainCompanies[train.company]?.borderColor || "border-white/10"}`}
                              >
                                <span
                                  className={`font-bold text-lg ${trainCompanies[train.company]?.textColor || "text-white"}`}
                                >
                                  {trainCompanies[train.company]?.code || train.company.substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-white">{train.company}</div>
                                <div className="text-sm text-white/60">
                                  {train.trainNumber} • {train.trainType}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8">
                              <div className="text-center">
                                <div className="text-xl font-bold text-white">{train.departureTime}</div>
                                <div className="text-sm text-white/60">{train.originCode}</div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="flex items-center text-sm text-white/60 mb-2">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {train.duration}
                                </div>
                                <div className="relative w-24 lg:w-32">
                                  <div className="border-t-2 border-white/20 absolute w-full top-1/2"></div>
                                  {train.stops > 0 && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/30 border-2 border-white/50"></div>
                                  )}
                                </div>
                                <div className="text-xs text-white/60 mt-2">
                                  {train.stops === 0 ? "Direct" : `${train.stops} stop`}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xl font-bold text-white">{train.arrivalTime}</div>
                                <div className="text-sm text-white/60">{train.destinationCode}</div>
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">{train.price}</div>
                                <div className="text-sm text-white/60">per passenger</div>
                              </div>
                            </div>
                          </div>

                          {selectedTrain === index && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-4">Journey Details</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Calendar className="h-5 w-5 text-white/50" />
                                      <span className="text-white/70">{train.departureDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Train className="h-5 w-5 text-white/50" />
                                      <span className="text-white/70">
                                        {train.trainType} • {train.class}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Leaf className="h-5 w-5 text-emerald-400" />
                                      <span className="text-white/70">Carbon footprint: {train.carbonEmission}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {train.travelPolicy === "Compliant" ? (
                                        <>
                                          <Check className="h-5 w-5 text-emerald-400" />
                                          <span className="text-emerald-400">Policy compliant</span>
                                        </>
                                      ) : (
                                        <>
                                          <X className="h-5 w-5 text-red-400" />
                                          <span className="text-red-400">Not policy compliant</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-4">Onboard Amenities</h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    {train.amenities.map((amenity, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className="text-white/50">{getAmenityIcon(amenity)}</div>
                                        <span className="text-sm text-white/70">{amenity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end mt-6">
                                <button
                                  onClick={handleBookTrain}
                                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2"
                                >
                                  <Check className="h-4 w-4" />
                                  Book This Train
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center shadow-lg">
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                          <X className="h-8 w-8 text-red-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">No trains found</h3>
                      <p className="text-white/70 text-lg max-w-md mx-auto">
                        We couldn't find any trains matching your search criteria. Please try different dates or
                        destinations.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!showResults && !isLoading && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center shadow-lg">
                  <div className="flex justify-center mb-6">
                    <div className="flex space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="relative h-16 w-16">
                          <Image
                            src={`/images/team/genevieve-mclean.jpeg`}
                            alt={`Team Member ${i}`}
                            width={64}
                            height={64}
                            className="object-cover rounded-xl border border-white/20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
                    Welcome to European Rail Network
                  </h2>
                  <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                    Experience sustainable high-speed travel across Europe. Enter your destination to find available
                    trains.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("Barcelona")
                      setDestination("Barcelona")
                      filterTrains()
                    }}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Try Sample Search: Madrid → Barcelona
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
