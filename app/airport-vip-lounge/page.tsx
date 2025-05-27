"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Users, Star, CreditCard } from "lucide-react"

const lounges = [
  {
    id: 1,
    name: "The Executive Lounge",
    airport: "JFK Terminal 4",
    location: "New York, USA",
    rating: 4.8,
    reviews: 1247,
    price: "$65",
    duration: "3 hours",
    image: "/contemporary-airport-retreat.png",
    amenities: ["Premium WiFi", "Gourmet Dining", "Shower Facilities", "Business Center"],
    description: "Luxurious retreat with panoramic runway views and premium amenities.",
    features: ["Quiet zones", "Meeting rooms", "Premium bar", "Concierge service"],
  },
  {
    id: 2,
    name: "Sky Club Premium",
    airport: "LAX Terminal 2",
    location: "Los Angeles, USA",
    rating: 4.7,
    reviews: 892,
    price: "$55",
    duration: "4 hours",
    image: "/sophisticated-airport-retreat.png",
    amenities: ["High-Speed WiFi", "Fine Dining", "Spa Services", "Private Pods"],
    description: "Modern lounge featuring contemporary design and world-class service.",
    features: ["Sleep pods", "Wellness center", "Craft cocktails", "City views"],
  },
  {
    id: 3,
    name: "Platinum Sanctuary",
    airport: "LHR Terminal 5",
    location: "London, UK",
    rating: 4.9,
    reviews: 1563,
    price: "$75",
    duration: "5 hours",
    image: "/upscale-airport-dining.png",
    amenities: ["Ultra-Fast WiFi", "Michelin Dining", "Full Spa", "Private Suites"],
    description: "The pinnacle of airport luxury with exclusive amenities and personalized service.",
    features: ["Private suites", "Personal butler", "Champagne bar", "Library"],
  },
  {
    id: 4,
    name: "Wellness Retreat",
    airport: "NRT Terminal 1",
    location: "Tokyo, Japan",
    rating: 4.6,
    reviews: 734,
    price: "$45",
    duration: "3 hours",
    image: "/serene-airport-spa.png",
    amenities: ["Free WiFi", "Healthy Cuisine", "Meditation Room", "Massage Services"],
    description: "Zen-inspired lounge focused on wellness and relaxation before your flight.",
    features: ["Meditation garden", "Yoga studio", "Healthy menu", "Aromatherapy"],
  },
]

export default function AirportVIPLoungePage() {
  const [selectedLounge, setSelectedLounge] = useState<number | null>(null)
  const [bookingStep, setBookingStep] = useState<"browse" | "details" | "booking">("browse")

  const handleBookLounge = (loungeId: number) => {
    setSelectedLounge(loungeId)
    setBookingStep("details")
  }

  const handleConfirmBooking = () => {
    setBookingStep("booking")
  }

  const selectedLoungeData = lounges.find((lounge) => lounge.id === selectedLounge)

  return (
    <div className="min-h-screen bg-black">
      {/* Header específico de Airport VIP Lounge */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Airport VIP Lounge</h1>
            <p className="text-sm text-white/70 mt-1">Access premium airport lounges worldwide</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Premium Access</Badge>
          </div>
        </div>
      </div>

      {bookingStep === "browse" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Find Your Perfect Lounge</CardTitle>
              <CardDescription className="text-white/70">
                Search and filter premium airport lounges by location, amenities, and price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Airport</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="">All Airports</option>
                    <option value="jfk">JFK - New York</option>
                    <option value="lax">LAX - Los Angeles</option>
                    <option value="lhr">LHR - London</option>
                    <option value="nrt">NRT - Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Duration</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="">Any Duration</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Price Range</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="">Any Price</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-70">$50 - $70</option>
                    <option value="70+">$70+</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lounges Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lounges.map((lounge) => (
              <Card
                key={lounge.id}
                className="bg-black/30 border-white/10 overflow-hidden hover:bg-white/5 transition-colors"
              >
                <div className="relative h-48">
                  <Image src={lounge.image || "/placeholder.svg"} alt={lounge.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/80 text-white border-white/20">{lounge.price}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">{lounge.name}</h3>
                      <div className="flex items-center text-white/70 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {lounge.airport} • {lounge.location}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-white font-medium">{lounge.rating}</span>
                      <span className="text-white/50 text-sm ml-1">({lounge.reviews})</span>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{lounge.description}</p>

                  <div className="flex items-center text-white/70 text-sm mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    Up to {lounge.duration} access
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {lounge.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center text-xs text-white/70">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                        {amenity}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleBookLounge(lounge.id)}
                    className="w-full bg-white text-black hover:bg-white/90"
                  >
                    Book Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {bookingStep === "details" && selectedLoungeData && (
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => setBookingStep("browse")} className="mb-6 bg-white/10 text-white hover:bg-white/20">
            ← Back to Lounges
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedLoungeData.image || "/placeholder.svg"}
                  alt={selectedLoungeData.name}
                  fill
                  className="object-cover"
                />
              </div>

              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Core Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedLoungeData.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-sm text-white/70">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Special Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedLoungeData.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-white/70">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">{selectedLoungeData.name}</CardTitle>
                  <CardDescription className="text-white/70">
                    {selectedLoungeData.airport} • {selectedLoungeData.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-white font-medium">{selectedLoungeData.rating}</span>
                      <span className="text-white/50 ml-1">({selectedLoungeData.reviews} reviews)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{selectedLoungeData.price}</div>
                      <div className="text-sm text-white/70">per person</div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/70 mb-4">{selectedLoungeData.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center text-white/70">
                        <Clock className="h-4 w-4 mr-2" />
                        Access duration: Up to {selectedLoungeData.duration}
                      </div>
                      <div className="flex items-center text-white/70">
                        <Users className="h-4 w-4 mr-2" />
                        Capacity: Premium experience with limited guests
                      </div>
                      <div className="flex items-center text-white/70">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment: All major cards accepted
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-white text-black hover:bg-white/90"
                    size="lg"
                  >
                    Confirm Booking - {selectedLoungeData.price}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {bookingStep === "booking" && selectedLoungeData && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/30 border-white/10">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-white text-xl">Booking Confirmed!</CardTitle>
              <CardDescription className="text-white/70">Your VIP lounge access has been reserved</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Lounge:</span>
                    <span className="text-white">{selectedLoungeData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Location:</span>
                    <span className="text-white">{selectedLoungeData.airport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">Up to {selectedLoungeData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Price:</span>
                    <span className="text-white font-medium">{selectedLoungeData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Booking ID:</span>
                    <span className="text-white font-mono">VIP-{Date.now().toString().slice(-6)}</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-white/70 text-sm">
                  A confirmation email has been sent to your registered email address. Please present this booking
                  confirmation at the lounge entrance.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setBookingStep("browse")
                      setSelectedLounge(null)
                    }}
                    className="flex-1 bg-white/10 text-white hover:bg-white/20"
                  >
                    Book Another Lounge
                  </Button>
                  <Button onClick={() => window.print()} className="flex-1 bg-white text-black hover:bg-white/90">
                    Print Confirmation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
