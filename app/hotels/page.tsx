"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Layout from "@/components/ui/layout"
import {
  Check,
  Calendar,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  Utensils,
  Car,
  Search,
  Users,
  CreditCard,
  Building,
} from "lucide-react"

import { SiAnthropic } from "react-icons/si"

// Sample hotels data
const allHotels = [
  {
    name: "Grand Hyatt",
    brand: "Hyatt",
    location: "New York",
    address: "109 East 42nd Street, Midtown, New York",
    checkIn: "May 15, 2025",
    checkOut: "May 18, 2025",
    price: "$320",
    priceTotal: "$960",
    rating: 4.8,
    amenities: ["Free Wi-Fi", "Business Center", "Fitness Center", "Restaurant", "Room Service"],
    distance: "0.5 miles from city center",
    image: "/images/grand-hyatt-ny.png",
    cancellation: "Free cancellation until May 12, 2025",
    roomType: "Executive King Room",
  },
  {
    name: "Marriott Downtown",
    brand: "Marriott",
    location: "New York",
    address: "85 West Street, Financial District, New York",
    checkIn: "May 15, 2025",
    checkOut: "May 18, 2025",
    price: "$280",
    priceTotal: "$840",
    rating: 4.6,
    amenities: ["Free Wi-Fi", "Business Center", "Pool", "Restaurant", "Parking"],
    distance: "1.2 miles from city center",
    image: "/images/marriott-downtown-ny.png",
    cancellation: "Free cancellation until May 13, 2025",
    roomType: "Deluxe Queen Room",
  },
  {
    name: "Hilton Midtown",
    brand: "Hilton",
    location: "New York",
    address: "1335 Avenue of the Americas, Midtown, New York",
    checkIn: "May 15, 2025",
    checkOut: "May 18, 2025",
    price: "$295",
    priceTotal: "$885",
    rating: 4.7,
    amenities: ["Free Wi-Fi", "Business Center", "Fitness Center", "Restaurant", "Conference Rooms"],
    distance: "0.3 miles from city center",
    image: "/images/hilton-midtown-ny.png",
    cancellation: "Free cancellation until May 14, 2025",
    roomType: "Business Suite",
  },
  {
    name: "Novotel Paris Centre",
    brand: "Accor",
    location: "Paris",
    address: "8 Place Marguerite de Navarre, 75001 Paris, France",
    checkIn: "June 10, 2025",
    checkOut: "June 15, 2025",
    price: "€210",
    priceTotal: "€1,050",
    rating: 4.5,
    amenities: ["Free Wi-Fi", "Fitness Center", "Restaurant", "Bar", "Meeting Rooms"],
    distance: "0.2 miles from Louvre Museum",
    image: "/images/novotel-paris.png",
    cancellation: "Free cancellation until June 5, 2025",
    roomType: "Superior Double Room",
  },
  {
    name: "Radisson Blu Tokyo",
    brand: "Radisson",
    location: "Tokyo",
    address: "2-7-2 Higashi Shimbashi, Minato-ku, Tokyo",
    checkIn: "July 5, 2025",
    checkOut: "July 10, 2025",
    price: "¥32,000",
    priceTotal: "¥160,000",
    rating: 4.7,
    amenities: ["Free Wi-Fi", "Spa", "Pool", "Multiple Restaurants", "Business Center", "Concierge"],
    distance: "0.8 miles from Tokyo Tower",
    image: "/images/radisson-tokyo.png",
    cancellation: "Free cancellation until July 1, 2025",
    roomType: "Premium Room with City View",
  },
  {
    name: "Wyndham Grand Berlin",
    brand: "Wyndham",
    location: "Berlin",
    address: "Hallesche Str. 10-14, 10963 Berlin, Germany",
    checkIn: "August 15, 2025",
    checkOut: "August 20, 2025",
    price: "€180",
    priceTotal: "€900",
    rating: 4.6,
    amenities: ["Free Wi-Fi", "Spa", "Indoor Pool", "Restaurant", "Bar", "Fitness Center"],
    distance: "1.5 km from Brandenburg Gate",
    image: "/images/wyndham-berlin.png",
    cancellation: "Free cancellation until August 10, 2025",
    roomType: "Deluxe King Room",
  },
  {
    name: "Marriott Madrid",
    brand: "Marriott",
    location: "Madrid",
    address: "Calle de Atocha 83, 28012 Madrid, Spain",
    checkIn: "June 5, 2025",
    checkOut: "June 10, 2025",
    price: "€195",
    priceTotal: "€975",
    rating: 4.7,
    amenities: ["Free Wi-Fi", "Rooftop Pool", "Spa", "Restaurant", "Fitness Center", "Business Center"],
    distance: "0.3 km from Puerta del Sol",
    image: "/images/hotels/marriott-madrid.png",
    cancellation: "Free cancellation until June 1, 2025",
    roomType: "Deluxe King Room",
  },
  {
    name: "NH Collection Barcelona",
    brand: "NH Hotels",
    location: "Barcelona",
    address: "Gran Via de les Corts Catalanes 668, 08010 Barcelona, Spain",
    checkIn: "July 12, 2025",
    checkOut: "July 16, 2025",
    price: "€175",
    priceTotal: "€700",
    rating: 4.6,
    amenities: ["Free Wi-Fi", "Restaurant", "Bar", "Fitness Center", "Meeting Rooms", "Concierge"],
    distance: "0.5 km from Plaza Catalunya",
    image: "/images/hotels/nh-collection-barcelona.png",
    cancellation: "Free cancellation until July 8, 2025",
    roomType: "Premium Room with City View",
  },
  {
    name: "Westin Valencia",
    brand: "Westin",
    location: "Valencia",
    address: "Amadeo de Saboya 16, 46010 Valencia, Spain",
    checkIn: "August 20, 2025",
    checkOut: "August 25, 2025",
    price: "€220",
    priceTotal: "€1,100",
    rating: 4.8,
    amenities: ["Free Wi-Fi", "Outdoor Pool", "Spa", "Restaurant", "Bar", "Fitness Center", "Room Service"],
    distance: "1.2 km from City of Arts and Sciences",
    image: "/images/hotels/westin-valencia.png",
    cancellation: "Free cancellation until August 15, 2025",
    roomType: "Deluxe Suite",
  },
]

