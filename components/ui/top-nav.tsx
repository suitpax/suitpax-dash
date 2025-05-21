"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import ProfileMenu from "./profile-menu"

export default function TopNav() {
  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-black h-full">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        <span className="text-white">Suitpax</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-white/50 mx-1"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-white">Business Travel</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <div className="relative hidden md:flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 h-4 w-4 text-white/50"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search flights, hotels..."
            className="pl-9 pr-4 py-2 rounded-lg text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white/30 w-[200px] lg:w-[300px]"
          />
        </div>

        <button type="button" className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 sm:h-5 sm:w-5 text-white"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="/images/team/orlando-diggs.jpeg"
              alt="User avatar"
              width={28}
              height={28}
              className="rounded-full ring-2 ring-white/10 sm:w-8 sm:h-8 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-black/95 border border-white/10 rounded-lg shadow-lg"
          >
            <ProfileMenu avatar="/images/team/orlando-diggs.jpeg" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
