"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Layout from "@/components/ui/layout"
import { ArrowRight, Calendar, Clock, Check, X, Users, Leaf, Search, MapPin, Building, Car } from "lucide-react"

import {
  SiTesla,
  SiAudi,
  SiBmw,
  SiMercedes,
  SiVolkswagen,
  SiRollsroyce,
  SiUber,
  SiLyft,
  SiMarriott,
  SiHilton,
  SiHyatt,
} from "react-icons/si"

// Transfer service providers and data
const transferProviders = {
  Tesla: {
    code: "TS",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiTesla,
  },
  Audi: {
    code: "AU",
    color: "bg-red-900/30",
    textColor: "text-red-400",
    icon: SiAudi,
  },
  BMW: {
    code: "BM",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiBmw,
  },
  "Mercedes-Benz": {
    code: "MB",
    color: "bg-gray-900/30",
    textColor: "text-gray-400",
    icon: SiMercedes,
  },
  Volkswagen: {
    code: "VW",
    color: "bg-blue-900/30",
    textColor: "text-blue-400",
    icon: SiVolkswagen,
  },
  "Rolls-Royce": {
    code: "RR",
    color: "bg-purple-900/30",
    textColor: "text-purple-400",
    icon: SiRollsroyce,
  },
  "Uber Black": {
    code: "UB",
    color: "bg-gray-900/30",
    textColor: "text-gray-400",
    icon: SiUber,
  },
  "Lyft Lux": {
    code: "LL",
    color: "bg-pink-900/30",
    textColor: "text-pink-400",
    icon: SiLyft,
  },
}

// Hotel brands for destinations
const hotelBrands = {
  Marriott: {
    icon: SiMarriott,
    color: "text-white",
  },
  Hilton: {
    icon: SiHilton,
    color: "text-white",
  },
  Hyatt: {
    icon: SiHyatt,
    color: "text-white",
  },
}

// Popular routes for quick selection
const popularRoutes = [
  { origin: "Madrid Airport (MAD)", destination: "Marriott Madrid Business Center" },
  { origin: "Barcelona Airport (BCN)", destination: "Hilton Barcelona" },
  { origin: "Paris Charles de Gaulle (CDG)", destination: "Hyatt Paris Madeleine" },
  { origin: "London Heathrow (LHR)", destination: "Marriott London Canary Wharf" },
  { origin: "Frankfurt Airport (FRA)", destination: "Hilton Frankfurt City Centre" },
  { origin: "Rome Fiumicino (FCO)", destination: "Marriott Rome Grand Hotel Flora" },
  { origin: "Amsterdam Schiphol (AMS)", destination: "Hyatt Regency Amsterdam" },
  { origin: "Brussels Airport (BRU)", destination: "Marriott Brussels Grand Place" },
  { origin: "Vienna International (VIE)", destination: "Hilton Vienna Plaza" },
  { origin: "Zurich Airport (ZRH)", destination: "Hyatt Regency Zurich Airport" },
]

