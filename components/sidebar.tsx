"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  House,
  Airplane,
  CreditCard,
  ChartLineUp,
  ClipboardText,
  List,
  CaretDown,
  CaretRight,
  X,
  Sparkle,
  Bell,
  ArrowsClockwise,
  Users,
  Buildings,
  Briefcase,
  Star,
  MagnifyingGlass,
  Plus,
  FileText,
  Calendar,
  Globe,
  Suitcase,
  Receipt,
  Gear,
  Question,
  Lightning,
  Compass,
  UserCircle,
  SignOut,
  CaretUp,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Navigation sections
const quickActions = [
  { name: "Dashboard", href: "/", icon: House, description: "Overview of your activity" },
  { name: "Book Travel", href: "/business-travel", icon: Airplane, description: "Plan your next destination" },
  { name: "Expense Management", href: "/expenses", icon: CreditCard, description: "Control your travel finances" },
]

const mainNavigation = [
  { name: "Notifications", href: "/notifications", icon: Bell, description: "Alerts and updates" },
  { name: "Pending Tasks", href: "/tasks", icon: ClipboardText, description: "Manage your activities" },
  { name: "Travel Policy", href: "/travel-policy", icon: FileText, description: "Corporate regulations" },
  { name: "Invoices", href: "/invoices", icon: Receipt, description: "Financial documents" },
  { name: "Analytics Reports", href: "/analytics", icon: ChartLineUp, description: "Statistics and trends" },
]

const automations = [
  { name: "AI Assistants", href: "/ai-agents", icon: Sparkle, description: "Smart planning" },
  { name: "Workflows", href: "/workflows", icon: ArrowsClockwise, description: "Automate processes" },
  { name: "Recommendations", href: "/recommendations", icon: Lightning, description: "Personalized suggestions" },
  { name: "Destination Explorer", href: "/destinations", icon: Compass, description: "Discover new places" },
]

const records = [
  {
    name: "Companies",
    href: "/companies",
    icon: Buildings,
    color: "text-white/70",
    description: "Corporate profiles",
  },
  {
    name: "Team Members",
    href: "/team",
    icon: Users,
    color: "text-white/70",
    description: "Traveler management",
  },
  {
    name: "Travel History",
    href: "/trips",
    icon: Suitcase,
    color: "text-white/70",
    description: "Trip records",
  },
]

