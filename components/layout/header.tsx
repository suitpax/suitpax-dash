"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useSidebar } from "@/contexts/sidebar-context"

interface HeaderProps {
  toggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export function Header({ isSidebarCollapsed = true }: HeaderProps) {
  const { toggleSidebar } = useSidebar()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-black border-b border-white/10 z-50 flex items-center justify-between px-4">
      <div className="flex items-center h-full">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70 mr-3"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-center h-full py-2">
          <div className="relative h-full w-[120px]">
            <Image src="/images/suitpax-cloud-logo.webp" alt="Suitpax Logo" fill className="object-contain" priority />
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="bg-white/5 border border-white/10 text-white/70 text-sm rounded-full pl-10 pr-4 py-1.5 w-[180px] lg:w-[240px] focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70 relative"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-lg shadow-lg p-2 z-50">
              <div className="p-2 text-xs text-white/70">No new notifications</div>
            </div>
          )}
        </div>

        <button
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70 md:hidden"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        <div className="h-8 w-8 rounded-full overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
          <Image
            src="/images/user-avatar.jpg"
            alt="User Avatar"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
        </div>
      </div>
    </header>
  )
}
