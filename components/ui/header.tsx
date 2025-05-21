"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BellIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { Grid3x3GapFill } from "react-bootstrap-icons"

interface HeaderProps {
  toggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export function Header({ toggleSidebar, isSidebarCollapsed = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  // Detect scroll to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
              width={100}
              height={24}
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
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-medium text-white">Claude</span>
            <span className="text-[10px] text-white/50">Anthropic</span>
          </div>
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10">
            <Image src="/images/user-avatar.jpg" alt="User Avatar" fill className="object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}
