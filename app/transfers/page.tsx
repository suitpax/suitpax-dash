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
  MapPinIcon,
} from "@heroicons/react/24/outline"

// Datos de ejemplo para transfers
const transfersData = [
  {
    id: "TR001",
    type: "Airport Transfer",
    company: "Executive Cars",
    vehicleType: "Luxury Sedan",
    origin: "Madrid Airport (MAD)",
    destination: "Gran Via Hotel",
    distance: "16 km",
    duration: "25 min",
    price: "€65",
    departureDate: "May 15, 2025",
    departureTime: "14:30",
    passengers: 2,
    luggage: "2 large, 1 small",
    driverWaiting: true,
    meetAndGreet: true,
    flightTracking: true,
    cancellationPolicy: "Free cancellation up to 24h before",
    travelPolicy: "Compliant",
    carbonEmission: "Low - Electric Vehicle",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: "TR002",
    type: "City Transfer",
    company: "Premium Transfers",
    vehicleType: "Business Van",
    origin: "Gran Via Hotel",
    destination: "Madrid Conference Center",
    distance: "8 km",
    duration: "15 min",
    price: "€45",
    departureDate: "May 16, 2025",
    departureTime: "08:45",
    passengers: 4,
    luggage: "4 briefcases",
    driverWaiting: true,
    meetAndGreet: false,
    flightTracking: false,
    cancellationPolicy: "Free cancellation up to 12h before",
    travelPolicy: "Compliant",
    carbonEmission: "Medium - Hybrid Vehicle",
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "TR003",
    type: "Airport Transfer",
    company: "City Transfers",
    vehicleType: "Standard Sedan",
    origin: "Madrid Conference Center",
    destination: "Madrid Airport (MAD)",
    distance: "18 km",
    duration: "30 min",
    price: "€55",
    departureDate: "May 17, 2025",
    departureTime: "16:15",
    passengers: 2,
    luggage: "2 large, 1 small",
    driverWaiting: false,
    meetAndGreet: false,
    flightTracking: true,
    cancellationPolicy: "Free cancellation up to 6h before",
    travelPolicy: "Compliant",
    carbonEmission: "Medium - Hybrid Vehicle",
    rating: 4.5,
    reviews: 320,
  },
  {
    id: "TR004",
    type: "Hourly Hire",
    company: "Executive Cars",
    vehicleType: "Luxury SUV",
    origin: "Gran Via Hotel",
    destination: "Madrid City Tour (4 hours)",
    distance: "Variable",
    duration: "4 hours",
    price: "€240",
    departureDate: "May 16, 2025",
    departureTime: "13:00",
    passengers: 3,
    luggage: "None",
    driverWaiting: true,
    meetAndGreet: true,
    flightTracking: false,
    cancellationPolicy: "Free cancellation up to 48h before",
    travelPolicy: "Non-Compliant",
    carbonEmission: "High - Standard Vehicle",
    rating: 4.9,
    reviews: 112,
  },
]

