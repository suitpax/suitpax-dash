"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

// Datos de ejemplo
const airlines = [
  { id: 1, name: "British Airways", logo: "/images/airlines/british-airways.png" },
  { id: 2, name: "Lufthansa", logo: "/images/airlines/lufthansa.png" },
  { id: 3, name: "Air France", logo: "/images/airlines/air-france.png" },
  { id: 4, name: "Iberia", logo: "/images/airlines/iberia.png" },
  { id: 5, name: "American Airlines", logo: "/images/airlines/american-airlines.png" },
  { id: 6, name: "Delta", logo: "/images/airlines/delta.png" },
  { id: 7, name: "Emirates", logo: "/images/airlines/emirates.png" },
  { id: 8, name: "Qatar Airways", logo: "/images/airlines/qatar-airways.png" },
  { id: 9, name: "Singapore Airlines", logo: "/images/airlines/singapore-airlines.png" },
]

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

interface Flight {
  id: number
  airline: string
  airlineLogo: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  available: number
}

// Función para generar vuelos de ejemplo basados en la búsqueda
const generateFlights = (origin: string, destination: string, date: string): Flight[] => {
  const flights: Flight[] = []

  // Obtener códigos de aeropuerto
  const originCity = cities.find((city) => city.name.toLowerCase() === origin.toLowerCase())
  const destinationCity = cities.find((city) => city.name.toLowerCase() === destination.toLowerCase())

  const originCode = originCity?.code || "MAD"
  const destinationCode = destinationCity?.code || "LHR"

  // Generar 5-10 vuelos aleatorios
  const numFlights = 5 + Math.floor(Math.random() * 6)

  for (let i = 0; i < numFlights; i++) {
    const airlineIndex = Math.floor(Math.random() * airlines.length)
    const airline = airlines[airlineIndex]

    // Generar hora de salida aleatoria entre 6:00 y 22:00
    const departureHour = 6 + Math.floor(Math.random() * 17)
    const departureMinute = Math.floor(Math.random() * 60)
    const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`

    // Generar duración aleatoria entre 1h30m y 4h30m
    const durationHours = 1 + Math.floor(Math.random() * 3)
    const durationMinutes = 30 + Math.floor(Math.random() * 30)
    const duration = `${durationHours}h ${durationMinutes}m`

    // Calcular hora de llegada
    let arrivalHour = departureHour + durationHours
    let arrivalMinute = departureMinute + durationMinutes

    if (arrivalMinute >= 60) {
      arrivalHour += 1
      arrivalMinute -= 60
    }

    // Ajustar para el siguiente día si es necesario
    let arrivalDate = date
    if (arrivalHour >= 24) {
      arrivalHour -= 24

      // Calcular fecha del día siguiente
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      arrivalDate = nextDay.toISOString().split("T")[0]
    }

    const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`

    // Generar precio aleatorio entre 100 y 500
    const price = 100 + Math.floor(Math.random() * 400)

    // Generar número de escalas (0-2)
    const stops = Math.floor(Math.random() * 3)

    // Generar asientos disponibles (1-30)
    const available = 1 + Math.floor(Math.random() * 30)

    flights.push({
      id: i + 1,
      airline: airline.name,
      airlineLogo: airline.logo,
      origin: origin,
      originCode,
      destination,
      destinationCode,
      departureDate: date,
      departureTime,
      arrivalDate,
      arrivalTime,
      duration,
      price,
      stops,
      available,
    })
  }

  // Ordenar por precio
  return flights.sort((a, b) => a.price - b.price)
}

export function FlightSearch() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState(1)
  const [searchResults, setSearchResults] = useState<Flight[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!origin || !destination || !departureDate) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    // Simular búsqueda con un retraso
    setTimeout(() => {
      const flights = generateFlights(origin, destination, departureDate)
      setSearchResults(flights)
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
              <label htmlFor="origin" className="block text-xs text-white/70">
                Origen
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  id="origin"
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ciudad de origen"
                  list="origin-cities"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  required
                />
                <datalist id="origin-cities">
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} />
                  ))}
                </datalist>
              </div>
            </div>

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
                  placeholder="Ciudad de destino"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="departure-date" className="block text-xs text-white/70">
                Fecha de salida
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  id="departure-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="return-date" className="block text-xs text-white/70">
                Fecha de regreso (opcional)
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="passengers" className="block text-xs text-white/70">
                Pasajeros
              </label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(Number.parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
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
                  <span>Buscar vuelos</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resultados de búsqueda */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">
            {isSearching
              ? "Buscando vuelos..."
              : searchResults.length > 0
                ? `${searchResults.length} vuelos encontrados de ${origin} a ${destination}`
                : "No se encontraron vuelos para tu búsqueda"}
          </h2>

          {isSearching ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-black/30 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 bg-white/5 rounded-full overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={flight.airlineLogo || "/placeholder.svg"}
                          alt={flight.airline}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{flight.airline}</p>
                        <p className="text-xs text-white/50">Vuelo #{flight.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-medium text-white">{flight.departureTime}</p>
                        <p className="text-xs text-white/50">{flight.originCode}</p>
                      </div>

                      <div className="flex-1 mx-4 relative">
                        <div className="border-t border-dashed border-white/20 w-full absolute top-1/2 -translate-y-1/2"></div>
                        <div className="text-xs text-white/50 text-center bg-black/30 px-2 mx-auto w-fit relative">
                          {flight.duration}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-medium text-white">{flight.arrivalTime}</p>
                        <p className="text-xs text-white/50">{flight.destinationCode}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-white/50">
                        {flight.stops === 0 ? "Directo" : flight.stops === 1 ? "1 escala" : `${flight.stops} escalas`}
                      </p>
                      <p className="text-xs text-white/50">{flight.available} asientos disponibles</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <p className="text-lg font-medium text-white">{flight.price} €</p>
                      <button className="mt-2 px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors">
                        Seleccionar
                      </button>
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