// Sample transfers data
const allTransfers = [
  {
    provider: "Tesla",
    vehicleModel: "Model S",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Marriott Madrid Business Center",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "11:15",
    price: "€120",
    duration: "45m",
    distance: "18 km",
    passengerCapacity: 4,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Climate control"],
    carbonEmission: "0 kg CO2 (Electric)",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Mercedes-Benz",
    vehicleModel: "S-Class",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Marriott Madrid Business Center",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "11:15",
    price: "€140",
    duration: "45m",
    distance: "18 km",
    passengerCapacity: 3,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Newspapers", "Premium refreshments"],
    carbonEmission: "3.2 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish", "French"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Audi",
    vehicleModel: "A8",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Marriott Madrid Business Center",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "11:15",
    price: "€135",
    duration: "45m",
    distance: "18 km",
    passengerCapacity: 3,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Newspapers"],
    carbonEmission: "3.5 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish", "German"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "BMW",
    vehicleModel: "7 Series",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Hilton Madrid Airport",
    destinationType: "Hotel",
    destinationBrand: "Hilton",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "10:45",
    price: "€85",
    duration: "15m",
    distance: "5 km",
    passengerCapacity: 3,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers"],
    carbonEmission: "1.2 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Uber Black",
    vehicleModel: "Executive Sedan",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Marriott Madrid Business Center",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "11:15",
    price: "€95",
    duration: "45m",
    distance: "18 km",
    passengerCapacity: 3,
    luggageCapacity: "2 large, 1 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers"],
    carbonEmission: "3.8 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish"],
    meetAndGreet: false,
    flightTracking: true,
  },
  {
    provider: "Rolls-Royce",
    vehicleModel: "Phantom",
    origin: "Madrid Airport (MAD)",
    originType: "Airport",
    destination: "Hyatt Centric Gran Via Madrid",
    destinationType: "Hotel",
    destinationBrand: "Hyatt",
    date: "May 15, 2025",
    time: "10:30",
    arrivalTime: "11:20",
    price: "€280",
    duration: "50m",
    distance: "20 km",
    passengerCapacity: 3,
    luggageCapacity: "3 large, 2 small",
    amenities: ["Wi-Fi", "Premium champagne", "Gourmet refreshments", "Massage seats", "Entertainment system"],
    carbonEmission: "5.2 kg CO2",
    travelPolicy: "Non-compliant - Luxury vehicle",
    driverLanguages: ["English", "Spanish", "French", "German", "Italian"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Tesla",
    vehicleModel: "Model X",
    origin: "Barcelona Airport (BCN)",
    originType: "Airport",
    destination: "Hilton Barcelona",
    destinationType: "Hotel",
    destinationBrand: "Hilton",
    date: "May 15, 2025",
    time: "14:45",
    arrivalTime: "15:30",
    price: "€110",
    duration: "45m",
    distance: "15 km",
    passengerCapacity: 6,
    luggageCapacity: "3 large, 3 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Climate control"],
    carbonEmission: "0 kg CO2 (Electric)",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish", "Catalan"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Mercedes-Benz",
    vehicleModel: "V-Class",
    origin: "Barcelona Airport (BCN)",
    originType: "Airport",
    destination: "Hilton Barcelona",
    destinationType: "Hotel",
    destinationBrand: "Hilton",
    date: "May 15, 2025",
    time: "14:45",
    arrivalTime: "15:30",
    price: "€150",
    duration: "45m",
    distance: "15 km",
    passengerCapacity: 7,
    luggageCapacity: "4 large, 3 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Newspapers", "Premium refreshments"],
    carbonEmission: "4.1 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Spanish", "Catalan", "French"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Volkswagen",
    vehicleModel: "Caravelle Business",
    origin: "Paris Charles de Gaulle (CDG)",
    originType: "Airport",
    destination: "Hyatt Paris Madeleine",
    destinationType: "Hotel",
    destinationBrand: "Hyatt",
    date: "May 15, 2025",
    time: "09:15",
    arrivalTime: "10:15",
    price: "€130",
    duration: "60m",
    distance: "30 km",
    passengerCapacity: 6,
    luggageCapacity: "4 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Newspapers"],
    carbonEmission: "4.5 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "French"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Lyft Lux",
    vehicleModel: "Premium SUV",
    origin: "London Heathrow (LHR)",
    originType: "Airport",
    destination: "Marriott London Canary Wharf",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "11:30",
    arrivalTime: "12:45",
    price: "£95",
    duration: "75m",
    distance: "35 km",
    passengerCapacity: 4,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers"],
    carbonEmission: "4.8 kg CO2",
    travelPolicy: "Compliant",
    driverLanguages: ["English"],
    meetAndGreet: false,
    flightTracking: true,
  },
  {
    provider: "Tesla",
    vehicleModel: "Model 3",
    origin: "Frankfurt Airport (FRA)",
    originType: "Airport",
    destination: "Hilton Frankfurt City Centre",
    destinationType: "Hotel",
    destinationBrand: "Hilton",
    date: "May 15, 2025",
    time: "16:00",
    arrivalTime: "16:30",
    price: "€80",
    duration: "30m",
    distance: "12 km",
    passengerCapacity: 3,
    luggageCapacity: "2 large, 1 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Climate control"],
    carbonEmission: "0 kg CO2 (Electric)",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "German"],
    meetAndGreet: true,
    flightTracking: true,
  },
  {
    provider: "Audi",
    vehicleModel: "e-tron",
    origin: "Rome Fiumicino (FCO)",
    originType: "Airport",
    destination: "Marriott Rome Grand Hotel Flora",
    destinationType: "Hotel",
    destinationBrand: "Marriott",
    date: "May 15, 2025",
    time: "13:20",
    arrivalTime: "14:10",
    price: "€115",
    duration: "50m",
    distance: "32 km",
    passengerCapacity: 4,
    luggageCapacity: "2 large, 2 small",
    amenities: ["Wi-Fi", "Bottled water", "Phone chargers", "Climate control"],
    carbonEmission: "0 kg CO2 (Electric)",
    travelPolicy: "Compliant",
    driverLanguages: ["English", "Italian"],
    meetAndGreet: true,
    flightTracking: true,
  },
]

