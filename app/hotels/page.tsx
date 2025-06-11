"use client"

import { HotelSearch } from "@/components/ui/hotel-search"

export default function HotelsPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Búsqueda de Hoteles</h1>
        <p className="text-white/70">Encuentra los mejores alojamientos para tu próximo viaje de negocios</p>
      </div>

      <HotelSearch />
    </div>
  )
}
