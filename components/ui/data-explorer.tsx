"use client"

import { useState } from "react"
import { Search, Download, RefreshCw } from "lucide-react"

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
    page?: number,
    pageSize?: number,
    searchParams?: { column: string; term: string },
  ) => void
  onExportData: () => void
}

export default function DataExplorer({
  tableName,
  columns,
  data,
  totalCount,
  onFetchData,
  onExportData,
}: DataExplorerProps) {
  const [searchColumn, setSearchColumn] = useState<string>(columns.length > 0 ? columns[0].name : "")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 10

  // Manejar la búsqueda
  const handleSearch = () => {
    if (searchColumn && searchTerm) {
      onFetchData(tableName, 1, pageSize, { column: searchColumn, term: searchTerm })
      setCurrentPage(1)
    }
  }

  // Manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onFetchData(tableName, page, pageSize)
  }

  // Manejar la exportación de datos
  const handleExport = () => {
    onExportData()
  }

  // Manejar la actualización de datos
  const handleRefresh = () => {
    onFetchData(tableName, currentPage, pageSize)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-black">Tabla: {tableName}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Actualizar datos"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Exportar datos"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex mb-4 space-x-2">
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          {columns.map((column) => (
            <option key={column.name} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-8 pr-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Buscar
        </button>
      </div>

      {/* Tabla de datos */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.name}
                    <span className="text-[10px] text-gray-400 ml-1">({column.type})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.name} className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                        {formatCellValue(row[column.name], column.type)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-4 text-center text-xs text-gray-500">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Mostrando {data.length} de {totalCount} registros
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-2 py-1 rounded-md bg-gray-100">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={data.length < pageSize}
            className="px-2 py-1 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

// Función para formatear el valor de una celda según su tipo
function formatCellValue(value: any, type: string): string {
  if (value === undefined || value === null) {
    return "-"
  }

  switch (type) {
    case "datetime":
      return new Date(value).toLocaleString()
    case "date":
      return new Date(value).toLocaleDateString()
    case "array":
      return Array.isArray(value) ? value.join(", ") : String(value)
    case "object":
      return JSON.stringify(value)
    default:
      return String(value)
  }
}
