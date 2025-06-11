"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  MapPin,
  Calendar,
  Plane,
  Star,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Clock,
  AlertCircle,
  BarChart3,
  CloudSun,
  Zap,
  Briefcase,
  Users,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Map,
  Layers,
  Bell,
  Wifi,
  Coffee,
  Utensils,
  Monitor,
  Power,
  Maximize,
  Minimize,
  Repeat,
  Wallet,
} from "lucide-react"
import FlightMap from "@/components/ui/flight-map"
import FlightTimeline from "@/components/ui/flight-timeline"
import FlightComparison from "@/components/ui/flight-comparison"
import FlightStats from "@/components/ui/flight-stats"
import CarbonFootprint from "@/components/ui/carbon-footprint"
import LoyaltyPoints from "@/components/ui/loyalty-points"

interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  departure: {
    airport: string
    terminal: string
    city: string
    time: string
    date: string
    coordinates: [number, number]
  }
  arrival: {
    airport: string
    terminal: string
    city: string
    time: string
    date: string
    coordinates: [number, number]
  }
  duration: string
  price: number
  class: string
  stops: number
  stopDetails: {
    airport: string
    duration: string
  }[]
  aircraft: string
  rating: number
  onTimePerformance: number
  amenities: string[]
  seatsAvailable: number
  carbonFootprint: number
  loyaltyPoints: number
  travelPolicyCompliant: boolean
  refundable: boolean
  changeFee: number
  baggage: {
    carryOn: number
    checked: number
  }
}

function FlightsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [savedFlights, setSavedFlights] = useState<string[]>([])
  const [comparisonFlights, setComparisonFlights] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("search")
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false)
  const [showSeatSelector, setShowSeatSelector] = useState(false)
  const [selectedFlightForSeats, setSelectedFlightForSeats] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Search form state
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")
  const [travelClass, setTravelClass] = useState("economy")

  // Advanced filters
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [maxDuration, setMaxDuration] = useState(24)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [directOnly, setDirectOnly] = useState(false)
  const [refundableOnly, setRefundableOnly] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [policyCompliantOnly, setPolicyCompliantOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [departureTime, setDepartureTime] = useState<[number, number]>([0, 24])
  const [arrivalTime, setArrivalTime] = useState<[number, number]>([0, 24])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    // Get URL parameters
    const from = searchParams.get("from") || ""
    const to = searchParams.get("to") || ""
    const departure = searchParams.get("departure") || ""
    const returnD = searchParams.get("return") || ""
    const pax = searchParams.get("passengers") || "1"

    setFromCity(from)
    setToCity(to)
    setDepartureDate(departure)
    setReturnDate(returnD)
    setPassengers(pax)

    // Load saved flights from localStorage
    const saved = localStorage.getItem("savedFlights")
    if (saved) {
      setSavedFlights(JSON.parse(saved))
    }

    // If we have search params, perform search
    if (from && to && departure) {
      performSearch()
    }
  }, [searchParams])

  useEffect(() => {
    // Apply filters whenever filter criteria change
    if (flights.length > 0) {
      applyFilters()
    }
  }, [
    flights, 
    priceRange, 
    maxDuration, 
    selectedAirlines, 
    directOnly, 
    refundableOnly, 
    sortBy,
    policyCompliantOnly,
    minRating,
    departureTime,
    arrivalTime,
    selectedAmenities
  ])

  const performSearch = async () => {
    setLoading(true)
    setActiveTab("results")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate realistic flight data
    const generatedFlights = generateFlights(fromCity, toCity, departureDate)
    setFlights(generatedFlights)
    setFilteredFlights(generatedFlights)
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = flights.filter((flight) => {
      // Price filter
      if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false
      
      // Duration filter (convert "5h 30m" to hours)
      const durationParts = flight.duration.split(' ')
      const hours = Number.parseInt(durationParts[0].replace('h', ''))
      const minutes = durationParts.length > 1 ? Number.parseInt(durationParts[1].replace('m', '')) : 0
      const totalHours = hours + minutes / 60
      if (totalHours > maxDuration) return false
      
      // Airlines filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false
      
      // Direct flights filter
      if (directOnly && flight.stops > 0) return false
      
      // Refundable filter
      if (refundableOnly && !flight.refundable) return false
      
      // Policy compliant filter
      if (policyCompliantOnly && !flight.travelPolicyCompliant) return false
      
      // Rating filter
      if (flight.rating < minRating) return false
      
      // Departure time filter (convert "08:30" to hours)
      const depHour = Number.parseInt(flight.departure.time.split(':')[0])
      if (depHour < departureTime[0] || depHour > departureTime[1]) return false
      
      // Arrival time filter
      const arrHour = Number.parseInt(flight.arrival.time.split(':')[0])
      if (arrHour < arrivalTime[0] || arrHour > arrivalTime[1]) return false
      
      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity => 
          flight.amenities.includes(amenity)
        )
        if (!hasAllAmenities) return false
      }
      
      return true
    })

    // Apply sorting
    filtered = sortFlights(filtered, sortBy)
    
    setFilteredFlights(filtered)
  }

  const sortFlights = (flightsToSort: Flight[], sortCriteria: string) => {
    return [...flightsToSort].sort((a, b) => {
      switch (sortCriteria) {
        case 'price':
          return a.price - b.price
        case 'duration':
          return a.duration.localeCompare(b.duration)
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time)
        case 'arrival':
          return a.arrival.time.localeCompare(b.arrival.time)
        case 'rating':
          return b.rating - a.rating
        case 'recommended':
          // Composite score based on price, duration, rating
          const scoreA = (a.price / 1000) - (a.rating / 5) + (getDurationInMinutes(a.duration) / 1000)
          const scoreB = (b.price / 1000) - (b.rating / 5) + (getDurationInMinutes(b.duration) / 1000)
          return scoreA - scoreB
        default:
          return 0
      }
    })
  }

  const getDurationInMinutes = (duration: string) => {
    const parts = duration.split(' ')
    const hours = Number.parseInt(parts[0].replace('h', '')) * 60
    const minutes = parts.length > 1 ? Number.parseInt(parts[1].replace('m', '')) : 0
    return hours + minutes
  }

  const generateFlights = (from: string, to: string, date: string): Flight[] => {
    const airlines = [
      { name: "American Airlines", code: "AA" },
      { name: "Delta", code: "DL" },
      { name: "United", code: "UA" },
      { name: "British Airways", code: "BA" },
      { name: "Lufthansa", code: "LH" },
      { name: "Air France", code: "AF" },
      { name: "Emirates", code: "EK" },
      { name: "Qatar Airways", code: "QR" },
      { name: "Singapore Airlines", code: "SQ" },
    ]

    const aircrafts = [
      "Boeing 737-800",
      "Boeing 787-9",
      "Airbus A320",
      "Airbus A350-900",
      "Boeing 777-300ER",
      "Airbus A330-300",
    ]

    const amenities = [
      "Wi-Fi",
      "Power Outlets",
      "In-flight Entertainment",
      "Premium Meals",
      "Lie-flat Seats",
      "Extra Legroom",
      "Priority Boarding",
      "Lounge Access",
    ]

    // Coordinates for major cities
    const cityCoordinates: Record<string, [number, number]> = {
      "New York": [-74.006, 40.7128],
      "London": [-0.1278, 51.5074],
      "Paris": [2.3522, 48.8566],
      "Tokyo": [139.6917, 35.6895],
      "Dubai": [55.2708, 25.2048],
      "Singapore": [103.8198, 1.3521],
      "Madrid": [-3.7038, 40.4168],
      "Barcelona": [2.1734, 41.3851],
      "Berlin": [13.4050, 52.5200],
      "Rome": [12.4964, 41.9028],
      "Amsterdam": [4.9041, 52.3676],
      "Hong Kong": [114.1694, 22.3193],
      "Sydney": [151.2093, -33.8688],
      "Los Angeles": [-118.2437, 34.0522],
      "Chicago": [-87.6298, 41.8781],
      "San Francisco": [-122.4194, 37.7749],
    }

    // Default coordinates if city not found
    const defaultFromCoords: [number, number] = [-3.7038, 40.4168] // Madrid
    const defaultToCoords: [number, number] = [-0.1278, 51.5074] // London

    const fromCoords = cityCoordinates[from] || defaultFromCoords
    const toCoords = cityCoordinates[to] || defaultToCoords

    const flights: Flight[] = []
    const numFlights = 15 + Math.floor(Math.random() * 10)

    for (let i = 0; i < numFlights; i++) {
      const airlineIndex = Math.floor(Math.random() * airlines.length)
      const airline = airlines[airlineIndex]
      
      // Generate departure time between 6:00 and 22:00
      const departureHour = 6 + Math.floor(Math.random() * 16)
      const departureMinute = Math.floor(Math.random() * 60)
      const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`
      
      // Generate duration between 1h30m and 12h
      const durationHours = 1 + Math.floor(Math.random() * 11)
      const durationMinutes = Math.floor(Math.random() * 60)
      const duration = `${durationHours}h ${durationMinutes}m`
      
      // Calculate arrival time
      let arrivalHour = departureHour + durationHours
      let arrivalMinute = departureMinute + durationMinutes
      
      if (arrivalMinute >= 60) {
        arrivalHour += 1
        arrivalMinute -= 60
      }
      
      // Adjust for next day
      let arrivalDate = date
      if (arrivalHour >= 24) {
        arrivalHour -= 24
        // Calculate next day
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        arrivalDate = nextDay.toISOString().split('T')[0]
      }
      
      const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`
      
      // Generate price based on class
      const basePrice = travelClass === "economy" ? 200 : travelClass === "premium-economy" ? 400 : travelClass === "business" ? 800 : 1500
      const price = basePrice + Math.floor(Math.random() * basePrice * 0.5)
      
      // Generate stops (0-2)
      const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.8 ? 2 : 1
      
      // Generate stop details if there are stops
      const stopDetails = []
      if (stops > 0) {
        for (let j = 0; j < stops; j++) {
          const stopAirports = ["FRA", "AMS", "CDG", "DXB", "DOH", "IST", "MAD"]
          const stopAirport = stopAirports[Math.floor(Math.random() * stopAirports.length)]
          const stopDuration = `${1 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`
          stopDetails.push({ airport: stopAirport, duration: stopDuration })
        }
      }
      
      // Generate random amenities
      const flightAmenities = []
      const numAmenities = 2 + Math.floor(Math.random() * (amenities.length - 2))
      const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random())
      for (let j = 0; j < numAmenities; j++) {
        flightAmenities.push(shuffledAmenities[j])
      }
      
      flights.push({
        id: `FL${1000 + i}`,
        airline: airline.name,
        airlineCode: airline.code,
        flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
        departure: {
          airport: `${from.substring(0, 3).toUpperCase()}`,
          terminal: `T${1 + Math.floor(Math.random() * 5)}`,
          city: from,
          time: departureTime,
          date: date,
          coordinates: fromCoords
        },
        arrival: {
          airport: `${to.substring(0, 3).toUpperCase()}`,
          terminal: `T${1 + Math.floor(Math.random() * 5)}`,
          city: to,
          time: arrivalTime,
          date: arrivalDate,
          coordinates: toCoords
        },
        duration,
        price,
        class: travelClass,
        stops,
        stopDetails,
        aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
        rating: 3 + Math.random() * 2,
        onTimePerformance: 70 + Math.floor(Math.random() * 30),
        amenities: flightAmenities,
        seatsAvailable: 3 + Math.floor(Math.random() * 20),
        carbonFootprint: 100 + Math.floor(Math.random() * 400),
        loyaltyPoints: Math.floor(price * (0.5 + Math.random())),
        travelPolicyCompliant: Math.random() > 0.2,
        refundable: Math.random() > 0.5,
        changeFee: Math.floor(Math.random() * 200),
        baggage: {
          carryOn: 1,
          checked: travelClass === "economy" ? 0 : 1 + Math.floor(Math.random() * 2)
        }
      })
    }

    return flights
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (fromCity && toCity && departureDate) {
      performSearch()
    }
  }

  const toggleSaveFlight = (flightId: string) => {
    const updated = savedFlights.includes(flightId)
      ? savedFlights.filter((id) => id !== flightId)
      : [...savedFlights, flightId]

    setSavedFlights(updated)
    localStorage.setItem("savedFlights", JSON.stringify(updated))
  }

  const toggleComparisonFlight = (flightId: string) => {
    const updated = comparisonFlights.includes(flightId)
      ? comparisonFlights.filter((id) => id !== flightId)
      : comparisonFlights.length < 3 ? [...comparisonFlights, flightId] : comparisonFlights

    setComparisonFlights(updated)
  }

  const handleSelectSeat = (flightId: string) => {
    setSelectedFlightForSeats(flightId)
    setShowSeatSelector(true)
  }

  const handleSetPriceAlert = () => {
    setShowPriceAlertModal(true)
  }

  const toggleFlightDetails = (flightId: string) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId)
  }

  const scrollToMap = () => {
    setShowMap(true)
    setTimeout(() => {
      mapRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const popularDestinations = [
    { city: "New York", code: "NYC", image: "/placeholder.svg?height=120&width=200&text=NYC" },
    { city: "London", code: "LHR", image: "/placeholder.svg?height=120&width=200&text=London" },
    { city: "Paris", code: "CDG", image: "/placeholder.svg?height=120&width=200&text=Paris" },
    { city: "Tokyo", code: "NRT", image: "/placeholder.svg?height=120&width=200&text=Tokyo" },
    { city: "Dubai", code: "DXB", image: "/placeholder.svg?height=120&width=200&text=Dubai" },
    { city: "Singapore", code: "SIN", image: "/placeholder.svg?height=120&width=200&text=Singapore" },
  ]

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Tabs */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Flight Search</h1>
              <p className="text-white/70">Find and book the perfect flights for your business travel</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 text-white hover:bg-white/10"
                onClick={handleSetPriceAlert}
              >
                <Bell className="h-4 w-4 mr-2" />
                Price Alerts
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 text-white hover:bg-white/10"
                onClick={() => setShowComparison(!showComparison)}
                disabled={comparisonFlights.length < 2}
              >
                <Layers className="h-4 w-4 mr-2" />
                Compare ({comparisonFlights.length})
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 text-white hover:bg-white/10"
                onClick={scrollToMap}
              >
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="search" className="data-[state=active]:bg-white/10">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-white/10">
                <Plane className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-white/10">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white/10">
                <Clock className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="search" className="mt-0 space-y-6">
          {/* Search Form */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Trip Type */}
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="round-trip"
                      checked={tripType === "round-trip"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-white"
                    />
                    <span className="text-white text-sm">Round Trip</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="one-way"
                      checked={tripType === "one-way"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-white"
                    />
                    <span className="text-white text-sm">One Way</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="multi-city"
                      checked={tripType === "multi-city"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-white"
                    />
                    <span className="text-white text-sm">Multi-City</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        placeholder="Departure city"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        placeholder="Destination city"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Departure</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Return</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        disabled={tripType === "one-way"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4 Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Class</Label>
                    <Select value={travelClass} onValueChange={setTravelClass}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium-economy">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Business Travel
                    </Badge>
                    <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                      <Wallet className="h-3 w-3 mr-1" />
                      Use Travel Budget
                    </Badge>
                    <Badge className="bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                      <Repeat className="h-3 w-3 mr-1" />
                      Flexible Dates
                    </Badge>
                  </div>

                  <Button type="submit" className="bg-white text-black hover:bg-white/90 rounded-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Flights
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Popular Destinations */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Popular Business Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularDestinations.map((destination) => (
                  <div
                    key={destination.code}
                    className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all group"
                    onClick={() => {
                      setToCity(destination.city)
                    }}
                  >
                    <div className="h-20 relative">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.city}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-1 left-2 right-2">
                        <p className="text-white font-medium text-xs">{destination.city}</p>
                        <p className="text-white/70 text-[10px]">{destination.code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Travel Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-full">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Price Trends</h3>
                </div>
                <p className="text-xs text-white/70">Prices for your route are currently 12% lower than average. Best time to book!</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-full">
                    <CloudSun className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Weather Forecast</h3>
                </div>
                <p className="text-xs text-white/70">Your destination has mild weather during your travel dates with average temperatures of 22°C.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-full">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Travel Tips</h3>
                </div>
                <p className="text-xs text-white/70">Business travelers recommend booking flights on Tuesday or Wednesday for this route.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0 space-y-6">
          {/* Flight Comparison */}
          {showComparison && comparisonFlights.length >= 2 && (
            <Card className="bg-white/5 border-white/10 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Flight Comparison</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => setShowComparison(false)}
                  >
                    <Minimize className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
                
                <FlightComparison 
                  flights={flights.filter(f => comparisonFlights.includes(f.id))} 
                  onSelect={(id) => {
                    // Handle booking the selected flight
                    router.push(`/booking/flight/${id}`)
                  }}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Map View */}
          {showMap && (
            <Card className="bg-white/5 border-white/10 mb-6" ref={mapRef}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Flight Routes Map</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => setShowMap(false)}
                  >
                    <Minimize className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
                
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <FlightMap 
                    flights={filteredFlights} 
                    selectedFlights={comparisonFlights}
                    onFlightSelect={toggleComparisonFlight}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <Card className="bg-white/5 border-white/10 lg:col-span-1 h-fit">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2"
                    onClick={() => {
                      // Reset all filters
                      setPriceRange([0, 2000])
                      setMaxDuration(24)
                      setSelectedAirlines([])
                      setDirectOnly(false)
                      setRefundableOnly(false)
                      setPolicyCompliantOnly(false)
                      setMinRating(0)
                      setDepartureTime([0, 24])
                      setArrivalTime([0, 24])
                      setSelectedAmenities([])
                    }}
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-xs">Price Range</Label>
                      <span className="text-white/70 text-xs">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider
                      min={0}
                      max={2000}
                      step={50}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-xs">Max Duration</Label>
                      <span className="text-white/70 text-xs">{maxDuration}h</span>
                    </div>
                    <Slider
                      min={1}
                      max={24}
                      step={1}
                      value={[maxDuration]}
                      onValueChange={(value) => setMaxDuration(value[0])}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Stops */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Stops</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={directOnly} 
                        onCheckedChange={setDirectOnly} 
                        className="data-[state=checked]:bg-white"
                      />
                      <span className="text-white/70 text-xs">Direct flights only</span>
                    </div>
                  </div>
                  
                  {/* Refundable */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Booking Options</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={refundableOnly} 
                        onCheckedChange={setRefundableOnly}
                        className="data-[state=checked]:bg-white"
                      />
                      <span className="text-white/70 text-xs">Refundable only</span>
                    </div>
                  </div>
                  
                  {/* Policy Compliant */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Travel Policy</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={policyCompliantOnly} 
                        onCheckedChange={setPolicyCompliantOnly}
                        className="data-[state=checked]:bg-white"
                      />
                      <span className="text-white/70 text-xs">Policy compliant only</span>
                    </div>
                  </div>
                  
                  {/* Airlines */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Airlines</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                      {Array.from(new Set(flights.map(f => f.airline))).map(airline => (
                        <div key={airline} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`airline-${airline}`}
                            checked={selectedAirlines.includes(airline)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAirlines([...selectedAirlines, airline])
                              } else {
                                setSelectedAirlines(selectedAirlines.filter(a => a !== airline))
                              }
                            }}
                            className="text-white"
                          />
                          <label htmlFor={`airline-${airline}`} className="text-white/70 text-xs cursor-pointer">
                            {airline}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Amenities</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                      {Array.from(new Set(flights.flatMap(f => f.amenities))).map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities([...selectedAmenities, amenity])
                              } else {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                              }
                            }}
                            className="text-white"
                          />
                          <label htmlFor={`amenity-${amenity}`} className="text-white/70 text-xs cursor-pointer">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              {/* Sorting and Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <ArrowUpDown className="h-4 w-4 text-white/70" />
                        <span className="text-white/70 text-sm">Sort:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recommended">Recommended</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="duration">Duration</SelectItem>
                            <SelectItem value="departure">Departure</SelectItem>
                            <SelectItem value="arrival">Arrival</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="text-white/70 text-sm">
                      {filteredFlights.length} flights found • {fromCity} to {toCity}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flight Results */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/70">Searching for the best flights...</p>
                  </div>
                </div>
              ) : filteredFlights.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No flights found</h3>
                    <p className="text-white/70 mb-4">Try adjusting your filters or search criteria.</p>
                    <Button 
                      onClick={() => {
                        // Reset filters
                        setPriceRange([0, 2000])
                        setMaxDuration(24)
                        setSelectedAirlines([])
                        setDirectOnly(false)
                        setRefundableOnly(false)
                      }}
                      className="bg-white text-black hover:bg-white/90"
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <Card 
                      key={flight.id} 
                      className={`bg-white/5 border-white/10 hover:bg-white/10 transition-colors ${
                        comparisonFlights.includes(flight.id) ? 'border-white/30 ring-1 ring-white/20' : ''
                      }`}
                    >
                      <CardContent className="p-0">
                        {/* Main Flight Info */}
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1">
                              {/* Airline */}
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                  <Plane className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{flight.airline}</p>
                                  <p className="text-white/50 text-xs">{flight.flightNumber}</p>
                                </div>
                              </div>

                              {/* Flight Details */}
                              <div className="flex items-center justify-between flex-1">
                                <div className="text-center">
                                  <div className="text-xl font-bold text-white">{flight.departure.time}</div>
                                  <div className="text-white/70 text-sm">{flight.departure.airport}</div>
                                  <div className="text-white/50 text-xs">{flight.departure.city}</div>
                                </div>

                                <div className="flex flex-col items-center mx-4">
                                  <div className="text-white/50 text-xs mb-1">{flight.duration}</div>
                                  <div className="w-16 md:w-24 lg:w-32 h-px bg-white/20 relative">
                                    {flight.stops > 0 && flight.stopDetails.map((stop, idx) => (
                                      <div 
                                        key={idx}
                                        className="absolute top-0 w-2 h-2 bg-white/50 rounded-full transform -translate-y-0.5"
                                        style={{ left: `${((idx + 1) / (flight.stops + 1)) * 100}%` }}
                                        title={`${stop.airport} - ${stop.duration} layover`}
                                      />
                                    ))}
                                    <div className="absolute right-0 top-0 w-2 h-2 bg-white/50 rounded-full transform translate-x-1 -translate-y-0.5" />
                                  </div>
                                  <div className="text-white/50 text-xs mt-1">
                                    {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-xl font-bold text-white">{flight.arrival.time}</div>
                                  <div className="text-white/70 text-sm">{flight.arrival.airport}</div>
                                  <div className="text-white/50 text-xs">{flight.arrival.city}</div>
                                </div>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">${flight.price}</div>
                                <div className="text-white/50 text-sm">{flight.class}</div>
                                <div className="flex items-center mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-white/70 text-xs ml-1">{flight.rating.toFixed(1)}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => toggleComparisonFlight(flight.id)}
                                  variant="outline"
                                  size="sm"
                                  className={`border-white/20 hover:bg-white/10 ${
                                    comparisonFlights.includes(flight.id) 
                                      ? 'bg-white/10 text-white' 
                                      : 'text-white/70'
                                  }`}
                                >
                                  <Layers className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => toggleSaveFlight(flight.id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  {savedFlights.includes(flight.id) ? (
                                    <BookmarkCheck className="h-4 w-4" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  className="bg-white text-black hover:bg-white/90 rounded-full"
                                  onClick={() => router.push(`/booking/flight/${flight.id}`)}
                                >
                                  Select
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Flight Tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {flight.travelPolicyCompliant && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                Policy Compliant
                              </Badge>
                            )}
                            {flight.refundable && (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                Refundable
                              </Badge>
                            )}
                            {flight.seatsAvailable < 5 && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                Only {flight.seatsAvailable} seats left
                              </Badge>
                            )}
                            {flight.onTimePerformance > 90 && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {flight.onTimePerformance}% On-time
                              </Badge>
                            )}
                          </div>
                          
                          {/* Expand/Collapse Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 text-white/70 hover:text-white hover:bg-white/5"
                            onClick={() => toggleFlightDetails(flight.id)}
                          >
                            {expandedFlightId === flight.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Show Details
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {/* Expanded Details */}
                        {expandedFlightId === flight.id && (
                          <div className="border-t border-white/10 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Flight Timeline */}
                              <div className="lg:col-span-2">
                                <h4 className="text-sm font-medium text-white mb-4">Flight Timeline</h4>
                                <FlightTimeline flight={flight} />
                              </div>
                              
                              {/* Flight Stats */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-4">Flight Information</h4>
                                <FlightStats flight={flight} />
                              </div>
                              
                              {/* Amenities */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-4">Amenities</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {flight.amenities.includes("Wi-Fi") && (
                                    <div className="flex items-center gap-2">
                                      <Wifi className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Wi-Fi</span>
                                    </div>
                                  )}
                                  {flight.amenities.includes("Power Outlets") && (
                                    <div className="flex items-center gap-2">
                                      <Power className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Power Outlets</span>
                                    </div>
                                  )}
                                  {flight.amenities.includes("In-flight Entertainment") && (
                                    <div className="flex items-center gap-2">
                                      <Monitor className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Entertainment</span>
                                    </div>
                                  )}
                                  {flight.amenities.includes("Premium Meals") && (
                                    <div className="flex items-center gap-2">
                                      <Utensils className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Premium Meals</span>
                                    </div>
                                  )}
                                  {flight.amenities.includes("Extra Legroom") && (
                                    <div className="flex items-center gap-2">
                                      <Maximize className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Extra Legroom</span>
                                    </div>
                                  )}
                                  {flight.amenities.includes("Lounge Access") && (
                                    <div className="flex items-center gap-2">
                                      <Coffee className="h-4 w-4 text-white/70" />
                                      <span className="text-white/70 text-xs">Lounge Access</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Baggage */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-4">Baggage Allowance</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-xs">Carry-on</span>
                                    <span className="text-white text-xs">{flight.baggage.carryOn} bag(s)</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-xs">Checked</span>
                                    <span className="text-white text-xs">{flight.baggage.checked} bag(s)</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Carbon Footprint */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-4">Carbon Footprint</h4>
                                <CarbonFootprint carbonFootprint={flight.carbonFootprint} />
                              </div>
                              
                              {/* Loyalty Points */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-4">Loyalty Program</h4>
                                <LoyaltyPoints points={flight.loyaltyPoints} airline={flight.airline} />
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-6">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => handleSelectSeat(flight.id)}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Select Seats
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Briefcase className="h-4 w-4 mr-2" />
                                Add to Trip
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Price Breakdown
                              </Button>
                              <Button 
                                \
