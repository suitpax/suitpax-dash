"use client"

import type * as React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  EnvelopeIcon,
  CalendarIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Users, Receipt, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Airplane, Train as TrainIcon } from "@phosphor-icons/react"

interface SidebarProps {
  isOpen?: boolean
  toggleSidebar?: () => void
}

interface ListItem {
  id: string
  name: string
  createdAt: Date
}

export function Sidebar({ isOpen = false, toggleSidebar }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(!isOpen)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    automations: false,
    records: false,
    lists: false,
    finance: false,
    analytics: false,
  })
  const [lists, setLists] = useState<ListItem[]>([])
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [newListName, setNewListName] = useState("")
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsCollapsed(!isOpen)

    if (window.innerWidth >= 1024 && !isOpen) {
      setIsCollapsed(true)
    }

    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(isOpen)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
        setIsCollapsed(true)
        if (toggleSidebar) toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, toggleSidebar])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function toggleSection(section: string) {
    setExpandedSections((prev) => {
      const newState = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = false
          return acc
        },
        {} as Record<string, boolean>,
      )

      newState[section] = !prev[section]

      return newState
    })
  }

  function handleCreateList() {
    if (newListName.trim()) {
      const newList: ListItem = {
        id: Date.now().toString(),
        name: newListName.trim(),
        createdAt: new Date(),
      }
      setLists([...lists, newList])
      setNewListName("")
      setShowNewListInput(false)
    }
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false,
    onClick,
    badge,
  }: {
    href: string
    icon: any
    children: React.ReactNode
    isActive?: boolean
    onClick?: () => void
    badge?: string
  }) {
    return (
      <Link
        href={href}
        onClick={() => {
          handleNavigation()
          onClick?.()
        }}
        className={cn(
          "flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors",
          isActive ? "bg-white/10 text-white font-medium" : "text-white/70 hover:bg-white/5 hover:text-white",
        )}
        title={isCollapsed ? String(children) : ""}
      >
        <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"} flex-shrink-0`} />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className="truncate font-light">{children}</span>
            {badge && (
              <Badge
                className="ml-2 text-[9px] py-0 px-1.5 h-4 bg-amber-500/20 text-amber-500/30 border-amber-500/30"
                variant="outline"
              >
                {badge}
              </Badge>
            )}
          </div>
        )}
      </Link>
    )
  }

  function SectionHeader({
    title,
    collapsedTitle,
    isExpanded,
    onToggle,
  }: {
    title: string
    collapsedTitle: string
    isExpanded: boolean
    onToggle: () => void
  }) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-medium tracking-tighter uppercase text-white/50 hover:text-white/70 rounded-lg"
      >
        <span>{isCollapsed ? collapsedTitle : title}</span>
        {!isCollapsed && (
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        )}
      </button>
    )
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-[100] transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:relative lg:border-r",
          "bg-black border-white/10",
          "flex flex-col h-screen",
          "top-0",
          isMobileMenuOpen || isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
          isCollapsed ? "lg:w-16" : "lg:w-64 md:w-64 sm:w-full",
          isCollapsed ? "w-16" : "w-[280px]",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              {!isCollapsed ? (
                <div className="flex items-center">
                  <Image
                    src="/images/suitpax-cloud-logo.webp"
                    alt="Suitpax Logo"
                    width={100}
                    height={24}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden flex items-center justify-center bg-white/5">
                    <Image
                      src="/images/suitpax-bl-logo.webp"
                      alt="Suitpax Logo"
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!isCollapsed && (
                <button
                  onClick={() => {
                    if (toggleSidebar) {
                      toggleSidebar()
                    } else {
                      setIsCollapsed(true)
                      if (window.innerWidth < 1024) {
                        setIsMobileMenuOpen(false)
                      }
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors bg-white/5 text-white/70 border border-white/10"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                </button>
              )}

              {isCollapsed && (
                <button
                  onClick={() => {
                    if (toggleSidebar) {
                      toggleSidebar()
                    } else {
                      setIsCollapsed(false)
                      if (window.innerWidth < 1024) {
                        setIsMobileMenuOpen(true)
                      }
                    }
                  }}
                  className="hidden lg:block p-1.5 rounded-lg hover:bg-white/5 transition-colors bg-transparent text-white/70 border border-white/10"
                  aria-label="Expand sidebar"
                >
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-3 px-3">
            <div className="space-y-3">
              {/* Business Travel Section */}
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Travel Platform"}
                  {isCollapsed && "TRAVEL"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="/flights" icon={Airplane}>
                    Flights
                  </NavItem>
                  <NavItem href="/hotels" icon={BuildingOfficeIcon}>
                    Hotels
                  </NavItem>
                  <NavItem href="/trains" icon={TrainIcon}>
                    Trains
                  </NavItem>
                  <NavItem href="/transfers" icon={TruckIcon}>
                    Transfers
                  </NavItem>
                  <NavItem href="/events" icon={CalendarDays}>
                    Events
                  </NavItem>
                  <NavItem href="/airport-vip-lounge" icon={CreditCardIcon}>
                    VIP Lounge
                  </NavItem>
                  <NavItem href="/travel-policy" icon={DocumentTextIcon}>
                    Travel Policy
                  </NavItem>
                  <NavItem href="/ai-assistant" icon={ChatBubbleLeftRightIcon}>
                    AI Assistant
                  </NavItem>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-0.5">
                <NavItem href="/dashboard" icon={HomeIcon} isActive={true}>
                  Dashboard
                </NavItem>
                <NavItem href="/notifications" icon={BellIcon}>
                  Notifications
                </NavItem>
                <NavItem href="/tasks" icon={ClipboardDocumentListIcon}>
                  Tasks
                </NavItem>
                <NavItem href="/mails" icon={EnvelopeIcon}>
                  Mails
                </NavItem>
                <NavItem href="/meetings" icon={CalendarIcon}>
                  Meetings
                </NavItem>
              </div>

              {/* Automations Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Automations"
                  collapsedTitle="AUTO"
                  isExpanded={expandedSections.automations}
                  onToggle={() => toggleSection("automations")}
                />
                {expandedSections.automations && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/workflows" icon={RocketLaunchIcon}>
                      Workflows
                    </NavItem>
                    <NavItem href="/sequences" icon={SparklesIcon}>
                      Sequences
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Records Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Business Hub"
                  collapsedTitle="HUB"
                  isExpanded={expandedSections.records}
                  onToggle={() => toggleSection("records")}
                />
                {expandedSections.records && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/companies" icon={BuildingOfficeIcon}>
                      Companies
                    </NavItem>
                    <NavItem href="/people" icon={UserIcon}>
                      People
                    </NavItem>
                    <NavItem href="/deals" icon={BriefcaseIcon}>
                      Deals
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Analytics Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Analytics"
                  collapsedTitle="ANALYTICS"
                  isExpanded={expandedSections.analytics}
                  onToggle={() => toggleSection("analytics")}
                />
                {expandedSections.analytics && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/analytics" icon={ChartBarIcon}>
                      Overview
                    </NavItem>
                    <NavItem href="/analytics/expenses" icon={Receipt}>
                      Expense Reports
                    </NavItem>
                    <NavItem href="/analytics/insights" icon={ChartBarIcon}>
                      Travel Insights
                    </NavItem>
                    <NavItem href="/analytics/budget" icon={BanknotesIcon}>
                      Budget Tracking
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Lists Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Lists"
                  collapsedTitle="LISTS"
                  isExpanded={expandedSections.lists}
                  onToggle={() => toggleSection("lists")}
                />
                {expandedSections.lists && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    {lists.map((list) => (
                      <Link
                        key={list.id}
                        href={`/lists/${list.id}`}
                        className="flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        <ClipboardDocumentListIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate font-light">{list.name}</span>
                      </Link>
                    ))}
                    {showNewListInput ? (
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCreateList()
                            } else if (e.key === "Escape") {
                              setShowNewListInput(false)
                              setNewListName("")
                            }
                          }}
                          onBlur={() => {
                            if (newListName.trim()) {
                              handleCreateList()
                            } else {
                              setShowNewListInput(false)
                            }
                          }}
                          placeholder="List name"
                          className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowNewListInput(true)}
                        className="w-full flex items-center justify-center px-3 py-2 text-xs border border-dashed border-white/20 rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-2" />
                        New list
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Finance Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Finance"
                  collapsedTitle="FINANCE"
                  isExpanded={expandedSections.finance}
                  onToggle={() => toggleSection("finance")}
                />
                {expandedSections.finance && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/budgets" icon={BriefcaseIcon}>
                      Budgets
                    </NavItem>
                    <NavItem href="/expenses" icon={Receipt}>
                      Expenses
                    </NavItem>
                    <NavItem href="/smart-bank" icon={BanknotesIcon}>
                      Smart Bank
                    </NavItem>
                    <NavItem href="/team-management" icon={Users}>
                      Team
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Plans Section */}
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Subscription"}
                  {isCollapsed && "SUB"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="/plans" icon={CreditCardIcon} badge="Pro">
                    Plans
                  </NavItem>
                </div>
              </div>

              {/* Account Section */}
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Account"}
                  {isCollapsed && "ACCOUNT"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="/profile" icon={UserIcon}>
                    Profile
                  </NavItem>
                  <NavItem href="/settings" icon={Cog6ToothIcon}>
                    Settings
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Only visible when not collapsed */}
          {!isCollapsed && (
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-xs font-light">Suitpax</span>
                </div>
                <p className="text-[10px] text-white/50 font-light">v1.0.1</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false)
            if (toggleSidebar && window.innerWidth < 1024) toggleSidebar()
          }}
        />
      )}
    </>
  )
}
