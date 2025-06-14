"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"

interface Airport {
  id: string
  iata_code: string
  name: string
  city_name: string
  country_name: string
}

interface AirportSearchProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onAirportSelect?: (airport: Airport) => void
}

export function AirportSearch({ placeholder, value, onChange, onAirportSelect }: AirportSearchProps) {
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchAirports = async () => {
      if (value.length < 2) {
        setAirports([])
        setShowDropdown(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(value)}`)
        if (response.ok) {
          const data = await response.json()
          setAirports(data.airports || [])
          setShowDropdown(true)
        }
      } catch (error) {
        console.error("Airport search error:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAirports, 300)
    return () => clearTimeout(debounceTimer)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || airports.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < airports.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : airports.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectAirport(airports[selectedIndex])
        }
        break
      case "Escape":
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectAirport = (airport: Airport) => {
    onChange(airport.iata_code)
    onAirportSelect?.(airport)
    setShowDropdown(false)
    setSelectedIndex(-1)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 2 && airports.length > 0 && setShowDropdown(true)}
          className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-md hover:bg-white/10 focus:ring-1 focus:ring-white/20 font-light"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 animate-spin" />
        )}
      </div>

      {showDropdown && airports.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-black/95 border border-white/10 rounded-md shadow-lg backdrop-blur-sm max-h-60 overflow-y-auto"
        >
          {airports.map((airport, index) => (
            <button
              key={airport.id}
              onClick={() => selectAirport(airport)}
              className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                index === selectedIndex ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-light text-sm">
                    {airport.city_name} ({airport.iata_code})
                  </div>
                  <div className="text-white/70 text-xs font-light">
                    {airport.name}, {airport.country_name}
                  </div>
                </div>
                <div className="text-white/50 text-xs font-mono">{airport.iata_code}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
