"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  Check,
  X,
  Users,
  Briefcase,
  Search,
  MapPin,
  Plane,
  Coffee,
  Wifi,
  Utensils,
  ShowerHeadIcon as Shower,
  BedSingle,
  Newspaper,
} from "lucide-react"

import Layout from "@/components/ui/layout"

// Types for our data
interface VIPLounge {
  id: string
  name: string
  location: string
  airport: string
  terminal: string
  amenities: string[]
  accessStatus: "available" | "unavailable" | "limited"
  imageUrl: string
  partnerStatus?: "premium" | "standard" | "exclusive"
  price: string
  openingHours: string
  maxStay: string
  rating: number
  reviewCount: number
  travelPolicy: "Compliant" | "Non-compliant" | "Approval required"
}

// Sample data
const vipLounges: VIPLounge[] = [
  {
    id: "lounge1",
    name: "Centurion Lounge",
    location: "Terminal 4, Concourse D",
    airport: "Madrid-Barajas Airport",
    terminal: "T4",
    amenities: ["Premium Buffet", "Open Bar", "Shower Suites", "High-Speed Wi-Fi", "Business Center", "Meeting Rooms"],
    accessStatus: "available",
    imageUrl: "/contemporary-airport-retreat.png",
    partnerStatus: "exclusive",
    price: "€45",
    openingHours: "05:00 - 23:00",
    maxStay: "3 hours",
    rating: 4.8,
    reviewCount: 245,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge2",
    name: "Star Alliance Lounge",
    location: "Terminal 1, Near Gate 10",
    airport: "Barcelona El Prat Airport",
    terminal: "T1",
    amenities: ["Hot Food", "Alcoholic Beverages", "Quiet Zone", "Newspapers", "TV", "Conference Facilities"],
    accessStatus: "limited",
    imageUrl: "/sophisticated-airport-retreat.png",
    partnerStatus: "premium",
    price: "€35",
    openingHours: "06:00 - 22:00",
    maxStay: "3 hours",
    rating: 4.5,
    reviewCount: 189,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge3",
    name: "Plaza Premium Lounge",
    location: "Terminal 2, Departures Level",
    airport: "London Heathrow",
    terminal: "T2",
    amenities: ["Buffet", "Bar Service", "Shower Facilities", "Relaxation Area", "Business Center", "Private Suites"],
    accessStatus: "available",
    imageUrl: "/upscale-airport-dining.png",
    partnerStatus: "standard",
    price: "£40",
    openingHours: "05:30 - 22:30",
    maxStay: "3 hours",
    rating: 4.6,
    reviewCount: 312,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge4",
    name: "Air France Lounge",
    location: "Terminal 2E, Hall L",
    airport: "Paris Charles de Gaulle",
    terminal: "T2E",
    amenities: ["French Cuisine", "Wine Selection", "Spa Services", "Quiet Areas", "Shower Suites", "Work Stations"],
    accessStatus: "available",
    imageUrl: "/serene-airport-spa.png",
    partnerStatus: "premium",
    price: "€50",
    openingHours: "05:30 - 23:00",
    maxStay: "3 hours",
    rating: 4.7,
    reviewCount: 276,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge5",
    name: "Lufthansa Senator Lounge",
    location: "Terminal 1, Concourse Z",
    airport: "Frankfurt Airport",
    terminal: "T1",
    amenities: [
      "German Cuisine",
      "Premium Bar",
      "Shower Facilities",
      "Relaxation Area",
      "Business Center",
      "Newspapers",
    ],
    accessStatus: "available",
    imageUrl: "/contemporary-airport-retreat.png",
    partnerStatus: "premium",
    price: "€45",
    openingHours: "05:00 - 22:00",
    maxStay: "3 hours",
    rating: 4.6,
    reviewCount: 198,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge6",
    name: "Emirates First Class Lounge",
    location: "Terminal 3, Concourse A",
    airport: "Dubai International Airport",
    terminal: "T3",
    amenities: ["Fine Dining", "Premium Bar", "Spa Services", "Cigar Lounge", "Shower Suites", "Private Suites"],
    accessStatus: "limited",
    imageUrl: "/sophisticated-airport-retreat.png",
    partnerStatus: "exclusive",
    price: "€75",
    openingHours: "24 hours",
    maxStay: "4 hours",
    rating: 4.9,
    reviewCount: 156,
    travelPolicy: "Approval required",
  },
  {
    id: "lounge7",
    name: "Cathay Pacific The Pier",
    location: "Terminal 1, Near Gate 63",
    airport: "Hong Kong International Airport",
    terminal: "T1",
    amenities: ["Asian Cuisine", "Tea House", "Noodle Bar", "Shower Suites", "Relaxation Pods", "Business Center"],
    accessStatus: "available",
    imageUrl: "/upscale-airport-dining.png",
    partnerStatus: "premium",
    price: "HK$580",
    openingHours: "05:30 - 00:30",
    maxStay: "3 hours",
    rating: 4.8,
    reviewCount: 234,
    travelPolicy: "Compliant",
  },
  {
    id: "lounge8",
    name: "Singapore Airlines SilverKris",
    location: "Terminal 3, Departure Transit Hall",
    airport: "Singapore Changi Airport",
    terminal: "T3",
    amenities: ["Singaporean Cuisine", "Premium Bar", "Shower Facilities", "Productivity Pods", "Reading Materials"],
    accessStatus: "available",
    imageUrl: "/serene-airport-spa.png",
    partnerStatus: "premium",
    price: "S$80",
    openingHours: "24 hours",
    maxStay: "3 hours",
    rating: 4.9,
    reviewCount: 312,
    travelPolicy: "Compliant",
  },
]

