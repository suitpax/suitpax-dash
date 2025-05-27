import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

export default function UpcomingTrips() {
  return (
    <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
      <h2 className="text-sm font-medium text-white mb-3">Upcoming Trips</h2>
      <div className="space-y-2">
        <TripItem
          destination="Chicago, USA"
          date="April 23-26, 2025"
          hotel="Hilton Chicago"
          flight="UA2478 at 2:30 PM"
        />
        <TripItem destination="London, UK" date="June 10-15, 2025" hotel="The Savoy" flight="BA284 at 10:00 AM" />
      </div>
      <Link
        href="/flights"
        className="text-xs font-medium flex items-center justify-center gap-1 w-full px-2 py-1.5 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white mt-3"
      >
        View All Trips
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}

interface TripItemProps {
  destination: string
  date: string
  hotel: string
  flight: string
}

function TripItem({ destination, date, hotel, flight }: TripItemProps) {
  return (
    <div className="flex items-start gap-2 p-2 border border-white/10 bg-white/5 rounded-lg">
      <div className="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
        <MapPinIcon className="h-3 w-3" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-white text-xs mb-0.5">{destination}</h3>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <CalendarIcon className="h-3 w-3" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <BuildingOfficeIcon className="h-3 w-3" />
          {hotel}
        </div>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <PaperAirplaneIcon className="h-3 w-3" />
          {flight}
        </div>
      </div>
    </div>
  )
}
