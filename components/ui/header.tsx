"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, Search, Bell, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useTheme } from "next-themes"
import ProfileMenu from "./profile-menu"

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme } = useTheme()

  // Determine which logo to use based on theme
  const logoSrc = theme === "light" ? "/images/suitpax-bl-logo.webp" : "/images/suitpax-cloud-logo.webp"

  return (
    <header className="h-14 bg-black dark:bg-black light:bg-white border-b border-white/10 dark:border-white/10 light:border-gray-200 px-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`p-2 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 rounded-md transition-all duration-300 text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 ${isSidebarOpen ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"}`}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="relative h-7 w-7 rounded-md overflow-hidden flex items-center justify-center">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Suitpax Logo"
              width={28}
              height={28}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center">
            <div className="relative">
              <select
                className="appearance-none bg-transparent border border-white/10 dark:border-white/10 light:border-gray-300 rounded-md text-xs text-white/90 dark:text-white/90 light:text-gray-700 py-0.5 px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-white/20 dark:focus:ring-white/20 light:focus:ring-gray-400"
                defaultValue="pro"
                aria-label="Select dashboard view"
              >
                <option value="pro">PRO</option>
                <option value="personal">PERSONAL</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white/50 dark:text-white/50 light:text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 dark:text-white/50 light:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flights, hotels, policies..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20 dark:focus:ring-white/20 light:focus:ring-gray-400 text-white dark:text-white light:text-gray-900 placeholder:text-white/30 dark:placeholder:text-white/30 light:placeholder:text-gray-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-white/30 dark:text-white/30 light:text-gray-400 bg-white/10 dark:bg-white/10 light:bg-gray-200 px-1.5 py-0.5 rounded">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        <button className="p-2 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 rounded-md transition-colors text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <Image
                src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-md ring-2 ring-white/10 dark:ring-white/10 light:ring-gray-300"
              />
              <ChevronDown className="h-4 w-4 text-white/50 dark:text-white/50 light:text-gray-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-black dark:bg-black light:bg-white border border-white/10 dark:border-white/10 light:border-gray-200 rounded-md shadow-lg"
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
