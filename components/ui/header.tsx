"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, Search, Bell, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import ProfileMenu from "./profile-menu"

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="h-14 bg-black dark:bg-black border-b border-white/10 dark:border-white/10 px-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`p-2 hover:bg-white/5 dark:hover:bg-white/5 rounded-md transition-all duration-300 text-white/70 hover:text-white ${isSidebarOpen ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"}`}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="relative h-7 w-7 rounded-md overflow-hidden flex items-center justify-center">
            <Image
              src="/images/suitpax-cloud-logo.webp"
              alt="Suitpax Logo"
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
          <div className="flex items-center">
            <div className="relative">
              <select
                className="appearance-none bg-transparent border border-white/10 rounded-md text-xs text-white/90 py-0.5 px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-white/20"
                defaultValue="pro"
                aria-label="Select dashboard view"
              >
                <option value="pro">PRO</option>
                <option value="personal">PERSONAL</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white/50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flights, hotels, policies..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        <button className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/70 hover:text-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
              <Image
                src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-md ring-2 ring-white/10"
              />
              <ChevronDown className="h-4 w-4 text-white/50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-black border border-white/10 rounded-md shadow-lg"
          >
            <ProfileMenu avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// Export both named and default
export { Header }
export default Header
