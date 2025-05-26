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
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Users, Receipt, Car, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Airplane, Train as TrainIcon } from "@phosphor-icons/react"
import { MobileNavigation } from "@/components/ui/mobile-navigation"

interface SidebarProps {
  isOpen?: boolean
  toggleSidebar?: () => void
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
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
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [showMiniChat, setShowMiniChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
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
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      if (!isMobileMenuOpen && touchEndX - touchStartX > 100) {
        setIsMobileMenuOpen(true)
      }

      if (isMobileMenuOpen && touchStartX - touchEndX > 100) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobileMenuOpen])

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (messagesEndRef.current && chatMessages.length > 0) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100
        if (isAtBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
      }
    }
  }, [chatMessages])

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

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      createdAt: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          systemPrompt:
            "You are Suitpax AI, a helpful assistant for business travel management. Help users plan trips, find flights and hotels, manage expenses, and navigate travel policies. Be concise but informative. Provide specific details when possible.",
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      setChatMessages((prev) => [
        ...prev,
        {
          ...data.response,
          createdAt: new Date(data.response.createdAt),
        },
      ])
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
          id: Date.now().toString(),
          createdAt: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function handleQuickActionsClick() {
    setShowMiniChat(true)
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

  function closeSidebar() {
    setIsCollapsed(true)
    setIsMobileMenuOpen(false)
    if (toggleSidebar) toggleSidebar()
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
                  {!isCollapsed && "Suitpax AI Platform"}
                  {isCollapsed && "AI"}
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
                  <NavItem href="/transfers" icon={Car}>
                    Transfers
                  </NavItem>
                  <NavItem href="/events" icon={CalendarDays}>
                    Events
                  </NavItem>
                  <NavItem href="/airport-vip-lounge" icon={CreditCardIcon}>
                    Airport VIP Lounge
                  </NavItem>
                  <NavItem href="/travel-policy" icon={DocumentTextIcon}>
                    Travel Policy
                  </NavItem>
                  <NavItem href="/ai-assistant" icon={ChatBubbleLeftRightIcon}>
                    AI Agent
                  </NavItem>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-0.5">
                <NavItem href="/dashboard" icon={HomeIcon} isActive={true}>
                  Dashboard
                </NavItem>
                <NavItem href="#" icon={BellIcon}>
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
                  collapsedTitle="AN"
                  isExpanded={expandedSections.analytics}
                  onToggle={() => toggleSection("analytics")}
                />
                {expandedSections.analytics && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/analytics" icon={ChartBarIcon}>
                      Predictive Analytics
                    </NavItem>
                    <NavItem href="/analytics/expenses" icon={Receipt}>
                      Expense Reports
                    </NavItem>
                    <NavItem href="/analytics/insights" icon={ChartBarIcon}>
                      Travel Insights
                    </NavItem>
                    <NavItem href="/analytics/budget" icon={BanknotesIcon}>
                      Budget Forecasting
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Lists Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Lists"
                  collapsedTitle="LIST"
                  isExpanded={expandedSections.lists}
                  onToggle={() => toggleSection("lists")}
                />
                {expandedSections.lists && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <button className="w-full flex items-center justify-center px-3 py-2 text-xs border border-dashed border-white/20 rounded-lg text-white/50 hover:bg-white/5 hover:text-white">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      New list
                    </button>
                  </div>
                )}
              </div>

              {/* Finance Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="Finance"
                  collapsedTitle="FIN"
                  isExpanded={expandedSections.finance}
                  onToggle={() => toggleSection("finance")}
                />
                {expandedSections.finance && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/budgets" icon={BriefcaseIcon}>
                      Budgets
                    </NavItem>
                    <NavItem href="/expenses" icon={Receipt}>
                      Expense Management
                    </NavItem>
                    <NavItem href="/smart-bank" icon={BanknotesIcon}>
                      Smart Bank
                    </NavItem>
                    <NavItem href="/team-management" icon={Users}>
                      Team Management
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
                  {isCollapsed && "ACC"}
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
                <p className="text-[10px] text-white/50 font-light">demo-dash.1.0.1</p>
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

      {/* Mobile Navigation Bar */}
      <MobileNavigation />
    </>
  )
}