export default function HotelsPage() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [checkInDate, setCheckInDate] = useState("2025-05-15")
  const [checkOutDate, setCheckOutDate] = useState("2025-05-18")
  const [filteredHotels, setFilteredHotels] = useState<any[]>([])
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [popularDestinations, setPopularDestinations] = useState<string[]>([])

  useEffect(() => {
    // Extract unique destinations for the dropdown
    const destinations = [...new Set(allHotels.map((hotel) => hotel.location))]
    setPopularDestinations(destinations)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination) return

    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      const filtered = allHotels.filter((hotel) => hotel.location.toLowerCase() === destination.toLowerCase())

      setFilteredHotels(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const handleSelectHotel = (index: number) => {
    setSelectedHotel(index === selectedHotel ? null : index)
  }

  const handleBookHotel = () => {
    setShowBookingConfirmation(true)
  }

  // Function to render amenity icon
  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("Wi-Fi")) return <Wifi className="h-3.5 w-3.5" />
    if (amenity.includes("Fitness")) return <Dumbbell className="h-3.5 w-3.5" />
    if (amenity.includes("Restaurant")) return <Utensils className="h-3.5 w-3.5" />
    if (amenity.includes("Coffee")) return <Coffee className="h-3.5 w-3.5" />
    if (amenity.includes("Parking")) return <Car className="h-3.5 w-3.5" />
    return <Check className="h-3.5 w-3.5" />
  }

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header with Anthropic branding */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg">
              <SiAnthropic className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full">
                  <Building className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">Hotel Search</span>
                </div>
              </div>

              <h1 className="text-lg font-medium text-white mb-0.5">Find the perfect accommodation</h1>
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
            <h2 className="text-xl font-medium tracking-tighter text-white text-center mb-2">Hotel Booked!</h2>
            <p className="text-white/70 text-center mb-4">
              Your hotel reservation has been confirmed. We've sent the details to your email.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Booking reference:</span>
                <span className="text-sm text-white">SUITPAX-H12345</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Hotel:</span>
                <span className="text-sm text-white">{filteredHotels[selectedHotel || 0].name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">Dates:</span>
                <span className="text-sm text-white">
                  {filteredHotels[selectedHotel || 0].checkIn} - {filteredHotels[selectedHotel || 0].checkOut}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/70">Total paid:</span>
                <span className="text-sm text-white">{filteredHotels[selectedHotel || 0].priceTotal}</span>
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
                        <MapPin className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="check-in" className="block text-xs font-medium text-white/70 mb-1">
                      Check-in
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="check-in"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="check-out" className="block text-xs font-medium text-white/70 mb-1">
                      Check-out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="check-out"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="guests" className="block text-xs font-medium text-white/70 mb-1">
                      Guests & Rooms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <select
                          id="guests"
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
                      <div className="relative">
                        <select
                          id="rooms"
                          className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                          defaultValue="1"
                        >
                          <option value="1" className="bg-black text-white">
                            1 Room
                          </option>
                          <option value="2" className="bg-black text-white">
                            2 Rooms
                          </option>
                          <option value="3" className="bg-black text-white">
                            3 Rooms
                          </option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-4 w-4 text-white/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hotel-class" className="block text-xs font-medium text-white/70 mb-1">
                      Hotel Class
                    </label>
                    <div className="relative">
                      <select
                        id="hotel-class"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="4"
                      >
                        <option value="3" className="bg-black text-white">
                          3 Stars & Up
                        </option>
                        <option value="4" className="bg-black text-white">
                          4 Stars & Up
                        </option>
                        <option value="5" className="bg-black text-white">
                          5 Stars Only
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Star className="h-4 w-4 text-white/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price-range" className="block text-xs font-medium text-white/70 mb-1">
                      Price Range
                    </label>
                    <div className="relative">
                      <select
                        id="price-range"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                        defaultValue="200-300"
                      >
                        <option value="0-200" className="bg-black text-white">
                          $0 - $200 per night
                        </option>
                        <option value="200-300" className="bg-black text-white">
                          $200 - $300 per night
                        </option>
                        <option value="300-500" className="bg-black text-white">
                          $300 - $500 per night
                        </option>
                        <option value="500+" className="bg-black text-white">
                          $500+ per night
                        </option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-white/50" />
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
                    <span className="text-xs">Search Hotels</span>
                  </button>
                </div>
              </form>
            </div>

            {isLoading && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Searching for hotels...</h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  We're finding the best accommodations for your stay.
                </p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tighter text-white">Results for: {destination}</h2>
                  <div className="flex items-center">
                    <span className="text-xs text-white/70 mr-2">Sort by:</span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                      <option className="bg-black text-white">Price: low to high</option>
                      <option className="bg-black text-white">Rating: highest first</option>
                      <option className="bg-black text-white">Distance: closest first</option>
                    </select>
                  </div>
                </div>

                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel, index) => (
                    <div
                      key={index}
                      className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                        selectedHotel === index ? "border-white/20" : "border-white/10"
                      } p-4 shadow-sm hover:border-white/20 transition-colors cursor-pointer`}
                      onClick={() => handleSelectHotel(index)}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
                          <Image
                            src={hotel.image || "/placeholder.svg?height=300&width=400&query=hotel"}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex items-center mb-4 md:mb-0">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mr-4">
                                  <Building className="w-6 h-6 text-white/70" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{hotel.name}</div>
                                  <div className="text-xs text-white/50">{hotel.brand}</div>
                                </div>
                              </div>
                              <p className="text-sm text-white/70 mb-2 flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-white/50" />
                                {hotel.address}
                              </p>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(hotel.rating) ? "text-yellow-400" : "text-white/20"
                                      }`}
                                      fill={i < Math.floor(hotel.rating) ? "currentColor" : "none"}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-white">{hotel.rating}</span>
                              </div>
                              <p className="text-sm text-white/70 mb-2">{hotel.distance}</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white">
                                    +{hotel.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                              <div className="text-lg font-medium text-white">{hotel.price}</div>
                              <div className="text-xs text-white/50">per night</div>
                              <div className="text-sm font-medium text-white mt-1">{hotel.priceTotal}</div>
                              <div className="text-xs text-white/50 mb-3">total for 3 nights</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedHotel === index && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Room Details</h4>
                              <p className="text-sm text-white/70 mb-1">
                                <span className="font-medium">Room Type:</span> {hotel.roomType}
                              </p>
                              <p className="text-sm text-white/70 mb-1">
                                <span className="font-medium">Check-in:</span> {hotel.checkIn} (after 3:00 PM)
                              </p>
                              <p className="text-sm text-white/70 mb-1">
                                <span className="font-medium">Check-out:</span> {hotel.checkOut} (before 12:00 PM)
                              </p>
                              <p className="text-sm text-white/70">{hotel.cancellation}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">All Amenities</h4>
                              <div className="grid grid-cols-2 gap-1">
                                {hotel.amenities.map((amenity, i) => (
                                  <div key={i} className="flex items-center">
                                    <div className="h-5 w-5 text-white/50 mr-1 flex items-center justify-center">
                                      {getAmenityIcon(amenity)}
                                    </div>
                                    <span className="text-sm text-white/70">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleBookHotel}
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
                      <div className="h-12 w-12 text-white/40 flex items-center justify-center">
                        <Building className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No hotels found</h3>
                    <p className="text-white/70 mb-4">
                      We couldn't find any hotels matching your search criteria. Please try different dates or
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
                        src="/images/team/genevieve-mclean.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/diverse-group.png"
                        }}
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/images/team/cohen-lozano.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/diverse-group.png"
                        }}
                      />
                    </div>
                    <div className="relative h-12 w-12">
                      <Image
                        src="/images/team/orlando-diggs.jpeg"
                        alt="Team Member"
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/diverse-group.png"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-medium tracking-tighter text-white mb-2">
                  Welcome to your hotel booking portal
                </h2>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Select your destination above to find available accommodations for your business trip.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setDestination("New York")
                      handleSearch(new Event("click") as any)
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
