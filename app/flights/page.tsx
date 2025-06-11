"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline"
import flightsData from "@/data/flights.json"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  duration: string
  price: number
  class: string
}

function FlightsContent() {
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>(flightsData as Flight[])
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")

  useEffect(() => {
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
  }, [searchParams])

  const filteredFlights = flights.filter((flight) => {
    const matchesFrom = !fromCity || flight.departure.city.toLowerCase().includes(fromCity.toLowerCase())
    const matchesTo = !toCity || flight.arrival.city.toLowerCase().includes(toCity.toLowerCase())
    return matchesFrom && matchesTo
  })

  const handleSearch = () => {
    const filtered = flights.filter((flight) => {
      const matchesFrom = !fromCity || flight.departure.city.toLowerCase().includes(fromCity.toLowerCase())
      const matchesTo = !toCity || flight.arrival.city.toLowerCase().includes(toCity.toLowerCase())
      return matchesFrom && matchesTo
    })
    setFlights(filtered)
  }

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Flight Search</h1>
          <p className="text-white/70">Find the best flights for your business travel</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-white">
                From
              </Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="from"
                  placeholder="Departure city"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-white">
                To
              </Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="to"
                  placeholder="Destination city"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure" className="text-white">
                Departure
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="departure"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="return" className="text-white">
                Return
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="return"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  disabled={tripType === "one-way"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-white">
                Passengers
              </Label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4 Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip-type" className="text-white">
                Trip Type
              </Label>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="round-trip">Round Trip</SelectItem>
                  <SelectItem value="one-way">One Way</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSearch} className="mt-4 bg-white text-black hover:bg-white/90">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{filteredFlights.length} flights found</h2>
          </div>

          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{flight.departure.time}</div>
                      <div className="text-white/70 text-sm">{flight.departure.airport}</div>
                      <div className="text-white/50 text-xs">{flight.departure.city}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-white/50 text-sm mb-1">{flight.duration}</div>
                      <div className="w-16 h-px bg-white/20 relative">
                        <div className="absolute right-0 top-0 w-2 h-2 bg-white/50 rounded-full transform translate-x-1 -translate-y-0.5"></div>
                      </div>
                      <div className="text-white/50 text-xs mt-1">Direct</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{flight.arrival.time}</div>
                      <div className="text-white/70 text-sm">{flight.arrival.airport}</div>
                      <div className="text-white/50 text-xs">{flight.arrival.city}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">${flight.price}</div>
                    <div className="text-white/50 text-sm">{flight.class}</div>
                    <Button className="mt-2 bg-white text-black hover:bg-white/90">Select Flight</Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-white/70">{flight.airline}</span>
                    <span className="text-white/50">{flight.flightNumber}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                    {flight.class}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black p-3">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
            </div>
          </div>
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  )
}
