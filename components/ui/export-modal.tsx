"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportService, type ExportOptions } from "@/lib/export-service"
import { Download, X, Calendar, Filter } from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  dataType: "expenses" | "flights" | "hotels" | "reports"
}

export function ExportModal({ isOpen, onClose, dataType }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv")
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)

    const options: ExportOptions = {
      format: selectedFormat,
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
      },
    }

    try {
      switch (dataType) {
        case "expenses":
          await ExportService.exportExpenses(options)
          break
        case "flights":
          await ExportService.exportFlights(options)
          break
        case "hotels":
          await ExportService.exportHotels(options)
          break
        default:
          await ExportService.exportExpenses(options)
      }

      onClose()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-black border border-white/10 rounded-xl w-full max-w-md mx-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-white">Export Data</CardTitle>
            <Button onClick={onClose} className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(["csv", "excel", "pdf"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                      selectedFormat === format
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white text-sm"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white text-sm"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                </div>
              </div>
            </div>

            {/* Data Type Info */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Filter className="h-4 w-4 text-white/70" />
                <span className="text-sm font-medium text-white">
                  Export: {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                </span>
              </div>
              <p className="text-xs text-white/50">
                This will export all {dataType} data within the selected date range.
              </p>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              <span>{isExporting ? "Exporting..." : "Export Data"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
