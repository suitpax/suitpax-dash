"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/dashboard-layout"
import { ExportModal } from "@/components/ui/export-modal"
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
  Download,
  Filter,
  Heart,
  Share,
} from "lucide-react"

// Enhanced hotels data
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
    reviews: 1247,
    amenities: ["Free Wi-Fi", "Business Center", "Fitness Center", "Restaurant", "Room Service"],
    distance: "0.5 miles from city center",
    image: "/images/grand-hyatt-ny.png",
    cancellation: "Free cancellation until May 12, 2025",
    roomType: "Executive King Room",
    sustainability: "Green certified",
    dealType: "Best Price",
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
    reviews: 892,
    amenities: ["Free Wi-Fi", "Business Center", "Pool", "Restaurant", "Parking"],
    distance: "1.2 miles from city center",
    image: "/images/marriott-downtown-ny.png",
    cancellation: "Free cancellation until May 13, 2025",
    roomType: "Deluxe Queen Room",
    sustainability: "Eco-friendly",
    dealType: "Popular Choice",
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
  const [showExportModal, setShowExportModal] = useState(false)
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination) return

    setIsLoading(true)
    setShowResults(false)

    setTimeout(() => {
      let filtered = allHotels.filter((hotel) => hotel.location.toLowerCase() === destination.toLowerCase())

      // Apply sorting
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case "price":
            return Number.parseInt(a.price.replace(/[$€,]/g, "")) - Number.parseInt(b.price.replace(/[$€,]/g, ""))
          case "rating":
            return b.rating - a.rating
          case "distance":
            return Number.parseFloat(a.distance.split(" ")[0]) - Number.parseFloat(b.distance.split(" ")[0])
          default:
            return 0
        }
      })

      setFilteredHotels(filtered)
      setIsLoading(false)
      setShowResults(true)
    }, 800)
  }

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(index)) {
      newFavorites.delete(index)
    } else {
      newFavorites.add(index)
    }
    setFavorites(newFavorites)
  }

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("Wi-Fi")) return <Wifi className="h-4 w-4" />
    if (amenity.includes("Fitness")) return <Dumbbell className="h-4 w-4" />
    if (amenity.includes("Restaurant")) return <Utensils className="h-4 w-4" />
    if (amenity.includes("Coffee")) return <Coffee className="h-4 w-4" />
    if (amenity.includes("Parking")) return <Car className="h-4 w-4" />
    return <Check className="h-4 w-4" />
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-white mb-2">Hotel Search</h1>
              <p className="text-white/70">Find and book the perfect accommodation for your business trip</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm">Export</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors">
                <Filter size={16} />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Destination</label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select destination
                    </option>
                    <option value="New York" className="bg-black text-white">
                      New York
                    </option>
                    <option value="London" className="bg-black text-white">
                      London
                    </option>
                    <option value="Paris" className="bg-black text-white">
                      Paris
                    </option>
                    <option value="Tokyo" className="bg-black text-white">
                      Tokyo
                    </option>
                  </select>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Check-in</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Check-out</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Guests</label>
                <div className="relative">
                  <select className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none">
                    <option value="1" className="bg-black text-white">
                      1 Guest
                    </option>
                    <option value="2" className="bg-black text-white">
                      2 Guests
                    </option>
                  </select>
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Search size={16} />
                <span>Search Hotels</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sort and Filter Controls */}
        {showResults && (
          <div className="bg-black/95 rounded-lg border border-white/10 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    <option value="price" className="bg-black">
                      Price
                    </option>
                    <option value="rating" className="bg-black">
                      Rating
                    </option>
                    <option value="distance" className="bg-black">
                      Distance
                    </option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-white/70">{filteredHotels.length} hotels found</div>
            </div>
          </div>
        )}

        {/* Enhanced Hotel Results */}
        {showResults && !isLoading && (
          <div className="space-y-6">
            {filteredHotels.map((hotel, index) => (
              <div
                key={index}
                className={`bg-black/95 backdrop-blur-sm rounded-xl border ${
                  selectedHotel === index ? "border-white/20" : "border-white/10"
                } overflow-hidden shadow-sm hover:border-white/20 transition-colors`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Hotel Image */}
                  <div className="lg:w-1/3 relative h-64 lg:h-auto">
                    <Image
                      src={hotel.image || "/placeholder.svg?height=300&width=400&query=luxury hotel"}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      {hotel.dealType && (
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          {hotel.dealType}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(index)}
                        className={`p-2 rounded-full backdrop-blur-sm ${
                          favorites.has(index) ? "bg-red-500 text-white" : "bg-black/50 text-white/70"
                        } hover:bg-red-500 hover:text-white transition-colors`}
                      >
                        <Heart size={16} fill={favorites.has(index) ? "currentColor" : "none"} />
                      </button>
                      <button className="p-2 rounded-full bg-black/50 text-white/70 hover:bg-black/70 transition-colors backdrop-blur-sm">
                        <Share size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-medium text-white">{hotel.name}</h3>
                          <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
                            {hotel.brand}
                          </span>
                          {hotel.sustainability && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                              {hotel.sustainability}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-white/20"
                                }`}
                              />
                            ))}
                            <span className="text-sm font-medium text-white ml-1">{hotel.rating}</span>
                            <span className="text-sm text-white/50">({hotel.reviews} reviews)</span>
                          </div>
                        </div>

                        <p className="text-sm text-white/70 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-white/50" />
                          {hotel.address}
                        </p>

                        <p className="text-sm text-white/70 mb-4">{hotel.distance}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 4).map((amenity, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white/5 rounded-full px-3 py-1">
                              <div className="text-white/50">{getAmenityIcon(amenity)}</div>
                              <span className="text-xs font-medium text-white/70">{amenity}</span>
                            </div>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                              +{hotel.amenities.length - 4} more
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-emerald-400">{hotel.cancellation}</p>
                      </div>

                      <div className="text-right lg:min-w-[120px]">
                        <div className="text-2xl font-bold text-white">{hotel.price}</div>
                        <div className="text-sm text-white/50">per night</div>
                        <div className="text-lg font-medium text-white mt-1">{hotel.priceTotal}</div>
                        <div className="text-sm text-white/50 mb-4">total for 3 nights</div>

                        <button
                          onClick={() => setSelectedHotel(index === selectedHotel ? null : index)}
                          className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mb-2"
                        >
                          {selectedHotel === index ? "Hide Details" : "View Details"}
                        </button>

                        <button
                          onClick={() => setShowBookingConfirmation(true)}
                          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedHotel === index && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-white mb-3">Room Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-white/70">Room Type:</span>
                                <span className="text-white">{hotel.roomType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Check-in:</span>
                                <span className="text-white">{hotel.checkIn} (after 3:00 PM)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Check-out:</span>
                                <span className="text-white">{hotel.checkOut} (before 12:00 PM)</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-white mb-3">All Amenities</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {hotel.amenities.map((amenity, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="text-white/50">{getAmenityIcon(amenity)}</div>
                                  <span className="text-sm text-white/70">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Modal */}
        <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} dataType="hotels" />

        {/* Booking Confirmation Modal */}
        {showBookingConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-medium text-white mb-2">Hotel Booked!</h2>
                <p className="text-white/70 mb-6">
                  Your hotel reservation has been confirmed. We've sent the details to your email.
                </p>
                <button
                  onClick={() => {
                    setShowBookingConfirmation(false)
                    router.push("/dashboard")
                  }}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
