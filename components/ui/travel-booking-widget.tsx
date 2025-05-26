import type React from "react"
import { PaperAirplaneIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline"

interface TravelBookingWidgetProps {
  destination?: string
  startDate?: Date
  endDate?: Date
}

const TravelBookingWidget: React.FC<TravelBookingWidgetProps> = ({
  destination = "Chicago",
  startDate = new Date("2025-04-23"),
  endDate = new Date("2025-04-26"),
}) => {
  const userName = "Carlos"

  const formatDate = (date: Date | undefined): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "No seleccionada"
    }
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-white/5 rounded-lg">
          <PaperAirplaneIcon className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-sm font-medium text-white">Quick Travel Booking</h3>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
          <MapPinIcon className="h-3 w-3 text-white/70" />
          <span className="text-xs text-white">Destination: {destination}</span>
        </div>

        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
          <CalendarIcon className="h-3 w-3 text-white/70" />
          <span className="text-xs text-white">
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-2 py-1.5 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors">
          Book Flight
        </button>
        <button className="flex-1 px-2 py-1.5 bg-transparent text-white rounded-lg text-xs border border-white/10 hover:bg-white/5 transition-colors">
          Book Hotel
        </button>
      </div>
    </div>
  )
}

export default TravelBookingWidget
