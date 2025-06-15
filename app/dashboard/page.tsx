import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Link href="/dashboard/invoices">Invoices</Link>
    </main>
  )
}
