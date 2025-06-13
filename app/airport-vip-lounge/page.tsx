"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star, Sofa, Wifi, Coffee, Wine, Clock, DollarSign, CheckCircle } from "lucide-react"

interface Lounge {
  id: string
  name: string
  airportCode: string
  airportName: string
  location: string // e.g., Terminal 1, Airside, near Gate A5
  rating: number
  pricePerPass: number
  amenities: string[]
  openingHours: string
  imageUrl: string
  accessMethods: string[] // e.g., Priority Pass, LoungeKey, Pay-per-use
  capacityStatus: "low" | "medium" | "high"
}

const mockLounges: Lounge[] = [
  {
    id: "lounge1",
    name: "Sky Emerald Lounge",
    airportCode: "JFK",
    airportName: "John F. Kennedy International",
    location: "Terminal 4, Airside, Gate B22",
    rating: 4.5,
    pricePerPass: 55,
    amenities: ["wifi", "showers", "food", "bar", "quiet_zone"],
    openingHours: "24/7",
    imageUrl: "/placeholder.svg?height=200&width=300",
    accessMethods: ["Priority Pass", "DragonPass", "Pay-per-use"],
    capacityStatus: "medium",
  },
  {
    id: "lounge2",
    name: "The Centurion Lounge",
    airportCode: "LHR",
    airportName: "London Heathrow",
    location: "Terminal 3, Airside, Level 2",
    rating: 4.8,
    pricePerPass: 70,
    amenities: ["premium_food", "cocktail_bar", "spa_services", "wifi", "showers"],
    openingHours: "05:30 - 22:00",
    imageUrl: "/placeholder.svg?height=200&width=300",
    accessMethods: ["Amex Platinum", "Centurion Card"],
    capacityStatus: "high",
  },
  {
    id: "lounge3",
    name: "Star Alliance Lounge",
    airportCode: "CDG",
    airportName: "Charles de Gaulle Airport",
    location: "Terminal 1, Satellite 7",
    rating: 4.2,
    pricePerPass: 45,
    amenities: ["wifi", "snacks", "beverages", "business_center"],
    openingHours: "06:00 - 21:30",
    imageUrl: "/placeholder.svg?height=200&width=300",
    accessMethods: ["Star Alliance Gold", "Pay-per-use"],
    capacityStatus: "low",
  },
  {
    id: "lounge4",
    name: "Plaza Premium Lounge",
    airportCode: "DXB",
    airportName: "Dubai International",
    location: "Terminal 3, Concourse A",
    rating: 4.6,
    pricePerPass: 60,
    amenities: ["food", "showers", "wifi", "bar", "family_room"],
    openingHours: "24/7",
    imageUrl: "/placeholder.svg?height=200&width=300",
    accessMethods: ["Priority Pass", "LoungeMe", "Pay-per-use"],
    capacityStatus: "medium",
  },
]

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  showers: Users, // Placeholder, could be ShowerHead icon
  food: Coffee, // Placeholder, could be Utensils
  bar: Wine,
  quiet_zone: Sofa, // Placeholder
  premium_food: Utensils,
  cocktail_bar: Wine,
  spa_services: Star, // Placeholder
  snacks: Coffee, // Placeholder
  beverages: Wine, // Placeholder
  business_center: Briefcase,
  family_room: Users, // Placeholder
}

export default function AirportVipLoungePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [numGuests, setNumGuests] = useState("1")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedLoungeId, setSelectedLoungeId] = useState<string | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const filteredLounges = useMemo(() => {
    return mockLounges
      .filter(
        (lounge) =>
          lounge.airportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lounge.airportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lounge.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating
        if (sortBy === "price") return a.pricePerPass - b.pricePerPass
        return 0
      })
  }, [searchTerm, sortBy])

  const handleBookLounge = (lounge: Lounge) => {
    setSelectedLoungeId(lounge.id)
    // Simulate booking process
    setTimeout(() => {
      setBookingConfirmed(true)
    }, 1500)
  }

  if (bookingConfirmed && selectedLoungeId) {
    const bookedLounge = mockLounges.find((l) => l.id === selectedLoungeId)
    return (
      <div className="min-h-screen bg-black p-3 text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 w-full max-w-md backdrop-blur-sm text-center">
          <CardHeader>
            <div className="p-3 bg-green-500/20 rounded-full mb-3 inline-block">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <CardTitle className="text-xl font-medium text-white">Lounge Access Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-white/70">
              Your access to {bookedLounge?.name} at {bookedLounge?.airportCode} is confirmed for {numGuests} guest(s).
            </p>
            <p className="text-xs text-white/50">A confirmation email has been sent with your access details.</p>
            <Button
              onClick={() => {
                setBookingConfirmed(false)
                setSelectedLoungeId(null)
              }}
              className="w-full mt-3 bg-white text-black hover:bg-white/90 rounded-full"
            >
              Book Another Lounge
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
          <h1 className="text-2xl font-medium text-white">Airport VIP Lounge</h1>
        </header>

        {/* Search and Filter Bar */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search by Airport (e.g., JFK, London Heathrow)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 focus:bg-white/10"
                />
              </div>
              <Select value={numGuests} onValueChange={setNumGuests}>
                <SelectTrigger className="h-11 w-full md:w-[180px] bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                  <Users className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      {g} Guest{g > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full md:w-[180px] bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                  <ArrowUpDown className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "rating", label: "Rating" },
                    { value: "price", label: "Price" },
                  ].map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      Sort by {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lounge Listings */}
        {filteredLounges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLounges.map((lounge, index) => (
              <Card
                key={lounge.id}
                className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col backdrop-blur-sm overflow-hidden"
                style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={lounge.imageUrl || "/placeholder.svg"}
                    alt={lounge.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium text-white">{lounge.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 rounded-full border-opacity-50 ${lounge.capacityStatus === "low" ? "border-green-500 text-green-400 bg-green-500/10" : lounge.capacityStatus === "medium" ? "border-yellow-500 text-yellow-400 bg-yellow-500/10" : "border-red-500 text-red-400 bg-red-500/10"}`}
                    >
                      {lounge.capacityStatus} capacity
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70">
                    {lounge.airportName} ({lounge.airportCode}) - {lounge.location}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Math.round(lounge.rating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
                      />
                    ))}
                    <span className="text-xs text-white/70 ml-1">({lounge.rating.toFixed(1)})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {lounge.amenities.slice(0, 5).map((amenity) => {
                      const Icon = amenityIcons[amenity] || Sofa
                      return (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5 capitalize"
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {amenity.replace("_", " ")}
                        </Badge>
                      )
                    })}
                  </div>
                  <p className="text-xs text-white/50">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {lounge.openingHours}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-white/10 p-3 flex justify-between items-center">
                  <p className="text-lg font-semibold text-white">
                    <DollarSign className="h-4 w-4 inline relative -top-0.5" />
                    {lounge.pricePerPass} <span className="text-xs font-normal text-white/50">/ pass</span>
                  </p>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white/90 rounded-full"
                    onClick={() => handleBookLounge(lounge)}
                  >
                    Book Access
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-10 text-center">
              <Sofa className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-white">No Lounges Found</h3>
              <p className="text-white/70 mt-1">Try a different airport or broaden your search.</p>
            </CardContent>
          </Card>
        )}
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
