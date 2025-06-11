"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSettings } from "@/contexts/settings-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut } from "lucide-react"
import React from "react"
import { CommandMenu } from "./command-menu"
import { Notifications } from "./notifications"

export function TopNav() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)
  const { settings } = useSettings()

  return (
    <header className="sticky top-0 z-40 border-b border-black bg-gray-100">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="text-sm font-medium tracking-tighter text-black">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <span className="text-black">/</span>
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className="text-sm font-medium tracking-tighter text-black"
                >
                  {segment
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex-1 md:flex-none md:ml-4">
          <CommandMenu />
        </div>
        <div className="flex items-center gap-2">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full rounded-xl">
                <Avatar className="h-8 w-8 border border-black">
                  <AvatarImage src={settings.avatar || "/placeholder.svg"} alt={settings.fullName} />
                  <AvatarFallback className="bg-gray-100 text-black">SU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border border-black rounded-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Suitpax User</p>
                  <p className="text-xs leading-none">user@suitpax.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
