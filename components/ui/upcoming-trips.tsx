import { cn } from "@/lib/utils"
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  PlaneTakeoff,
  Hotel,
  Car,
  MapPin,
  Users2,
} from "lucide-react"
import React from "react"

interface TripItem {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  iconStyle: string
  date: string
  duration: string
  location: string
  travelers: number
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

interface UpcomingTripsProps {
  items?: TripItem[]
  className?: string
}

const iconStyles = {
  flight: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
  hotel: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
  transport: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  "in-progress": {
    icon: AlertCircle,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  completed: {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
}

// Actualizar las fechas en TRIPS
const TRIPS: TripItem[] = [
  {
    id: "1",
    title: "Conferencia Tecnológica",
    subtitle: "Web Summit 2025",
    icon: PlaneTakeoff,
    iconStyle: "flight",
    date: "15-18 Mayo, 2025",
    duration: "4 días",
    location: "Lisboa, Portugal",
    travelers: 3,
    status: "pending",
    progress: 25,
  },
  {
    id: "2",
    title: "Reunión con Clientes",
    subtitle: "Presentación nuevo producto",
    icon: Hotel,
    iconStyle: "hotel",
    date: "22-24 Mayo, 2025",
    duration: "3 días",
    location: "París, Francia",
    travelers: 2,
    status: "pending",
    progress: 50,
  },
  {
    id: "3",
    title: "Visita Oficinas Regionales",
    subtitle: "Revisión trimestral",
    icon: Car,
    iconStyle: "transport",
    date: "5-10 Junio, 2025",
    duration: "6 días",
    location: "Berlín, Alemania",
    travelers: 4,
    status: "in-progress",
    progress: 75,
  },
]

export default function UpcomingTrips({ items = TRIPS, className }: UpcomingTripsProps) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
      <div className="flex gap-4 min-w-full p-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col",
              "w-[280px] sm:w-[320px] shrink-0",
              "bg-white dark:bg-gray-800",
              "rounded-xl",
              "border border-gray-200 dark:border-gray-700",
              "hover:border-gray-300 dark:hover:border-gray-600",
              "transition-all duration-200",
              "shadow-sm backdrop-blur-xl",
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", iconStyles[item.iconStyle as keyof typeof iconStyles])}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    statusConfig[item.status].bg,
                    statusConfig[item.status].class,
                  )}
                >
                  {React.createElement(statusConfig[item.status].icon, { className: "w-3.5 h-3.5" })}
                  {item.status === "pending"
                    ? "Pendiente"
                    : item.status === "in-progress"
                      ? "En progreso"
                      : "Completado"}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{item.subtitle}</p>
              </div>

              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-3">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center">
                  <Timer className="w-3.5 h-3.5 mr-1.5" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-3">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center">
                  <Users2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>{item.travelers} viajeros</span>
                </div>
              </div>

              {typeof item.progress === "number" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                    <span className="text-gray-900 dark:text-gray-100">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 dark:bg-gray-100 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-gray-200 dark:border-gray-700">
              <button
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "py-2.5 px-3",
                  "text-xs font-medium",
                  "text-gray-600 dark:text-gray-400",
                  "hover:text-gray-900 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "transition-colors duration-200",
                )}
              >
                Ver Detalles
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