// Iconos de compañías de transfers
const transferCompanies = {
  "Executive Cars": {
    code: "EC",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  "Premium Transfers": {
    code: "PT",
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  "City Transfers": {
    code: "CT",
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  "Airport Express": {
    code: "AE",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
}

export default function TransfersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [origin, setOrigin] = useState("Madrid Airport (MAD)")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("2025-05-15")
  const [showResults, setShowResults] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<null | number>(null)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [filteredTransfers, setFilteredTransfers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Evitar desplazamiento automático
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Rutas populares para selección rápida
  const popularRoutes = [
    { origin: "Madrid Airport (MAD)", destination: "Gran Via Hotel" },
    { origin: "Barcelona Airport (BCN)", destination: "Passeig de Gracia" },
    { origin: "Paris CDG Airport", destination: "Eiffel Tower" },
    { origin: "London Heathrow", destination: "Canary Wharf" },
    { origin: "Rome Fiumicino", destination: "Colosseum" },
    { origin: "Berlin Tegel", destination: "Potsdamer Platz" },
    { origin: "New York JFK", destination: "Manhattan" },
    { origin: "Tokyo Narita", destination: "Shinjuku" },
    { origin: "Dubai International", destination: "Burj Khalifa" },
    { origin: "Singapore Changi", destination: "Marina Bay Sands" },
  ]

  useEffect(() => {
    if (destination) {
      filterTransfers()
    }
  }, [destination])

  const filterTransfers = () => {
    if (!destination) return

    setIsLoading(true)

    // Simular retraso de API
    setTimeout(() => {
      const filtered = transfersData.filter(
        (transfer: any) =>
          transfer.destination.toLowerCase().includes(destination.toLowerCase()) ||
          transfer.origin.toLowerCase().includes(destination.toLowerCase()),
      )

      setFilteredTransfers(filtered)
      setShowResults(true)
      setIsLoading(false)
    }, 800)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterTransfers()
  }

  const handleQuickSearch = (route: { origin: string; destination: string }) => {
    setOrigin(route.origin)
    setDestination(route.destination)
    setSearchQuery(route.destination)
    filterTransfers()
  }

  const handleSelectTransfer = (index: number) => {
    setSelectedTransfer(index)
  }

  const handleBookTransfer = () => {
    setShowBookingConfirmation(true)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tighter text-white mb-6">Transfer Search</h1>

        {showBookingConfirmation ? (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <CheckIcon className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-white text-center mb-2">Transfer Booked!</h2>
            <p className="text-white/70 text-center mb-4">
              Your booking has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Booking reference:</span>
                <span className="text-sm text-white">SUITPAX-{filteredTransfers[selectedTransfer || 0].id}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Transfer:</span>
                <span className="text-sm text-white">
                  {filteredTransfers[selectedTransfer || 0].company} -{" "}
                  {filteredTransfers[selectedTransfer || 0].vehicleType}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Date:</span>
                <span className="text-sm text-white">{filteredTransfers[selectedTransfer || 0].departureDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Total paid:</span>
                <span className="text-sm text-white">{filteredTransfers[selectedTransfer || 0].price}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center px-3 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <span className="text-xs">Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mb-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-white/70 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      id="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                      placeholder="Airport, hotel, address..."
                    />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-white/70 mb-1">
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                      placeholder="Hotel, office, address..."
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-white/70 mb-1">
                      Passengers
                    </label>
                    <select
                      id="passengers"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                      defaultValue="2"
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
                      <option value="5" className="bg-black text-white">
                        5 Passengers
                      </option>
                      <option value="6" className="bg-black text-white">
                        6+ Passengers
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="vehicle-type" className="block text-sm font-medium text-white/70 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      id="vehicle-type"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                      defaultValue="any"
                    >
                      <option value="any" className="bg-black text-white">
                        Any Vehicle
                      </option>
                      <option value="sedan" className="bg-black text-white">
                        Sedan
                      </option>
                      <option value="suv" className="bg-black text-white">
                        SUV
                      </option>
                      <option value="van" className="bg-black text-white">
                        Van
                      </option>
                      <option value="luxury" className="bg-black text-white">
                        Luxury
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="transfer-type" className="block text-sm font-medium text-white/70 mb-1">
                      Transfer Type
                    </label>
                    <select
                      id="transfer-type"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                      defaultValue="airport"
                    >
                      <option value="airport" className="bg-black text-white">
                        Airport Transfer
                      </option>
                      <option value="city" className="bg-black text-white">
                        City Transfer
                      </option>
                      <option value="hourly" className="bg-black text-white">
                        Hourly Hire
                      </option>
                      <option value="intercity" className="bg-black text-white">
                        Intercity
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-white/70 mb-1">
                      Travel Purpose
                    </label>
                    <select
                      id="purpose"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                      defaultValue="business"
                    >
                      <option value="business" className="bg-black text-white">
                        Business Meeting
                      </option>
                      <option value="conference" className="bg-black text-white">
                        Conference
                      </option>
                      <option value="airport" className="bg-black text-white">
                        Airport Transfer
                      </option>
                      <option value="client" className="bg-black text-white">
                        Client Visit
                      </option>
                      <option value="other" className="bg-black text-white">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="policy-compliant"
                      className="rounded border-white/10 bg-white/5 text-white focus:ring-white/20 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="policy-compliant" className="text-sm text-white/70">
                      Show only policy-compliant options
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-3 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
                  >
                    <span className="text-xs">Search Transfers</span>
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-medium text-white">{route.origin}</span>
                    <ArrowLongRightIcon className="h-3 w-3 text-white/50" />
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
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Searching for transfers...</h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">We're finding the best options for your trip.</p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-white">
                    Results for: {searchQuery || destination}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm text-white/70 mr-2">Sort by:</span>
                    <select className="text-sm bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none">
                      <option className="bg-black text-white">Price: low to high</option>
                      <option className="bg-black text-white">Rating: highest</option>
                      <option className="bg-black text-white">Duration: shortest</option>
                    </select>
                  </div>
                </div>

                {filteredTransfers.length > 0 ? (
                  filteredTransfers.map((transfer, index) => (
                    <div
                      key={index}
                      className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                        selectedTransfer === index ? "border-white/20" : "border-white/10"
                      } p-4 shadow-sm hover:border-white/20 transition-colors cursor-pointer`}
                      onClick={() => handleSelectTransfer(index)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div
                            className={`w-12 h-12 ${
                              transferCompanies[transfer.company as keyof typeof transferCompanies]?.color ||
                              "bg-white/5"
                            } rounded-lg flex items-center justify-center mr-4 ${
                              transferCompanies[transfer.company as keyof typeof transferCompanies]?.textColor ||
                              "text-white"
                            }`}
                          >
                            <span className="font-medium">
                              {transferCompanies[transfer.company as keyof typeof transferCompanies]?.code ||
                                transfer.company.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{transfer.company}</div>
                            <div className="text-xs text-white/50">{transfer.vehicleType}</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{transfer.departureTime}</div>
                            <div className="text-xs text-white/50 truncate max-w-[120px]">{transfer.origin}</div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-xs text-white/50 mb-1">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {transfer.duration}
                            </div>
                            <div className="relative w-20 md:w-32">
                              <div className="border-t border-white/20 absolute w-full top-1/2"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20"></div>
                            </div>
                            <div className="text-xs text-white/50 mt-1">{transfer.distance}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-xs text-white/50 truncate max-w-[120px]">{transfer.destination}</div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-medium text-white">{transfer.price}</div>
                            <div className="text-xs text-white/50">total price</div>
                          </div>
                        </div>
                      </div>

                      {selectedTransfer === index && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Transfer details</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">{transfer.departureDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    {transfer.passengers} passengers, {transfer.luggage}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPinIcon className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">{transfer.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CurrencyDollarIcon className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    {transfer.travelPolicy === "Compliant" ? (
                                      <span className="text-emerald-400 flex items-center">
                                        <CheckIcon className="h-4 w-4 mr-1" /> Policy compliant
                                      </span>
                                    ) : (
                                      <span className="text-red-400 flex items-center">
                                        <XMarkIcon className="h-4 w-4 mr-1" /> Not policy compliant
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Services included</h4>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/70">
                                  {transfer.driverWaiting ? (
                                    <CheckIcon className="h-3 w-3 mr-1 text-emerald-400" />
                                  ) : (
                                    <XMarkIcon className="h-3 w-3 mr-1 text-red-400" />
                                  )}
                                  Driver waiting
                                </span>
                                <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/70">
                                  {transfer.meetAndGreet ? (
                                    <CheckIcon className="h-3 w-3 mr-1 text-emerald-400" />
                                  ) : (
                                    <XMarkIcon className="h-3 w-3 mr-1 text-red-400" />
                                  )}
                                  Meet & Greet
                                </span>
                                <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/70">
                                  {transfer.flightTracking ? (
                                    <CheckIcon className="h-3 w-3 mr-1 text-emerald-400" />
                                  ) : (
                                    <XMarkIcon className="h-3 w-3 mr-1 text-red-400" />
                                  )}
                                  Flight tracking
                                </span>
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="text-xs text-white/50 flex items-center">
                                  <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1" />
                                  {transfer.carbonEmission}
                                </span>
                              </div>
                              <div className="mt-2 text-xs text-white/50">{transfer.cancellationPolicy}</div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookTransfer}
                              className="flex items-center px-3 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
                            >
                              <span className="text-xs">Book Transfer</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <XMarkIcon className="h-12 w-12 text-white/40" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No transfers found</h3>
                    <p className="text-white/70 mb-4">
                      We couldn't find any transfers matching your search criteria. Please try different dates or
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
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">
                  Welcome to your transfer booking portal
                </h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  This is your first time using our transfer search. Enter your destination above to find available
                  transfers.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery("Gran Via Hotel")
                      setDestination("Gran Via Hotel")
                      filterTransfers()
                    }}
                    className="flex items-center px-3 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
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