export default function TransfersPage() {
  const router = useRouter()
  const [origin, setOrigin] = useState("Madrid Airport (MAD)")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("2025-05-15")
  const [time, setTime] = useState("10:30")
  const [filteredTransfers, setFilteredTransfers] = useState<any[]>([])
  const [selectedTransfer, setSelectedTransfer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [popularDestinations, setPopularDestinations] = useState<string[]>([])

  useEffect(() => {
    // Extract unique destinations for the dropdown
    const destinations = [...new Set(allTransfers.map((transfer) => transfer.destination))]
    setPopularDestinations(destinations)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination) return

    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      const filtered = allTransfers.filter(
        (transfer) =>
          transfer.destination.toLowerCase().includes(destination.toLowerCase()) ||
          (transfer.destinationBrand && transfer.destinationBrand.toLowerCase().includes(destination.toLowerCase())),
      )

      setFilteredTransfers(filtered)
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
      const filtered = allTransfers.filter(
        (transfer) => transfer.origin === route.origin && transfer.destination === route.destination,
      )

      setFilteredTransfers(filtered.length > 0 ? filtered : allTransfers.slice(0, 3))
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleSelectTransfer = (index: number) => {
    setSelectedTransfer(index === selectedTransfer ? null : index)
  }

  const handleBookTransfer = () => {
    setShowBookingConfirmation(true)
  }

  const getDestinationIcon = (transfer: any) => {
    if (
      transfer.destinationType === "Hotel" &&
      transfer.destinationBrand &&
      hotelBrands[transfer.destinationBrand as keyof typeof hotelBrands]
    ) {
      const HotelIcon = hotelBrands[transfer.destinationBrand as keyof typeof hotelBrands].icon
      return <HotelIcon className="h-4 w-4 text-white" />
    }
    return <Building className="h-4 w-4 text-white" />
  }

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full">
                  <Car className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">Transfer Search</span>
                </div>
              </div>

              <h1 className="text-lg font-medium text-white mb-0.5">Book your executive transfers</h1>
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
            <h2 className="text-xl font-medium tracking-tighter text-white text-center mb-2">Transfer Booked!</h2>
            <p className="text-white/70 text-center mb-4">
              Your executive transfer has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Booking reference:</span>
                <span className="text-sm text-white">SUITPAX-TR12345</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Vehicle:</span>
                <span className="text-sm text-white">
                  {filteredTransfers[selectedTransfer || 0].provider}{" "}
                  {filteredTransfers[selectedTransfer || 0].vehicleModel}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Date & Time:</span>
                <span className="text-sm text-white">
                  {filteredTransfers[selectedTransfer || 0].date}, {filteredTransfers[selectedTransfer || 0].time}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Route:</span>
                <span className="text-sm text-white">
                  {filteredTransfers[selectedTransfer || 0].origin} →{" "}
                  {filteredTransfers[selectedTransfer || 0].destination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Total paid:</span>
                <span className="text-sm text-white">{filteredTransfers[selectedTransfer || 0].price}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="origin" className="block text-xs font-medium text-white/70 mb-1">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                        placeholder="Airport, hotel, or address"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-white/50" />
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
                        <Building className="h-4 w-4 text-white/50" />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ArrowRight className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div>
                    <label htmlFor="passengers" className="block text-xs font-medium text-white/70 mb-1">
                      Passengers & Luggage
                    </label>
                    <div className="relative">
                      <select
                        id="passengers"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="2-2"
                      >
                        <option value="1-1" className="bg-black text-white">
                          1 Passenger, 1 Luggage
                        </option>
                        <option value="2-2" className="bg-black text-white">
                          2 Passengers, 2 Luggage
                        </option>
                        <option value="3-3" className="bg-black text-white">
                          3 Passengers, 3 Luggage
                        </option>
                        <option value="4-4" className="bg-black text-white">
                          4 Passengers, 4 Luggage
                        </option>
                        <option value="5+" className="bg-black text-white">
                          5+ Passengers (Group)
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-white/50" />
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-medium text-white">{route.origin.split(" ")[0]}</span>
                    <ArrowRight className="h-3 w-3 text-white/50" />
                    <span className="text-xs font-medium text-white">{route.destination.split(" ")[0]}</span>
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
                <p className="text-white/70 mb-6 max-w-md mx-auto">We're finding the best options for your journey.</p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-white">
                    Results for: {destination || "Your search"}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-xs text-white/70 mr-2">Sort by:</span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                      <option className="bg-black text-white">Price: low to high</option>
                      <option className="bg-black text-white">Vehicle type</option>
                      <option className="bg-black text-white">Eco-friendly first</option>
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
                            className={`w-12 h-12 ${transferProviders[transfer.provider]?.color || "bg-white/5"} rounded-lg flex items-center justify-center mr-4 ${transferProviders[transfer.provider]?.textColor || "text-white"}`}
                          >
                            {(() => {
                              const ProviderIcon = transferProviders[transfer.provider]?.icon
                              return ProviderIcon ? (
                                <ProviderIcon className="w-6 h-6 text-white" />
                              ) : (
                                <Car className="w-6 h-6 text-white" />
                              )
                            })()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{transfer.provider}</div>
                            <div className="text-xs text-white/50">{transfer.vehicleModel}</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{transfer.time}</div>
                            <div className="text-xs text-white/50">{transfer.origin.split(" ")[0]}</div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-xs text-white/50 mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {transfer.duration}
                            </div>
                            <div className="relative w-20 md:w-32">
                              <div className="border-t border-white/20 absolute w-full top-1/2"></div>
                            </div>
                            <div className="text-xs text-white/50 mt-1">{transfer.distance}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{transfer.arrivalTime}</div>
                            <div className="text-xs text-white/50 flex items-center justify-center">
                              <span className="mr-1">{transfer.destination.split(" ")[0]}</span>
                              {getDestinationIcon(transfer)}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-medium text-white">{transfer.price}</div>
                            <div className="text-xs text-white/50">all inclusive</div>
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
                                  <Calendar className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">{transfer.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    Capacity: {transfer.passengerCapacity} passengers, {transfer.luggageCapacity}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Leaf className="h-4 w-4 text-white/50" />
                                  <span className="text-sm text-white/70">
                                    Carbon footprint: {transfer.carbonEmission}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white/70">
                                    {transfer.travelPolicy.includes("Compliant") ? (
                                      <span className="text-emerald-400 flex items-center">
                                        <Check className="h-4 w-4 mr-1" /> Policy compliant
                                      </span>
                                    ) : (
                                      <span className="text-red-400 flex items-center">
                                        <X className="h-4 w-4 mr-1" /> {transfer.travelPolicy}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Service includes</h4>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {transfer.amenities.map((amenity, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                              <div className="space-y-1">
                                {transfer.meetAndGreet && (
                                  <div className="flex items-center gap-2">
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span className="text-xs text-white/70">Meet & Greet service included</span>
                                  </div>
                                )}
                                {transfer.flightTracking && (
                                  <div className="flex items-center gap-2">
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span className="text-xs text-white/70">Flight tracking included</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-xs text-white/70">
                                    Driver languages: {transfer.driverLanguages.join(", ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookTransfer}
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
                    <h3 className="text-lg font-medium text-white mb-2">No transfers found</h3>
                    <p className="text-white/70 mb-4">
                      We couldn't find any transfers matching your search criteria. Please try different locations or
                      dates.
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
                  Welcome to your executive transfer booking portal
                </h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Select your destination above to find available premium transfers for your business trip.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setDestination("Marriott Madrid Business Center")
                      handleQuickSearch({
                        origin: "Madrid Airport (MAD)",
                        destination: "Marriott Madrid Business Center",
                      })
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
