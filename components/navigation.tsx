"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Home,
  Plane,
  CreditCard,
  BarChart3,
  ClipboardList,
  FileText,
  Users,
  Building2,
  Sparkles,
  HelpCircle,
} from "lucide-react"

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Business Travel", href: "/business-travel", icon: Plane },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Travel Policy", href: "/travel-policy", icon: FileText },
  { name: "Team", href: "/team", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "AI Agents", href: "/ai-agents", icon: Sparkles },
]

export function Navigation({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const pathname = usePathname()

  const userData = {
    name: "Ana Martinez",
    email: "ana@company.com",
    avatar: "/images/ai-agent-avatar.jpeg",
    role: "Travel Manager",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-14 items-center px-4">
          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-white/5 md:hidden">
                <Menu className="h-5 w-5 text-white" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-black border-white/10 p-0">
              <SheetHeader className="border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Image src="/images/suitpax-logo.webp" alt="Suitpax" width={20} height={20} className="h-5 w-5" />
                  </div>
                  <div>
                    <SheetTitle className="text-base font-medium tracking-tighter text-white">Suitpax</SheetTitle>
                    <SheetDescription className="text-xs text-white/50">Travel Management</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-col gap-2 p-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Image src="/images/suitpax-logo.webp" alt="Suitpax" width={20} height={20} className="h-5 w-5" />
              </div>
              <span className="hidden font-bold sm:inline-block text-white">Suitpax</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navigationItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-white",
                  pathname === item.href ? "text-white" : "text-white/70",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* Search */}
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outline"
                className="relative h-8 w-full justify-start rounded-lg bg-white/5 border-white/10 text-sm font-normal text-white/50 shadow-none sm:pr-12 md:w-40 lg:w-64 hover:bg-white/10"
                onClick={() => setCommandOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search travel options...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0 hover:bg-white/5">
                <Bell className="h-4 w-4 text-white/70" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/5">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/95 border-white/10" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{userData.name}</p>
                      <p className="text-xs leading-none text-white/50">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/5">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/5">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/5">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-red-400 hover:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Command Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <div className="bg-black/95 border-white/10">
          <CommandInput placeholder="Type a command or search..." className="text-white placeholder:text-white/50" />
          <CommandList className="bg-black/95">
            <CommandEmpty className="text-white/70">No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions" className="text-white/70">
              <CommandItem className="text-white hover:bg-white/5">
                <Plane className="mr-2 h-4 w-4" />
                <span>Book a flight</span>
              </CommandItem>
              <CommandItem className="text-white hover:bg-white/5">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Find hotels</span>
              </CommandItem>
              <CommandItem className="text-white hover:bg-white/5">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Add expense</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className="bg-white/10" />
            <CommandGroup heading="Navigation" className="text-white/70">
              {navigationItems.map((item) => (
                <CommandItem key={item.href} className="text-white hover:bg-white/5">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                  <CommandShortcut>⌘{item.name.charAt(0)}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