const lists = [
  { name: "Preferred Hotels", href: "/lists/hotels", icon: Buildings, description: "Favorite accommodations" },
  { name: "Frequent Routes", href: "/lists/routes", icon: Globe, description: "Common routes" },
  { name: "Saved Itineraries", href: "/lists/itineraries", icon: Calendar, description: "Travel plans" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [automationsOpen, setAutomationsOpen] = useState(true)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [recordsOpen, setRecordsOpen] = useState(true)
  const [listsOpen, setListsOpen] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // User data (simulated, in a real app would come from context or API)
  const userData = {
    name: "Ana Martinez",
    email: "ana@company.com",
    company: "Global Company Inc.",
    role: "Travel Manager",
    avatar: "/images/ai-agent-avatar.jpeg",
  }

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileOpen])

  // Handle keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // Open quick actions or search
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const NavItem = ({ item, className = "" }) => (
    <div
      className="relative"
      onMouseEnter={() => setActiveTooltip(item.name)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
          pathname === item.href
            ? "bg-white/10 text-white font-medium"
            : "text-white/70 hover:bg-white/5 hover:text-white",
          className,
        )}
      >
        <item.icon className={cn("mr-2 h-4 w-4", item.color)} weight={pathname === item.href ? "fill" : "duotone"} />
        <span className="truncate">{item.name}</span>
      </Link>
      {activeTooltip === item.name && item.description && (
        <div className="absolute left-full ml-2 top-0 z-50 w-48 rounded-lg bg-black/95 px-3 py-2 text-xs text-white shadow-lg border border-white/10">
          {item.description}
        </div>
      )}
    </div>
  )

  const CollapsibleSection = ({ title, children, isOpen, onToggle, icon: Icon }) => (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium tracking-tighter text-white/70 hover:bg-white/5 hover:text-white"
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4" weight="duotone" />}
          <span>{title}</span>
        </div>
        {isOpen ? <CaretDown className="h-4 w-4" /> : <CaretRight className="h-4 w-4" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-2 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <List className="h-5 w-5 text-white" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        className="fixed inset-y-0 left-0 z-50 w-64 flex-col bg-black border-r border-white/10 lg:z-10 lg:flex"
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ maxWidth: "85%", display: isMobileOpen ? "flex" : "none" }}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-white/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Image src="/images/suitpax-logo.webp" alt="Suitpax" width={20} height={20} className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-medium tracking-tighter text-white">Suitpax</span>
                <p className="text-xs text-white/50 mt-0.5 truncate max-w-32">{userData.company}</p>
              </div>
            </div>
            <button className="rounded-lg p-1 hover:bg-white/5 lg:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative mb-2">
              <button className="flex w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <MagnifyingGlass className="mr-2 h-4 w-4 text-white/50" weight="duotone" />
                <span className="text-white/50">Search travel options</span>
                <span className="ml-auto text-xs text-white/30">CTRL K</span>
              </button>
            </div>
            <div className="space-y-0.5">
              {quickActions.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-0.5 mb-4">
            {mainNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Automations */}
          <CollapsibleSection
            title="AI Travel Tools"
            isOpen={automationsOpen}
            onToggle={() => setAutomationsOpen(!automationsOpen)}
            icon={Sparkle}
          >
            <div className="space-y-0.5 py-1">
              {automations.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </CollapsibleSection>

          {/* Favorites */}
          <CollapsibleSection
            title="Favorites"
            isOpen={favoritesOpen}
            onToggle={() => setFavoritesOpen(!favoritesOpen)}
            icon={Star}
          >
            <div className="py-2 px-3 text-sm text-white/50">Add your frequent destinations here</div>
          </CollapsibleSection>

          {/* Records */}
          <CollapsibleSection
            title="Travel Management"
            isOpen={recordsOpen}
            onToggle={() => setRecordsOpen(!recordsOpen)}
            icon={Briefcase}
          >
            <div className="space-y-0.5 py-1">
              {records.map((item) => (
                <NavItem key={item.name} item={item} className="font-medium" />
              ))}
            </div>
          </CollapsibleSection>

          {/* Lists */}
          <CollapsibleSection
            title="Travel Lists"
            isOpen={listsOpen}
            onToggle={() => setListsOpen(!listsOpen)}
            icon={List}
          >
            <div className="space-y-0.5 py-1">
              {lists.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
            <button className="flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white/70 mt-2">
              <Plus className="mr-2 h-4 w-4" weight="bold" />
              <span>New travel list</span>
            </button>
          </CollapsibleSection>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-2">
          <div className="space-y-0.5 mb-3">
            <NavItem
              item={{ name: "Settings", href: "/settings", icon: Gear, description: "Customize your experience" }}
            />
            <NavItem item={{ name: "Help & Support", href: "/help", icon: Question, description: "Get assistance" }} />
          </div>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto rounded-lg hover:bg-white/5 text-white"
              >
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-7 w-7 border border-white/10">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-white/10 text-white text-xs">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate">{userData.name}</p>
                    <p className="text-xs text-white/50 truncate">{userData.role}</p>
                  </div>
                  <CaretUp className="h-4 w-4 text-white/50 shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg p-2 bg-black/95 border-white/10">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{userData.name}</p>
                  <p className="text-xs text-white/50">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>My profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <Gear className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <Buildings className="mr-2 h-4 w-4" />
                <span>My company</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-lg cursor-pointer text-red-400 hover:bg-white/5">
                <SignOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-white/10 lg:bg-black">
        {/* Header */}
        <div className="flex flex-col border-b border-white/10 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Image src="/images/suitpax-logo.webp" alt="Suitpax" width={20} height={20} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-medium tracking-tighter text-white">Suitpax</span>
              <p className="text-xs text-white/50 mt-0.5">{userData.company}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative mb-2">
              <button className="flex w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <MagnifyingGlass className="mr-2 h-4 w-4 text-white/50" weight="duotone" />
                <span className="text-white/50">Search travel options</span>
                <span className="ml-auto text-xs text-white/30">CTRL K</span>
              </button>
            </div>
            <div className="space-y-0.5">
              {quickActions.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-0.5 mb-4">
            {mainNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Automations */}
          <CollapsibleSection
            title="AI Travel Tools"
            isOpen={automationsOpen}
            onToggle={() => setAutomationsOpen(!automationsOpen)}
            icon={Sparkle}
          >
            <div className="space-y-0.5 py-1">
              {automations.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </CollapsibleSection>

          {/* Favorites */}
          <CollapsibleSection
            title="Favorites"
            isOpen={favoritesOpen}
            onToggle={() => setFavoritesOpen(!favoritesOpen)}
            icon={Star}
          >
            <div className="py-2 px-3 text-sm text-white/50">Add your frequent destinations here</div>
          </CollapsibleSection>

          {/* Records */}
          <CollapsibleSection
            title="Travel Management"
            isOpen={recordsOpen}
            onToggle={() => setRecordsOpen(!recordsOpen)}
            icon={Briefcase}
          >
            <div className="space-y-0.5 py-1">
              {records.map((item) => (
                <NavItem key={item.name} item={item} className="font-medium" />
              ))}
            </div>
          </CollapsibleSection>

          {/* Lists */}
          <CollapsibleSection
            title="Travel Lists"
            isOpen={listsOpen}
            onToggle={() => setListsOpen(!listsOpen)}
            icon={List}
          >
            <div className="space-y-0.5 py-1">
              {lists.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
            <button className="flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white/70 mt-2">
              <Plus className="mr-2 h-4 w-4" weight="bold" />
              <span>New travel list</span>
            </button>
          </CollapsibleSection>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-2">
          <div className="space-y-0.5 mb-3">
            <NavItem
              item={{ name: "Settings", href: "/settings", icon: Gear, description: "Customize your experience" }}
            />
            <NavItem item={{ name: "Help & Support", href: "/help", icon: Question, description: "Get assistance" }} />
          </div>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto rounded-lg hover:bg-white/5 text-white"
              >
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-7 w-7 border border-white/10">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-white/10 text-white text-xs">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">{userData.name}</p>
                    <p className="text-xs text-white/50">{userData.role}</p>
                  </div>
                  <CaretUp className="h-4 w-4 text-white/50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg p-2 bg-black/95 border-white/10">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{userData.name}</p>
                  <p className="text-xs text-white/50">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>My profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <Gear className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer text-white hover:bg-white/5">
                <Buildings className="mr-2 h-4 w-4" />
                <span>My company</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-lg cursor-pointer text-red-400 hover:bg-white/5">
                <SignOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
