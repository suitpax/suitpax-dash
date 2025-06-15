import EventCard from "@/components/EventCard"
import { getAllEvents } from "@/lib/data"

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
