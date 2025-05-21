"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react"

interface Column {
  name: string
  type: string
}

interface DataExplorerProps {
  tableName: string
  columns: Column[]
  data: any[]
  totalCount: number
  onFetchData: (
    tableName: string,
    page: number,
    pageSize: number,
    searchParams?: { column: string; term: string },
  ) => Promise<void>
  onExportData?: () => Promise<void>
}

export default function DataExplorer({
  tableName,
  columns,
  data,
  totalCount,
  onFetchData,
  onExportData,
}: DataExplorerProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchColumn, setSearchColumn] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalCount / pageSize)

  // Cargar datos cuando cambia la página o el tamaño de página
  useEffect(() => {
    fetchData()
  }, [page, pageSize])

  // Función para cargar datos
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const searchParams =
        isSearching && searchColumn && searchTerm ? { column: searchColumn, term: searchTerm } : undefined

      await onFetchData(tableName, page, pageSize, searchParams)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar la búsqueda
  const handleSearch = () => {
    if (searchColumn && searchTerm) {
      setIsSearching(true)
      setPage(1) // Volver a la primera página al buscar
      fetchData()
    }
  }

  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchColumn("")
    setSearchTerm("")
    setIsSearching(false)
    setPage(1)
    fetchData()
  }

  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  // Ir a la página siguiente
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium">{tableName}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Refrescar datos"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          {onExportData && (
            <button
              onClick={onExportData}
              className="p-1.5 rounded-lg hover:bg-gray-100"
              aria-label="Exportar datos"
              disabled={isLoading}
            >
              <Download className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">Seleccionar columna...</option>
            {columns.map((column) => (
              <option key={column.name} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
            disabled={!searchColumn || isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="p-1.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black"
            aria-label="Buscar"
            disabled={!searchColumn || !searchTerm || isLoading}
          >
            <Search className="h-4 w-4" />
          </button>
          {isSearching && (
            <button
              onClick={clearSearch}
              className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
              disabled={isLoading}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.name}
                  className="px-3 py-2 text-left font-medium text-gray-600 border-b border-gray-200"
                >
                  {column.name}
                  <span className="text-gray-400 ml-1">({column.type})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500 border-b border-gray-200">
                  {isLoading ? "Cargando datos..." : "No hay datos disponibles"}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.name}
                      className="px-3 py-2 border-b border-gray-200 truncate max-w-xs"
                      title={String(row[column.name] || "")}
                    >
                      {typeof row[column.name] === "object"
                        ? JSON.stringify(row[column.name])
                        : String(row[column.name] || "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Mostrando {data.length > 0 ? (page - 1) * pageSize + 1 : 0} a {Math.min(page * pageSize, totalCount)} de{" "}
          {totalCount} registros
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1) // Volver a la primera página al cambiar el tamaño
            }}
            className="px-2 py-1 text-xs border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
          </select>
          <div className="flex items-center">
            <button
              onClick={goToPreviousPage}
              className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              aria-label="Página anterior"
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <span className="px-2 text-xs">
              Página {page} de {totalPages || 1}
            </span>
            <button
              onClick={goToNextPage}
              className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              aria-label="Página siguiente"
              disabled={page >= totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
