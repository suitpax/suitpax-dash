"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileMenu } from "@/components/ui/profile-menu"
import {
  PiHouse,
  PiAirplane,
  PiBed,
  PiTrain,
  PiCar,
  PiReceipt,
  PiCalendar,
  PiEnvelope,
  PiUsers,
  PiChartBar,
  PiGear,
  PiRobot,
  PiList,
  PiCreditCard,
  PiShield,
  PiLeaf,
  PiBuilding,
  PiFileText,
  PiTarget,
  PiTrendUp,
  PiX,
  PiSidebar,
} from "react-icons/pi"

interface LayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: PiHouse },
  { name: "Flights", href: "/flights", icon: PiAirplane },
  { name: "Hotels", href: "/hotels", icon: PiBed },
  { name: "Trains", href: "/trains", icon: PiTrain },
  { name: "Transfers", href: "/transfers", icon: PiCar },
  { name: "Expenses", href: "/expenses", icon: PiReceipt },
  { name: "Tasks", href: "/tasks", icon: PiList },
  { name: "Events", href: "/events", icon: PiCalendar },
  { name: "Meetings", href: "/meetings", icon: PiCalendar },
  { name: "Mails", href: "/mails", icon: PiEnvelope },
  { name: "Team", href: "/team-management", icon: PiUsers },
  { name: "Analytics", href: "/analytics", icon: PiChartBar },
  { name: "Reports", href: "/reports", icon: PiFileText },
  { name: "Compliance", href: "/compliance", icon: PiShield },
  { name: "Sustainability", href: "/sustainability", icon: PiLeaf },
  { name: "Vendors", href: "/vendors", icon: PiBuilding },
  { name: "Budgets", href: "/budgets", icon: PiCreditCard },
  { name: "Forecasting", href: "/forecasting", icon: PiTrendUp },
  { name: "Goals", href: "/goals", icon: PiTarget },
  { name: "Travel Policy", href: "/travel-policy", icon: PiFileText },
  { name: "Plans", href: "/plans", icon: PiCreditCard },
  { name: "Smart Bank", href: "/smart-bank", icon: PiCreditCard },
  { name: "Suitpax AI", href: "/suitpax-ai", icon: PiRobot },
  { name: "Settings", href: "/settings", icon: PiGear },
]

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-light text-white">Suitpax</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <PiX className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-light rounded-lg transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-white/10">
            <ProfileMenu />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <PiSidebar className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-xs">S</span>
            </div>
            <span className="text-lg font-light text-white">Suitpax</span>
          </Link>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
