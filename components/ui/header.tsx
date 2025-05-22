"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { BellIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { Grid3x3GapFill } from "react-bootstrap-icons"
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

interface HeaderProps {
  toggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export function Header({ toggleSidebar, isSidebarCollapsed = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Detect scroll to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle clicks outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 bg-black border-b border-white/10 flex items-center justify-between px-3",
        isScrolled && "shadow-md shadow-black/20 backdrop-blur-sm bg-black/95",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Nine dots icon - Improved sidebar toggle button */}
        <button
          onClick={() => {
            if (toggleSidebar) toggleSidebar()
          }}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors bg-transparent text-white/70 border border-white/10"
          aria-label="Toggle sidebar"
        >
          <Grid3x3GapFill className="h-4 w-4" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/suitpax-cloud-logo.webp"
              alt="Suitpax Logo"
              width={80}
              height={20}
              className="object-contain"
            />
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notification icon */}
        <div className="relative">
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70">
            <BellIcon className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full"></span>
          </button>
        </div>

        {/* User profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-medium text-white">Carlos Rodríguez</span>
              <span className="text-[10px] text-white/50">Empresa Internacional S.A.</span>
            </div>
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10">
              <Image src="/images/user-avatar.jpg" alt="User Avatar" fill className="object-cover" />
            </div>
          </button>

          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
                    <Image src="/images/user-avatar.jpg" alt="User Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Carlos Rodríguez</p>
                    <p className="text-xs text-white/50">carlos.rodriguez@empresa.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <div className="border-t border-white/10 my-1"></div>
                <Link
                  href="/sign-in"
                  className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
