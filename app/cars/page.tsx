"use client"

import type React from "react"
import { useState } from "react"
import { Car, Users, Star, Fuel, Settings, MapPin } from "lucide-react"

export default function CarsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("2025-05-15")
  const [dropoffDate, setDropoffDate] = useState("2025-05-17")
  const [showResults, setShowResults] = useState(false)

  const carRentals = [
    {
      id: 1,
      company: "Enterprise",
      model: "Toyota Camry",
      category: "Economy",
      passengers: 5,
      bags: 2,
      transmission: "Automatic",
      fuel: "Gasoline",
      price: "$45",
      priceTotal: "$135",
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300",
      features: ["GPS", "Bluetooth", "AC", "USB Ports"],
      mileage: "Unlimited",
      insurance: "Basic included",
    },
    {
      id: 2,
      company: "Hertz",
      model: "BMW 3 Series",
      category: "Luxury",
      passengers: 5,
      bags: 3,
      transmission: "Automatic",
      fuel: "Gasoline",
      price: "$89",
      priceTotal: "$267",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
      features: ["GPS", "Leather Seats", "Premium Audio", "Sunroof"],
      mileage: "Unlimited",
      insurance: "Premium included",
    },
    {
      id: 3,
      company: "Avis",
      model: "Ford Explorer",
      category: "SUV",
      passengers: 7,
      bags: 4,
      transmission: "Automatic",
      fuel: "Gasoline",
      price: "$67",
      priceTotal: "$201",
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=300",
      features: ["GPS", "4WD", "Roof Rack", "Towing Package"],
      mileage: "Unlimited",
      insurance: "Standard included",
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-md font-medium text-white mb-6">Car Rental</h1>

        {/* Search Form */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-white/70 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    id="pickup"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Airport, hotel, or address"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="dropoff" className="block text-sm font-medium text-white/70 mb-2">
                  Drop-off Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    id="dropoff"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Same as pickup or different"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="pickup-date" className="block text-sm font-medium text-white/70 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickup-date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label htmlFor="pickup-time" className="block text-sm font-medium text-white/70 mb-2">
                  Pickup Time
                </label>
                <select className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                  <option className="bg-black text-white">10:00 AM</option>
                  <option className="bg-black text-white">12:00 PM</option>
                  <option className="bg-black text-white">2:00 PM</option>
                  <option className="bg-black text-white">4:00 PM</option>
                </select>
              </div>
              <div>
                <label htmlFor="dropoff-date" className="block text-sm font-medium text-white/70 mb-2">
                  Drop-off Date
                </label>
                <input
                  type="date"
                  id="dropoff-date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                />
              </div>
              <div>
                <label htmlFor="dropoff-time" className="block text-sm font-medium text-white/70 mb-2">
                  Drop-off Time
                </label>
                <select className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white">
                  <option className="bg-black text-white">10:00 AM</option>
                  <option className="bg-black text-white">12:00 PM</option>
                  <option className="bg-black text-white">2:00 PM</option>
                  <option className="bg-black text-white">4:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium"
              >
                Search Cars
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-lg font-medium text-white">Available Cars</h2>
              <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                <option className="bg-black text-white">Price: Low to High</option>
                <option className="bg-black text-white">Price: High to Low</option>
                <option className="bg-black text-white">Rating: Highest</option>
                <option className="bg-black text-white">Company</option>
              </select>
            </div>

            {carRentals.map((car) => (
              <div
                key={car.id}
                className="bg-white/5 rounded-xl border border-white/10 p-6 shadow-sm hover:border-white/20 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={car.model}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{car.model}</h3>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white/70 ml-1">{car.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-white/70 mb-3">
                      {car.company} • <span className="px-2 py-1 bg-white/10 rounded-xl text-xs">{car.category}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-white/70">
                        <Users className="h-4 w-4 mr-2" />
                        {car.passengers} passengers
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Car className="h-4 w-4 mr-2" />
                        {car.bags} bags
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Settings className="h-4 w-4 mr-2" />
                        {car.transmission}
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Fuel className="h-4 w-4 mr-2" />
                        {car.fuel}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 text-white/90 text-xs rounded-xl">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1 text-center lg:text-right">
                    <div className="mb-4">
                      <p className="text-2xl font-medium text-white">{car.price}</p>
                      <p className="text-sm text-white/70">per day</p>
                      <p className="text-lg font-medium text-white/90 mt-1">Total: {car.priceTotal}</p>
                    </div>

                    <button className="w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium">
                      Book Now
                    </button>

                    <p className="text-xs text-white/50 mt-2">{car.insurance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showResults && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
            <Car className="h-12 w-12 mx-auto text-white/50 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Find Your Perfect Rental Car</h2>
            <p className="text-white/70 mb-6">
              Search from thousands of rental cars worldwide. Compare prices and book instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
