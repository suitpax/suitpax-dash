import FlightSearchForm from "@/components/FlightSearchForm"
import { Suspense } from "react"
import Loading from "./loading"
import FlightResults from "@/components/FlightResults"

export default async function FlightsPage() {
  return (
    <div>
      <h1>Search Flights</h1>
      <FlightSearchForm />
      <Suspense fallback={<Loading />}>
        <FlightResults />
      </Suspense>
    </div>
  )
}
