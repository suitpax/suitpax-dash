"use client"

import { useState } from "react"
import { FlightSearch } from "@/components/ui/flight-search"
import { Plane, Calendar, MapPin, CreditCard, Clock, Filter } from "lucide-react"

export default function FlightsPage() {
  const [activeTab, setActiveTab] = useState<"search" | "results" | "saved">("search")

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Búsqueda de Vuelos</h1>
        <p className="text-white/70">Encuentra los mejores vuelos para tu próximo viaje de negocios</p>
      </div>

      {/* Tabs de navegación */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "search"
              ? "bg-white/10 text-white"
              : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
          }`}
        >
          <Plane className="h-3.5 w-3.5 mr-1.5 text-white" />
          Buscar Vuelos
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "results"
              ? "bg-white/10 text-white"
              : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
          }`}
        >
          <Filter className="h-3.5 w-3.5 mr-1.5 text-white" />
          Resultados
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "saved"
              ? "bg-white/10 text-white"
              : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
          }`}
        >
          <Clock className="h-3.5 w-3.5 mr-1.5 text-white" />
          Vuelos Guardados
        </button>
      </div>

      {/* Iconos de información */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white">Flexibilidad</h3>
              <p className="text-[10px] text-white/50">Cambios sin cargos</p>
            </div>
          </div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white">Destinos</h3>
              <p className="text-[10px] text-white/50">+200 ciudades</p>
            </div>
          </div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white">Pagos</h3>
              <p className="text-[10px] text-white/50">Métodos seguros</p>
            </div>
          </div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white">Aerolíneas</h3>
              <p className="text-[10px] text-white/50">+50 compañías</p>
            </div>
          </div>
        </div>
      </div>

      <FlightSearch />
    </div>
  )
}
