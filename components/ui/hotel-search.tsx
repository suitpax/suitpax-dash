"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon, StarIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

// Datos de ejemplo
const cities = [
  { id: 1, name: "Madrid", code: "MAD" },
  { id: 2, name: "Barcelona", code: "BCN" },
  { id: 3, name: "London", code: "LHR" },
  { id: 4, name: "Paris", code: "CDG" },
  { id: 5, name: "New York", code: "JFK" },
  { id: 6, name: "Tokyo", code: "HND" },
  { id: 7, name: "Berlin", code: "BER" },
  { id: 8, name: "Rome", code: "FCO" },
  { id: 9, name: "Amsterdam", code: "AMS" },
  { id: 10, name: "Dubai", code: "DXB" },
]

const hotelChains = [
  { id: 1, name: "Marriott" },
  { id: 2, name: "Hilton" },
  { id: 3, name: "Hyatt" },
  { id: 4, name: "NH Hotels" },
  { id: 5, name: "Iberostar" },
  { id: 6, name: "Meliá" },
  { id: 7, name: "Radisson" },
  { id: 8, name: "Westin" },
  { id: 9, name: "Four Seasons" },
  { id: 10, name: "Novotel" },
]

// Imágenes de hoteles
const hotelImages = [
  "/images/hotels/marriott-madrid.png",
  "/images/hotels/nh-collection-barcelona.png",
  "/images/hotels/westin-valencia.png",
  "/images/grand-hyatt-ny.png",
  "/images/marriott-downtown-ny.png",
  "/images/hilton-midtown-ny.png",
  "/images/novotel-paris.png",
  "/images/radisson-tokyo.png",
  "/images/wyndham-berlin.png",
]

interface Hotel {
  id: number
  name: string
  chain: string
  image: string
  location: string
  stars: number
  rating: number
  reviews: number
  price: number
  perNight: boolean
  amenities: string[]
  available: boolean
}

// Función para generar hoteles de ejemplo basados en la búsqueda
const generateHotels = (city: string, checkIn: string, checkOut: string): Hotel[] => {
  const hotels: Hotel[] = []

  // Generar 5-10 hoteles aleatorios
  const numHotels = 5 + Math.floor(Math.random() * 6)

  for (let i = 0; i < numHotels; i++) {
    const chainIndex = Math.floor(Math.random() * hotelChains.length)
    const chain = hotelChains[chainIndex]

    // Generar nombre de hotel
    const hotelTypes = ["Hotel", "Suites", "Resort", "Grand Hotel", "Palace"]
    const hotelType = hotelTypes[Math.floor(Math.random() * hotelTypes.length)]
    const name = `${chain.name} ${hotelType} ${city}`

    // Generar estrellas (3-5)
    const stars = 3 + Math.floor(Math.random() * 3)

    // Generar puntuación (3.0-5.0)
    const rating = 3 + Math.random() * 2

    // Generar número de reseñas (10-500)
    const reviews = 10 + Math.floor(Math.random() * 490)

    // Generar precio por noche (80-500)
    const price = 80 + Math.floor(Math.random() * 420)

    // Generar amenidades
    const allAmenities = [
      "WiFi gratis",
      "Desayuno incluido",
      "Piscina",
      "Gimnasio",
      "Spa",
      "Restaurante",
      "Bar",
      "Servicio de habitaciones",
      "Parking",
      "Aire acondicionado",
      "Terraza",
      "Business center",
    ]

    // Seleccionar 3-6 amenidades aleatorias
    const numAmenities = 3 + Math.floor(Math.random() * 4)
    const amenities: string[] = []

    while (amenities.length < numAmenities) {
      const amenity = allAmenities[Math.floor(Math.random() * allAmenities.length)]
      if (!amenities.includes(amenity)) {
        amenities.push(amenity)
      }
    }

    // Seleccionar imagen aleatoria
    const imageIndex = Math.floor(Math.random() * hotelImages.length)
    const image = hotelImages[imageIndex]

    hotels.push({
      id: i + 1,
      name,
      chain: chain.name,
      image,
      location: `${Math.floor(Math.random() * 20) + 1} Calle Principal, ${city}`,
      stars,
      rating,
      reviews,
      price,
      perNight: true,
      amenities,
      available: Math.random() > 0.1, // 90% de probabilidad de estar disponible
    })
  }

  // Ordenar por precio
  return hotels.sort((a, b) => a.price - b.price)
}

export function HotelSearch() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [searchResults, setSearchResults] = useState<Hotel[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination || !checkIn || !checkOut) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    // Simular búsqueda con un retraso
    setTimeout(() => {
      const hotels = generateHotels(destination, checkIn, checkOut)
      setSearchResults(hotels)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="w-full">
      {/* Formulario de búsqueda */}
      <div className="bg-black p-4 rounded-lg border border-white/10 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="destination" className="block text-xs text-white/70">
                Destino
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ciudad o destino"
                  list="destination-cities"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  required
                />
                <datalist id="destination-cities">
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="check-in" className="block text-xs text-white/70">
                  Entrada
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="check-out" className="block text-xs text-white/70">
                  Salida
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="guests" className="block text-xs text-white/70">
                  Huéspedes
                </label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="rooms" className="block text-xs text-white/70">
                  Habitaciones
                </label>
                <div className="relative">
                  <input
                    id="rooms"
                    type="number"
                    min="1"
                    max="5"
                    value={rooms}
                    onChange={(e) => setRooms(Number.parseInt(e.target.value))}
                    className="w-full pl-3 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4" />
                    <span>Buscar hoteles</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Resultados de búsqueda */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">
            {isSearching
              ? "Buscando hoteles..."
              : searchResults.length > 0
                ? `${searchResults.length} hoteles encontrados en ${destination}`
                : "No se encontraron hoteles para tu búsqueda"}
          </h2>

          {isSearching ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-black/30 border border-white/10 rounded-lg overflow-hidden hover:bg-white/5 transition-colors"
                >
                  <div className="relative h-48 w-full">
                    <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-medium text-white">{hotel.name}</h3>
                        <p className="text-xs text-white/50">{hotel.location}</p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <StarIcon key={i} className="h-3 w-3 text-white/70 fill-white/70" />
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-medium text-white">{hotel.price} €</p>
                        <p className="text-xs text-white/50">{hotel.perNight ? "por noche" : "total"}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">{hotel.rating.toFixed(1)}</span>
                        <span className="text-xs text-white/50 ml-1">({hotel.reviews} reseñas)</span>
                      </div>

                      <button className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors">
                        Reservar
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/70 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-white/5 text-white/70 rounded-full">
                            +{hotel.amenities.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
