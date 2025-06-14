import Image from "next/image"
import Link from "next/link"
import { Plane, Receipt } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-white/5 border border-white/10">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium tracking-tighter text-white">Welcome back, Alberto</h1>
            <p className="text-white/70 text-sm">Ready to plan your next business trip?</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/flights"
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
          >
            <Plane className="h-3 w-3" />
            Flights
          </Link>
          <Link
            href="/expenses"
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
          >
            <Receipt className="h-3 w-3" />
            Expense Management
          </Link>
        </div>
      </div>

      {/* Rest of the dashboard content... */}
      {/* (mantener todo el resto del contenido del dashboard sin cambios) */}
    </div>
  )
}
