"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BellIcon, UserIcon } from "@heroicons/react/24/outline"
import { Menu } from "lucide-react"

interface TopNavigationProps {
  toggleSidebar: () => void
}

export function TopNavigation({ toggleSidebar }: TopNavigationProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <div className="relative h-8 w-8 mr-2 rounded-full overflow-hidden flex items-center justify-center bg-white/5">
            <Image
              src="/images/suitpax-bl-logo.webp"
              alt="Suitpax Logo"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-white font-medium text-sm hidden sm:inline-block">Suitpax</span>
        </Link>

        {/* Right side icons */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors relative"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-black/95 border border-white/10 rounded-lg shadow-lg z-50 backdrop-blur-md">
                <div className="p-3 border-b border-white/10">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                </div>
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="py-2 px-3 hover:bg-white/5 rounded-lg transition-colors">
                    <p className="text-xs text-white">Your flight to Madrid has been confirmed.</p>
                    <p className="text-[10px] text-white/50 mt-1">2 hours ago</p>
                  </div>
                  <div className="py-2 px-3 hover:bg-white/5 rounded-lg transition-colors">
                    <p className="text-xs text-white">New hotel booking request from Alex.</p>
                    <p className="text-[10px] text-white/50 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="p-2 border-t border-white/10">
                  <Link
                    href="#"
                    className="block text-center text-xs text-white/70 hover:text-white py-1 rounded-md hover:bg-white/5 transition-colors"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            >
              <UserIcon className="h-5 w-5" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-white/10 rounded-lg shadow-lg z-50 backdrop-blur-md">
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 mr-2 rounded-full overflow-hidden">
                      <Image
                        src="/images/team/orlando-diggs.jpeg"
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Orlando Diggs</p>
                      <p className="text-xs text-white/50">Product Lead</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    Settings
                  </Link>
                  <button className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
