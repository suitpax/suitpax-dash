"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HomeIcon } from "@heroicons/react/24/outline"
import { Airplane, Train, Car, Building } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { href: "/dashboard", icon: HomeIcon, label: "Home" },
    { href: "/flights", icon: Airplane, label: "Flights" },
    { href: "/hotels", icon: Building, label: "Hotels" },
    { href: "/trains", icon: Train, label: "Trains" },
    { href: "/transfers", icon: Car, label: "Transfers" },
  ]

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 lg:hidden",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
      )}
    >
      <div className="bg-black/90 backdrop-blur-md rounded-full border border-white/10 shadow-lg px-2 py-1.5 flex items-center justify-between space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center px-3 py-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <item.icon className="h-5 w-5 text-white" />
            <span className="text-[10px] text-white/70 mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
