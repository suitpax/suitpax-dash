import { cn } from "@/lib/utils"
import { PlaneTakeoff, Clock, Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  status: "confirmed" | "pending" | "cancelled"
  traveler: string
}

interface FlightsListProps {
  flights?: Flight[]
  className?: string
}

const FLIGHTS: Flight[] = [
  {
    id: "1",
    airline: "Iberia",
    flightNumber: "IB6275",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Nueva York",
    destinationCode: "JFK",
    departureDate: "15 Mayo, 2024",
    departureTime: "10:25",
    arrivalTime: "13:05",
    status: "confirmed",
    traveler: "Carlos Rodríguez",
  },
  {
    id: "2",
    airline: "Air France",
    flightNumber: "AF1234",
    origin: "Madrid",
    originCode: "MAD",
    destination: "París",
    destinationCode: "CDG",
    departureDate: "18 Mayo, 2024",
    departureTime: "07:45",
    arrivalTime: "09:55",
    status: "confirmed",
    traveler: "Ana Martínez",
  },
  {
    id: "3",
    airline: "Lufthansa",
    flightNumber: "LH4567",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Frankfurt",
    destinationCode: "FRA",
    departureDate: "20 Mayo, 2024",
    departureTime: "14:30",
    arrivalTime: "17:10",
    status: "pending",
    traveler: "Miguel Sánchez",
  },
  {
    id: "4",
    airline: "British Airways",
    flightNumber: "BA7890",
    origin: "Madrid",
    originCode: "MAD",
    destination: "Londres",
    destinationCode: "LHR",
    departureDate: "22 Mayo, 2024",
    departureTime: "16:15",
    arrivalTime: "17:45",
    status: "confirmed",
    traveler: "Laura García",
  },
]

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  pending: {
    label: "Pendiente",
    class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  cancelled: {
    label: "Cancelado",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
}

export default function FlightsList({ flights = FLIGHTS, className }: FlightsListProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-3">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                  <PlaneTakeoff className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{flight.airline}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{flight.flightNumber}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{flight.traveler}</div>
                </div>
              </div>
              <Badge
                className={cn(
                  "inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium",
                  statusConfig[flight.status].class,
                )}
              >
                {statusConfig[flight.status].label}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{flight.departureTime}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{flight.originCode}</span>
              </div>
              <div className="flex-1 mx-2 px-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-dashed border-gray-300 dark:border-gray-600 w-full absolute"></div>
                  <div className="bg-white dark:bg-gray-800 z-10 px-2 text-xs text-gray-500 dark:text-gray-400">
                    Directo
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{flight.arrivalTime}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{flight.destinationCode}</span>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-3">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{flight.departureDate}</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Duración: 2h 40m</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              Ver Detalles
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
