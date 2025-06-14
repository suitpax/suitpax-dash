"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GoogleMap } from "@/components/ui/google-map"
import {
  PiCar,
  PiMapPin,
  PiCalendar,
  PiUsers,
  PiClock,
  PiMagnifyingGlass,
  PiCheckCircle,
  PiPlus,
  PiPencilSimple,
  PiXCircle,
} from "react-icons/pi"

interface Transfer {
  id: string
  type: "Airport Transfer" | "City Transfer" | "Hourly Hire"
  from: string
  to: string
  fromCoords?: { lat: number; lng: number }
  toCoords?: { lat: number; lng: number }
  date: string
  time: string
  vehicleType: string
  vehicleModel?: string
  passengers: number
  price: number
  status: "confirmed" | "pending" | "cancelled"
  driverName?: string
  driverRating?: number
  imageUrl: string
}

const mockTransfers: Transfer[] = [
  {
    id: "trn1",
    type: "Airport Transfer",
    from: "JFK Airport, Terminal 4",
    to: "The Plaza Hotel, Manhattan",
    fromCoords: { lat: 40.6413, lng: -73.7781 },
    toCoords: { lat: 40.7648, lng: -73.9808 },
    date: "2024-07-15",
    time: "14:30",
    vehicleType: "Luxury Sedan",
    vehicleModel: "Mercedes S-Class",
    passengers: 2,
    price: 120,
    status: "confirmed",
    driverName: "John D.",
    driverRating: 4.9,
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
  {
    id: "trn2",
    type: "City Transfer",
    from: "Grand Hyatt, Downtown",
    to: "Convention Center Hall B",
    fromCoords: { lat: 40.7505, lng: -73.9934 },
    toCoords: { lat: 40.7589, lng: -73.9851 },
    date: "2024-07-16",
    time: "09:00",
    vehicleType: "Business Van",
    vehicleModel: "Mercedes V-Class",
    passengers: 5,
    price: 75,
    status: "pending",
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
  {
    id: "trn3",
    type: "Hourly Hire",
    from: "Financial District",
    to: "Multiple Meetings",
    fromCoords: { lat: 40.7074, lng: -74.0113 },
    toCoords: { lat: 40.7589, lng: -73.9851 },
    date: "2024-07-17",
    time: "10:00 (4 hours)",
    vehicleType: "Executive SUV",
    vehicleModel: "BMW X5",
    passengers: 3,
    price: 320,
    status: "confirmed",
    driverName: "Maria S.",
    driverRating: 4.7,
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
  {
    id: "trn4",
    type: "Airport Transfer",
    from: "LHR Airport, Terminal 5",
    to: "The Savoy, Strand",
    fromCoords: { lat: 51.47, lng: -0.4543 },
    toCoords: { lat: 51.5104, lng: -0.1201 },
    date: "2024-08-01",
    time: "18:00",
    vehicleType: "Sedan",
    vehicleModel: "Toyota Camry",
    passengers: 1,
    price: 85,
    status: "cancelled",
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
]

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState<"book" | "upcoming" | "past">("book")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | undefined>()
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | undefined>()
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0])
  const [transferTime, setTransferTime] = useState("10:00")
  const [numPassengers, setNumPassengers] = useState("1")
  const [vehiclePreference, setVehiclePreference] = useState("any")
  const [showMap, setShowMap] = useState(false)

  const [searchResults, setSearchResults] = useState<Transfer[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)

  const handleSearchTransfers = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSearch(true)
    setShowMap(true)

    // Simulate geocoding for demo purposes
    if (pickupLocation && !pickupCoords) {
      setPickupCoords({ lat: 40.7128 + Math.random() * 0.1, lng: -74.006 + Math.random() * 0.1 })
    }
    if (dropoffLocation && !dropoffCoords) {
      setDropoffCoords({ lat: 40.7128 + Math.random() * 0.1, lng: -74.006 + Math.random() * 0.1 })
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = mockTransfers
      .filter((t) => t.type !== "Hourly Hire")
      .map((t) => ({
        ...t,
        id: `search-${Math.random().toString(36).substring(2, 9)}`,
        from: pickupLocation || t.from,
        to: dropoffLocation || t.to,
        fromCoords: pickupCoords || t.fromCoords,
        toCoords: dropoffCoords || t.toCoords,
        date: transferDate,
        time: transferTime,
        passengers: Number.parseInt(numPassengers),
        price: t.price + (Math.random() * 50 - 25),
      }))
      .slice(0, 3 + Math.floor(Math.random() * 3))

    setSearchResults(results)
    setLoadingSearch(false)
    setActiveTab("book")
  }

  const handleBookTransfer = (transfer: Transfer) => {
    setSelectedTransfer(transfer)
    setTimeout(() => {
      setBookingConfirmed(true)
    }, 1200)
  }

  const handleLocationSelect = (location: { lat: number; lng: number }, type: "pickup" | "dropoff") => {
    if (type === "pickup") {
      setPickupCoords(location)
      // In a real app, you'd reverse geocode to get the address
      setPickupLocation(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
    } else {
      setDropoffCoords(location)
      setDropoffLocation(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
    }
  }

  const getStatusBadge = (status: Transfer["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <PiCheckCircle className="h-3 w-3 mr-1.5" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <PiClock className="h-3 w-3 mr-1.5" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <PiXCircle className="h-3 w-3 mr-1.5" />
            Cancelled
          </Badge>
        )
    }
  }

  const transfersToShow = useMemo(() => {
    const now = new Date()
    if (activeTab === "upcoming")
      return mockTransfers.filter((t) => new Date(`${t.date}T${t.time}`) >= now && t.status === "confirmed")
    if (activeTab === "past")
      return mockTransfers.filter((t) => new Date(`${t.date}T${t.time}`) < now || t.status === "cancelled")
    return []
  }, [activeTab])

  if (bookingConfirmed && selectedTransfer) {
    return (
      <div className="min-h-screen bg-black p-3 text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 w-full max-w-md backdrop-blur-sm text-center">
          <CardHeader>
            <div className="p-3 bg-green-500/20 rounded-full mb-3 inline-block">
              <PiCheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <CardTitle className="text-xl font-medium text-white">Transfer Booked!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-white/70">
              Your {selectedTransfer.vehicleType} from {selectedTransfer.from} to {selectedTransfer.to} is confirmed.
            </p>
            <p className="text-xs text-white/50">
              Date: {selectedTransfer.date} at {selectedTransfer.time}
            </p>
            <Button
              onClick={() => {
                setBookingConfirmed(false)
                setSelectedTransfer(null)
                setSearchResults([])
                setShowMap(false)
                setActiveTab("book")
              }}
              className="w-full mt-3 bg-white text-black hover:bg-white/90 rounded-full"
            >
              Book Another Transfer
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-medium text-white">Transfers</h1>
              <p className="text-sm text-white/70 mt-1">Manage your ground transportation seamlessly.</p>
            </div>
            <Button
              className="mt-3 md:mt-0 bg-white text-black hover:bg-white/90 rounded-full"
              onClick={() => setActiveTab("book")}
            >
              <PiPlus className="h-4 w-4 mr-2" /> Book New Transfer
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-1">
          {(["book", "upcoming", "past"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className={`capitalize text-sm px-3 py-1.5 h-auto rounded-full ${
                activeTab === tab
                  ? "bg-white text-black hover:bg-white/90"
                  : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab === "book" ? (
                <PiMagnifyingGlass className="h-4 w-4 mr-1.5" />
              ) : tab === "upcoming" ? (
                <PiClock className="h-4 w-4 mr-1.5" />
              ) : (
                <PiCalendar className="h-4 w-4 mr-1.5" />
              )}
              {tab}
            </Button>
          ))}
        </div>

        {/* Content based on tab */}
        {activeTab === "book" && (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Search Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Find a Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchTransfers} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputWithIcon
                      icon={<PiMapPin className="h-4 w-4 text-white/50" />}
                      placeholder="Pickup Location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      required
                    />
                    <InputWithIcon
                      icon={<PiMapPin className="h-4 w-4 text-white/50" />}
                      placeholder="Drop-off Location"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <InputWithIcon
                      icon={<PiCalendar className="h-4 w-4 text-white/50" />}
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      required
                    />
                    <InputWithIcon
                      icon={<PiClock className="h-4 w-4 text-white/50" />}
                      type="time"
                      value={transferTime}
                      onChange={(e) => setTransferTime(e.target.value)}
                      required
                    />
                    <Select value={numPassengers} onValueChange={setNumPassengers}>
                      <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                        <PiUsers className="h-4 w-4 text-white/50 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                          <SelectItem key={p} value={String(p)}>
                            {p} Passenger{p > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={vehiclePreference} onValueChange={setVehiclePreference}>
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                      <PiCar className="h-4 w-4 text-white/50 mr-2" />
                      <SelectValue placeholder="Vehicle Preference (Any)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Vehicle</SelectItem>
                      <SelectItem value="sedan">Sedan (1-3 passengers)</SelectItem>
                      <SelectItem value="suv">SUV (1-5 passengers)</SelectItem>
                      <SelectItem value="van">Van (1-8 passengers)</SelectItem>
                      <SelectItem value="luxury">Luxury (1-3 passengers)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-white text-black hover:bg-white/90 rounded-full"
                    disabled={loadingSearch}
                  >
                    {loadingSearch ? (
                      <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    ) : (
                      <PiMagnifyingGlass className="h-4 w-4 mr-2" />
                    )}
                    {loadingSearch ? "Searching..." : "Search Transfers"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            {showMap && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Route Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    pickup={pickupCoords}
                    dropoff={dropoffCoords}
                    className="w-full h-64 rounded-xl"
                    onLocationSelect={handleLocationSelect}
                    showRoute={!!(pickupCoords && dropoffCoords)}
                    style="uber"
                  />
                  <p className="text-xs text-white/50 mt-2">Click on the map to set pickup and dropoff locations</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !loadingSearch && activeTab === "book" && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Available Transfers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {searchResults.map((transfer, index) => (
                <Card
                  key={transfer.id}
                  className="bg-white/10 border-white/20 hover:border-white/30 transition-all"
                  style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
                >
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={transfer.imageUrl || "/placeholder.svg"}
                      alt={transfer.vehicleType}
                      className="w-full md:w-1/3 h-32 md:h-auto object-cover rounded-l-lg"
                    />
                    <div className="p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white">
                          {transfer.vehicleType}{" "}
                          <span className="text-xs text-white/60">({transfer.vehicleModel})</span>
                        </h4>
                        <p className="text-lg font-semibold text-white">${transfer.price.toFixed(0)}</p>
                      </div>
                      <p className="text-xs text-white/70 mt-1">
                        {transfer.passengers} passengers • Est. {Math.floor(Math.random() * 30 + 15)} min
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-white/90 rounded-full"
                          onClick={() => handleBookTransfer(transfer)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && !loadingSearch && pickupLocation && activeTab === "book" && (
          <div className="text-center py-6">
            <PiCar className="h-10 w-10 text-white/30 mx-auto mb-2" />
            <p className="text-white/70">No transfers found for your criteria.</p>
          </div>
        )}

        {(activeTab === "upcoming" || activeTab === "past") &&
          (transfersToShow.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {transfersToShow.map((transfer, index) => (
                <Card
                  key={transfer.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm"
                  style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
                >
                  <div className="flex">
                    <img
                      src={transfer.imageUrl || "/placeholder.svg"}
                      alt={transfer.vehicleType}
                      className="w-1/3 h-auto object-cover rounded-l-lg hidden md:block"
                    />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-white">{transfer.type}</h3>
                        {getStatusBadge(transfer.status)}
                      </div>
                      <p className="text-xs text-white/50 mb-2">
                        {transfer.vehicleType} ({transfer.vehicleModel})
                      </p>

                      <div className="text-xs space-y-1 text-white/70">
                        <p>
                          <span className="font-medium text-white/90">From:</span> {transfer.from}
                        </p>
                        <p>
                          <span className="font-medium text-white/90">To:</span> {transfer.to}
                        </p>
                        <p>
                          <span className="font-medium text-white/90">Date:</span> {transfer.date} at {transfer.time}
                        </p>
                        <p>
                          <span className="font-medium text-white/90">Price:</span> ${transfer.price}
                        </p>
                      </div>
                      {transfer.driverName && (
                        <p className="text-xs text-white/70 mt-1">
                          Driver: {transfer.driverName} (⭐ {transfer.driverRating})
                        </p>
                      )}
                      {activeTab === "upcoming" && transfer.status === "confirmed" && (
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            <PiPencilSimple className="h-3 w-3 mr-1" />
                            Modify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <PiXCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <PiCar className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-white">No {activeTab} transfers</h3>
                <p className="text-white/70 mt-1">You currently have no {activeTab} transfers scheduled.</p>
              </CardContent>
            </Card>
          ))}
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