// Popular airports for quick selection
const popularAirports = [
  "Madrid-Barajas Airport",
  "Barcelona El Prat Airport",
  "London Heathrow",
  "Paris Charles de Gaulle",
  "Frankfurt Airport",
  "Dubai International Airport",
  "Hong Kong International Airport",
  "Singapore Changi Airport",
]

export default function AirportVIPLoungePage() {
  const router = useRouter()
  const [airport, setAirport] = useState("")
  const [date, setDate] = useState("2025-05-15")
  const [time, setTime] = useState("10:30")
  const [filteredLounges, setFilteredLounges] = useState<VIPLounge[]>([])
  const [selectedLounge, setSelectedLounge] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!airport) return

    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      const filtered = vipLounges.filter((lounge) => lounge.airport.toLowerCase().includes(airport.toLowerCase()))

      setFilteredLounges(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleQuickSearch = (selectedAirport: string) => {
    setAirport(selectedAirport)

    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      const filtered = vipLounges.filter((lounge) => lounge.airport === selectedAirport)

      setFilteredLounges(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleSelectLounge = (index: number) => {
    setSelectedLounge(index === selectedLounge ? null : index)
  }

  const handleBookLounge = () => {
    setShowBookingConfirmation(true)
  }

  const getAmenityIcon = (amenity: string) => {
    if (
      amenity.toLowerCase().includes("food") ||
      amenity.toLowerCase().includes("buffet") ||
      amenity.toLowerCase().includes("cuisine")
    ) {
      return <Utensils className="h-4 w-4 mr-1" />
    } else if (
      amenity.toLowerCase().includes("bar") ||
      amenity.toLowerCase().includes("beverage") ||
      amenity.toLowerCase().includes("drink")
    ) {
      return <Coffee className="h-4 w-4 mr-1" />
    } else if (amenity.toLowerCase().includes("wifi") || amenity.toLowerCase().includes("internet")) {
      return <Wifi className="h-4 w-4 mr-1" />
    } else if (amenity.toLowerCase().includes("shower")) {
      return <Shower className="h-4 w-4 mr-1" />
    } else if (
      amenity.toLowerCase().includes("relax") ||
      amenity.toLowerCase().includes("quiet") ||
      amenity.toLowerCase().includes("pod")
    ) {
      return <BedSingle className="h-4 w-4 mr-1" />
    } else if (
      amenity.toLowerCase().includes("newspaper") ||
      amenity.toLowerCase().includes("magazine") ||
      amenity.toLowerCase().includes("reading")
    ) {
      return <Newspaper className="h-4 w-4 mr-1" />
    } else {
      return <Check className="h-4 w-4 mr-1" />
    }
  }

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full">
                  <Plane className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">VIP Lounge</span>
                </div>
              </div>

              <h1 className="text-lg font-medium text-white mb-0.5">Access premium airport lounges</h1>
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
            <h2 className="text-xl font-medium tracking-tighter text-white text-center mb-2">Lounge Access Booked!</h2>
            <p className="text-white/70 text-center mb-4">
              Your VIP lounge access has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Booking reference:</span>
                <span className="text-sm text-white">SUITPAX-LG12345</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Lounge:</span>
                <span className="text-sm text-white">{filteredLounges[selectedLounge || 0].name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Location:</span>
                <span className="text-sm text-white">
                  {filteredLounges[selectedLounge || 0].airport}, {filteredLounges[selectedLounge || 0].terminal}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Date & Time:</span>
                <span className="text-sm text-white">
                  {date.split("-").reverse().join("/")}, {time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Total paid:</span>
                <span className="text-sm text-white">{filteredLounges[selectedLounge || 0].price}</span>
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
                    <label htmlFor="airport" className="block text-xs font-medium text-white/70 mb-1">
                      Airport
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="airport"
                        value={airport}
                        onChange={(e) => setAirport(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                        placeholder="Enter airport name"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Plane className="h-4 w-4 text-white/50" />
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
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-xs font-medium text-white/70 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="passengers" className="block text-xs font-medium text-white/70 mb-1">
                      Guests
                    </label>
                    <div className="relative">
                      <select
                        id="passengers"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="1"
                      >
                        <option value="1" className="bg-black text-white">
                          1 Guest
                        </option>
                        <option value="2" className="bg-black text-white">
                          2 Guests
                        </option>
                        <option value="3" className="bg-black text-white">
                          3 Guests
                        </option>
                        <option value="4" className="bg-black text-white">
                          4 Guests
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="purpose" className="block text-xs font-medium text-white/70 mb-1">
                      Travel Purpose
                    </label>
                    <div className="relative">
                      <select
                        id="purpose"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="business"
                      >
                        <option value="business" className="bg-black text-white">
                          Business Travel
                        </option>
                        <option value="layover" className="bg-black text-white">
                          Long Layover
                        </option>
                        <option value="delay" className="bg-black text-white">
                          Flight Delay
                        </option>
                        <option value="leisure" className="bg-black text-white">
                          Leisure Travel
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-white/50" />
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
                    <span className="text-xs">Search Lounges</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Popular airports */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm mb-6">
              <h2 className="text-sm font-medium text-white mb-3">Popular Airports</h2>
              <div className="flex flex-wrap gap-2">
                {popularAirports.map((airportName, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(airportName)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Plane className="h-3 w-3 text-white/70" />
                    <span className="text-xs font-medium text-white">{airportName.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoading && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Searching for lounges...</h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  We're finding the best VIP lounges for your journey.
                </p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-white">
                    Results for: {airport || "Your search"}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-xs text-white/70 mr-2">Sort by:</span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                      <option className="bg-black text-white">Price: low to high</option>
                      <option className="bg-black text-white">Rating: high to low</option>
                      <option className="bg-black text-white">Most amenities</option>
                    </select>
                  </div>
                </div>

                {filteredLounges.length > 0 ? (
                  filteredLounges.map((lounge, index) => (
                    <div
                      key={index}
                      className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                        selectedLounge === index ? "border-white/20" : "border-white/10"
                      } overflow-hidden shadow-sm hover:border-white/20 transition-colors cursor-pointer`}
                      onClick={() => handleSelectLounge(index)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-48 md:h-auto md:w-1/3">
                          <Image
                            src={lounge.imageUrl || "/placeholder.svg"}
                            alt={lounge.name}
                            fill
                            className="object-cover"
                          />
                          {lounge.partnerStatus && (
                            <div className="absolute top-4 left-4">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  lounge.partnerStatus === "exclusive"
                                    ? "bg-black/80 text-white"
                                    : lounge.partnerStatus === "premium"
                                      ? "bg-black/70 text-white"
                                      : "bg-black/60 text-white"
                                }`}
                              >
                                {lounge.partnerStatus === "exclusive"
                                  ? "Exclusive Partner"
                                  : lounge.partnerStatus === "premium"
                                    ? "Premium Partner"
                                    : "Standard Partner"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:w-2/3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-medium text-white">{lounge.name}</h3>
                              <div className="flex items-center text-white/70 text-sm">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {lounge.airport}, {lounge.terminal}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 mt-1">{lounge.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-medium text-white">{lounge.price}</div>
                              <div className="text-xs text-white/50">per person</div>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${
                                  lounge.accessStatus === "available"
                                    ? "bg-green-900/30 text-green-400"
                                    : lounge.accessStatus === "limited"
                                      ? "bg-yellow-900/30 text-yellow-400"
                                      : "bg-red-900/30 text-red-400"
                                }`}
                              >
                                {lounge.accessStatus === "available"
                                  ? "Available Now"
                                  : lounge.accessStatus === "limited"
                                    ? "Limited Availability"
                                    : "Currently Unavailable"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {lounge.amenities.slice(0, 5).map((amenity, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white"
                              >
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </span>
                            ))}
                            {lounge.amenities.length > 5 && (
                              <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white">
                                +{lounge.amenities.length - 5} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-white/70">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Hours: {lounge.openingHours}</span>
                              <span className="mx-2">•</span>
                              <span>Max stay: {lounge.maxStay}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < Math.floor(lounge.rating) ? "text-yellow-400" : "text-white/20"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-white/50 ml-1">({lounge.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedLounge === index && (
                        <div className="p-4 border-t border-white/10 bg-black/20">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Lounge details</h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    Guests: 1 included (additional guests at extra cost)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">Access duration: {lounge.maxStay}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white/70">
                                    {lounge.travelPolicy === "Compliant" ? (
                                      <span className="text-emerald-400 flex items-center">
                                        <Check className="h-4 w-4 mr-1" /> Policy compliant
                                      </span>
                                    ) : lounge.travelPolicy === "Approval required" ? (
                                      <span className="text-yellow-400 flex items-center">
                                        <Check className="h-4 w-4 mr-1" /> Approval required
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
                              <h4 className="text-sm font-medium text-white mb-2">All amenities</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {lounge.amenities.map((amenity, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white"
                                  >
                                    {getAmenityIcon(amenity)}
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookLounge}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                              <span className="text-xs">Book Access</span>
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
                    <h3 className="text-lg font-medium text-white mb-2">No lounges found</h3>
                    <p className="text-white/70 mb-4">
                      We couldn't find any VIP lounges matching your search criteria. Please try a different airport or
                      date.
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
                  Welcome to your VIP lounge booking portal
                </h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Select an airport above to find available premium lounges for your business travel.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setAirport("Madrid-Barajas Airport")
                      handleQuickSearch("Madrid-Barajas Airport")
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
