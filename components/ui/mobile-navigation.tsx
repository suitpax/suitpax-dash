"use client"
import Link from "next/link"
import { HomeIcon } from "@heroicons/react/24/outline"
import { Airplane, Train, Car, Building } from "@phosphor-icons/react"

export function MobileNavigation() {
  const navItems = [
    { href: "/dashboard", icon: HomeIcon, label: "Home" },
    { href: "/flights", icon: Airplane, label: "Flights" },
    { href: "/hotels", icon: Building, label: "Hotels" },
    { href: "/trains", icon: Train, label: "Trains" },
    { href: "/transfers", icon: Car, label: "Transfers" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-2 py-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <item.icon className="h-5 w-5 text-white" />
            <span className="text-[10px] text-white/70 mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
