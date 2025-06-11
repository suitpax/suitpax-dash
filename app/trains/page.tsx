"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Layout from "@/components/ui/layout"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  CheckIcon,
  XMarkIcon,
  ArrowLongRightIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline"

// Importar datos de trenes
import trainsData from "@/data/trains.json"

// Iconos de compañías ferroviarias
const trainCompanies = {
  Renfe: {
    code: "RN",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  SNCF: {
    code: "SF",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  "Deutsche Bahn": {
    code: "DB",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  Eurostar: {
    code: "ES",
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  Trenitalia: {
    code: "TI",
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  Italo: {
    code: "IT",
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  Thalys: {
    code: "TH",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  ÖBB: {
    code: "OB",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  SBB: {
    code: "SB",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  "Renfe-SNCF": {
    code: "RS",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
}

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

  // Evitar desplazamiento automático
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Rutas populares para selección rápida
  const popularRoutes = [
    { origin: "Madrid", destination: "Barcelona" },
    { origin: "Madrid", destination: "Valencia" },
    { origin: "Paris", destination: "Lyon" },
    { origin: "Berlin", destination: "Munich" },
    { origin: "London", destination: "Paris" },
    { origin: "Rome", destination: "Florence" },
    { origin: "Madrid", destination: "Seville" },
    { origin: "Paris", destination: "Marseille" },
    { origin: "Milan", destination: "Venice" },
    { origin: "Paris", destination: "Brussels" },
  ]

  useEffect(() => {
    if (destination) {
      filterTrains()
    }
  }, [destination])

  const filterTrains = () => {
    if (!destination) return

    setIsLoading(true)

    // Simular retraso de API
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
    setSelectedTrain(index)
  }

  const handleBookTrain = () => {
    setShowBookingConfirmation(true)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tighter text-black mb-6">Train Search</h1>

        {showBookingConfirmation ? (
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-black text-center mb-2">Train Booked!</h2>
            <p className="text-gray-700 text-center mb-4">
              Your booking has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Booking reference:</span>
                <span className="text-sm">SUITPAX-TR12345</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Train:</span>
                <span className="text-sm">
                  {filteredTrains[selectedTrain || 0].company} {filteredTrains[selectedTrain || 0].trainNumber}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{filteredTrains[selectedTrain || 0].departureDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total paid:</span>
                <span className="text-sm">{filteredTrains[selectedTrain || 0].price}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
              >
                <span className="text-xs">Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      id="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Madrid"
                    />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      id="destination"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setDestination(e.target.value)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Barcelona"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                      Passengers
                    </label>
                    <select
                      id="passengers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      defaultValue="1"
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      id="class"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      defaultValue="second"
                    >
                      <option value="second">Second Class</option>
                      <option value="first">First Class</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="trip-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Trip Type
                    </label>
                    <select
                      id="trip-type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      defaultValue="round-trip"
                    >
                      <option value="round-trip">Round Trip</option>
                      <option value="one-way">One Way</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Purpose
                    </label>
                    <select
                      id="purpose"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      defaultValue="business"
                    >
                      <option value="business">Business Meeting</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="client">Client Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="policy-compliant"
                      className="rounded border-gray-300 text-black focus:ring-gray-200 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="policy-compliant" className="text-sm text-gray-700">
                      Show only policy-compliant options
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
                  >
                    <span className="text-xs">Search Trains</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Popular routes */}
            <div className="bg-white rounded-xl border border-black p-4 shadow-sm mb-6">
              <h2 className="text-sm font-medium text-black mb-3">Popular Routes</h2>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(route)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xs font-medium">{route.origin}</span>
                    <ArrowLongRightIcon className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium">{route.destination}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoading && (
              <div className="bg-white rounded-xl border border-black p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-black mb-2">Searching for trains...</h2>
                <p className="text-gray-700 mb-6 max-w-md mx-auto">We're finding the best options for your trip.</p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-black">
                    Results for: {searchQuery || destination}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Sort by:</span>
                    <select className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-200">
                      <option>Price: low to high</option>
                      <option>Duration: shortest</option>
                      <option>Departure: earliest</option>
                    </select>
                  </div>
                </div>

                {filteredTrains.length > 0 ? (
                  filteredTrains.map((train, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl border ${
                        selectedTrain === index ? "border-black" : "border-gray-200"
                      } p-4 shadow-sm hover:border-black transition-colors cursor-pointer`}
                      onClick={() => handleSelectTrain(index)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div
                            className={`w-12 h-12 ${trainCompanies[train.company]?.color || "bg-gray-100"} rounded-lg flex items-center justify-center mr-4 ${trainCompanies[train.company]?.textColor || "text-gray-700"}`}
                          >
                            <span className="font-medium">
                              {trainCompanies[train.company]?.code || train.company.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-black">{train.company}</div>
                            <div className="text-xs text-gray-500">{train.trainNumber}</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-black">{train.departureTime}</div>
                            <div className="text-xs text-gray-500">{train.originCode}</div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {train.duration}
                            </div>
                            <div className="relative w-20 md:w-32">
                              <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                              {train.stops > 0 ? (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                              ) : null}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {train.stops === 0 ? "Direct" : `${train.stops} stop in ${train.stopCity}`}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm font-medium text-black">{train.arrivalTime}</div>
                            <div className="text-xs text-gray-500">{train.destinationCode}</div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-medium text-black">{train.price}</div>
                            <div className="text-xs text-gray-500">per passenger</div>
                          </div>
                        </div>
                      </div>

                      {selectedTrain === index && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-black mb-2">Train details</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{train.departureDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{train.trainType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <RocketLaunchIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{train.class}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    {train.travelPolicy === "Compliant" ? (
                                      <span className="text-emerald-600 flex items-center">
                                        <CheckIcon className="h-4 w-4 mr-1" /> Policy compliant
                                      </span>
                                    ) : (
                                      <span className="text-red-600 flex items-center">
                                        <XMarkIcon className="h-4 w-4 mr-1" /> Not policy compliant
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-black mb-2">Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {train.amenities.map((amenity, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1" />
                                  Carbon footprint: {train.carbonEmission}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookTrain}
                              className="flex items-center px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
                            >
                              <span className="text-xs">Book</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-black p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <XMarkIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">No trains found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any trains matching your search criteria. Please try different dates or
                      destinations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showResults && !isLoading && (
              <div className="bg-white rounded-xl border border-black p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-2">
                    <div className="relative h-12 w-12">
                      <Image
                        src="/confident-professional.png"
                        alt="Team Member 1"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/thoughtful-bearded-professional.png"
                        alt="Team Member 2"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/confident-professional.png"
                        alt="Team Member 3"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/confident-professional.png"
                        alt="Team Member 4"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-black mb-2">
                  Welcome to your train booking portal
                </h2>
                <p className="text-gray-700 mb-6 max-w-md mx-auto">
                  This is your first time using our train search. Enter your destination above to find available trains.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery("Barcelona")
                      setDestination("Barcelona")
                      filterTrains()
                    }}
                    className="flex items-center px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
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
