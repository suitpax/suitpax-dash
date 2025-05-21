"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export function DataExplorer() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lista de tablas simuladas
  const tables = [
    { name: "users", description: "Usuarios del sistema" },
    { name: "trips", description: "Viajes registrados" },
    { name: "bookings", description: "Reservas realizadas" },
    { name: "expenses", description: "Gastos registrados" },
  ]

  const handleTableSelect = async (tableName: string) => {
    setSelectedTable(tableName)
    setIsLoading(true)
    setError(null)

    try {
      // Simulación de carga de datos
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Datos simulados
      setData([
        { id: 1, name: "Ejemplo 1", created_at: new Date().toISOString() },
        { id: 2, name: "Ejemplo 2", created_at: new Date().toISOString() },
        { id: 3, name: "Ejemplo 3", created_at: new Date().toISOString() },
      ])
    } catch (err) {
      setError("Error al cargar los datos")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!selectedTable || !searchTerm.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulación de búsqueda
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Datos simulados filtrados
      setData([{ id: 1, name: "Resultado 1", created_at: new Date().toISOString() }])
    } catch (err) {
      setError("Error al buscar datos")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium text-white">Explorador de Datos</h2>
        <p className="text-sm text-white/70">Visualiza y consulta datos del sistema (simulado)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sidebar con tablas */}
        <div className="p-4 border-r border-white/10 md:col-span-1">
          <h3 className="text-sm font-medium text-white mb-3">Tablas</h3>
          <div className="space-y-1">
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => handleTableSelect(table.name)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                  selectedTable === table.name
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>

        {/* Área principal */}
        <div className="p-4 md:col-span-3">
          {selectedTable ? (
            <>
              {/* Barra de búsqueda */}
              <div className="mb-4 flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="ml-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white"
                >
                  Buscar
                </button>
              </div>

              {/* Tabla de resultados */}
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70">{error}</div>
              ) : data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        {Object.keys(data[0]).map((key) => (
                          <th key={key} className="px-4 py-2 text-left text-sm font-medium text-white/70">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          {Object.values(row).map((value: any, j) => (
                            <td key={j} className="px-4 py-2 text-sm text-white/70">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70">
                  No hay datos disponibles
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/50">
              <p>Selecciona una tabla para ver sus datos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
