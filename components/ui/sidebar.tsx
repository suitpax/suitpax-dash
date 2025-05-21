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
  XMarkIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowRightIcon,
  MinusIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Plane, TrainIcon, Users, X, Menu, Receipt, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
// Primero, asegúrate de que tenemos el componente Badge importado
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  isOpen?: boolean
  toggleSidebar?: () => void
}

export function Sidebar({ isOpen = true, toggleSidebar }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    automations: false,
    records: true,
    lists: false,
  })
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi there! How can I help you with your business travel today?", isUser: false },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle body scroll lock when menu is open
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

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  // Scroll to bottom of chat messages
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
      // Create a new object with all sections set to false
      const newState = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = false
          return acc
        },
        {} as Record<string, boolean>,
      )

      // Only set the clicked section to true if it wasn't already expanded
      newState[section] = !prev[section]

      return newState
    })
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Add user message
    setChatMessages((prev) => [...prev, { text: chatInput, isUser: true }])
    const userQuestion = chatInput
    setChatInput("")
    setIsTyping(true)

    // Check for flight booking commands
    const input = userQuestion.toLowerCase()
    const isFlightBooking =
      (input.includes("book") || input.includes("reserve")) &&
      input.includes("flight") &&
      (input.includes("to") || input.includes("from"))

    // Simulate AI response
    setTimeout(
      () => {
        let response = ""

        if (isFlightBooking) {
          // Extract origin and destination from input
          let origin = "Madrid"
          let destination = "London"
          let airline = "British Airways"

          // Try to extract origin
          const fromMatch = input.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+with|\s+on|\s+for|\s+$)/i)
          if (fromMatch && fromMatch[1]) {
            origin = fromMatch[1].trim()
            // Capitalize first letter of each word
            origin = origin
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          // Try to extract destination
          const toMatch = input.match(/to\s+([a-zA-Z\s]+?)(?:\s+with|\s+on|\s+for|\s+$)/i)
          if (toMatch && toMatch[1]) {
            destination = toMatch[1].trim()
            // Capitalize first letter of each word
            destination = destination
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          // Try to extract airline
          const airlineMatch = input.match(/(?:with|on)\s+([a-zA-Z\s]+?)(?:\s+from|\s+to|\s+for|\s+$)/i)
          if (airlineMatch && airlineMatch[1]) {
            airline = airlineMatch[1].trim()
            // Capitalize first letter of each word
            airline = airline
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          const date = new Date()
          date.setDate(date.getDate() + 7) // Default to 1 week from now
          const formattedDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

          response = `I've found several flight options from ${origin} to ${destination} with ${airline} for ${formattedDate}. Would you like me to book one for you? Click here to see all options.`
        } else if (input.includes("flight") || input.includes("fly")) {
          response =
            "I can help you find flights! What's your departure city, destination, and travel dates? Try saying 'Book a flight from Madrid to London with British Airways'."
        } else if (input.includes("hotel") || input.includes("stay") || input.includes("accommodation")) {
          response =
            "I'd be happy to help you find a hotel! Which city are you visiting and when? Try saying 'Find hotels in Barcelona for next weekend'."
        } else if (input.includes("expense") || input.includes("receipt") || input.includes("reimbursement")) {
          response =
            "I can help you manage your travel expenses. Would you like to submit a new expense or review your existing ones?"
        } else if (input.includes("policy") || input.includes("compliance") || input.includes("rules")) {
          response =
            "Here's a summary of your company's travel policy: Economy class for flights under 6 hours, maximum hotel rates vary by city, and receipts required for expenses over $25."
        } else if (input.includes("car") || input.includes("rental") || input.includes("transportation")) {
          response =
            "I can help you book a rental car. What dates do you need it for, and where will you be picking it up?"
        } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
          response =
            "Hello! I'm your Suitpax AI Agent. How can I help with your business travel needs today? Try asking me to book a flight or find a hotel."
        } else if (input.includes("meeting") || input.includes("conference") || input.includes("video")) {
          response = "Would you like me to schedule a meeting or set up a video conference for your business trip?"
        } else if (input.includes("budget") || input.includes("cost") || input.includes("price")) {
          response = "I can help you track your travel budget and find options within your company's spending limits."
        } else {
          response =
            "I'm here to help with all your business travel needs! I can assist with flights, hotels, car rentals, expense management, and travel policy questions. Try saying 'Book a flight from Madrid to London'."
        }

        setChatMessages((prev) => [...prev, { text: response, isUser: false }])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  // Modifica el componente NavItem para aceptar un badge
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
          <>
            <span className="truncate font-light">{children}</span>
            {badge && (
              <Badge
                className="ml-auto text-[9px] py-0 px-1.5 h-4 bg-amber-500/20 text-amber-500 border-amber-500/30"
                variant="outline"
              >
                {badge}
              </Badge>
            )}
          </>
        )}
        {isCollapsed && badge && <div className="absolute -right-1 -top-1 w-2 h-2 bg-amber-500 rounded-full"></div>}
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
      {/* Mobile menu button - only visible when sidebar is closed */}
      {!isMobileMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed top-4 left-4 z-[70] p-1.5 rounded-lg bg-black/90 shadow-md text-white border border-white/10"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Sidebar navigation */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-[60] transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:relative lg:border-r",
          "bg-black border-white/10",
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          isCollapsed ? "w-16" : "w-[280px]",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              {!isCollapsed && (
                <div className="relative group cursor-pointer">
                  <div className="flex items-center">
                    <div className="relative h-7 w-7 mr-2 bg-white/10 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?key=t120v"
                        alt="Anthropic Logo"
                        width={28}
                        height={28}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-sm text-white font-medium">Suitpax</h2>
                      <p className="text-[10px] text-white/70 font-light">Business Travel AI</p>
                    </div>
                  </div>

                  {/* Profile dropdown that appears on hover/click */}
                  <div className="absolute left-0 top-full mt-1 w-48 bg-black/95 rounded-lg shadow-lg border border-white/10 hidden group-hover:block z-50">
                    <div className="p-3 border-b border-white/10">
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 mr-2 rounded-full overflow-hidden">
                          <Image
                            src="/images/team/orlando-diggs.jpeg"
                            alt="Community Member"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Orlando Diggs</p>
                          <p className="text-xs text-white/50">Product Lead @ Anthropic</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1">
                      <button className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-md">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-md">
                        Company Settings
                      </button>
                      <button className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-md">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="relative h-7 w-7 mx-auto rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?key=ljbxi"
                    alt="Anthropic Logo"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block p-1 rounded-lg hover:bg-white/5 transition-colors bg-transparent text-white/70 border border-white/10"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-white/5 transition-colors bg-white/5 text-white/70 border border-white/10"
                aria-label="Close sidebar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-2 px-2">
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="px-2 mb-1.5">
                <div className="relative">
                  <CommandLineIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Quick actions"
                    className="w-full pl-10 pr-16 py-2 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded">
                    CTRL K
                  </div>
                </div>
              </div>

              {/* Business Travel Section */}
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Suitpax AI Platform"}
                  {isCollapsed && "AI"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="/flights" icon={Plane}>
                    Flights
                  </NavItem>
                  <NavItem href="/hotels" icon={BuildingOfficeIcon}>
                    Hotels
                  </NavItem>
                  <NavItem href="/trains" icon={TrainIcon} badge="Development">
                    Trains
                  </NavItem>
                  <NavItem href="/airport-vip-lounge" icon={CreditCardIcon} badge="Development">
                    Airport VIP Lounge
                  </NavItem>
                  <NavItem href="/travel-policy" icon={DocumentTextIcon}>
                    Travel Policy
                  </NavItem>
                  <NavItem href="/ai-assistant" icon={ChatBubbleLeftRightIcon} badge="Development">
                    AI Agent
                  </NavItem>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-0.5">
                <NavItem href="/dashboard" icon={HomeIcon} isActive={true}>
                  Dashboard
                </NavItem>
                <NavItem href="#" icon={BellIcon} badge="Development">
                  Notifications
                </NavItem>
                <NavItem href="/tasks" icon={ClipboardDocumentListIcon}>
                  Tasks
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
                    <NavItem href="#" icon={RocketLaunchIcon} badge="Development">
                      Sequences
                    </NavItem>
                    <NavItem href="#" icon={SparklesIcon} badge="Development">
                      Workflows
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
                    <NavItem href="#" icon={BuildingOfficeIcon}>
                      Companies
                    </NavItem>
                    <NavItem href="#" icon={UserIcon}>
                      People
                    </NavItem>
                    <NavItem href="#" icon={BriefcaseIcon}>
                      Deals
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
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Finance"}
                  {isCollapsed && "FIN"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="#" icon={BriefcaseIcon}>
                    Budgets
                  </NavItem>
                  <NavItem href="/expenses" icon={Receipt}>
                    Expense Management
                  </NavItem>
                  <NavItem href="#" icon={BanknotesIcon}>
                    Smart Bank
                  </NavItem>
                  <NavItem href="/team-management" icon={Users}>
                    Team Management
                  </NavItem>
                </div>
              </div>

              {/* AI Tools Section */}
              <div className="mb-2">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-tighter uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "AI Tools"}
                  {isCollapsed && "AI"}
                </div>
                <div className="space-y-0.5">
                  <NavItem href="/ai-agents" icon={PlusCircleIcon}>
                    AI Agents
                  </NavItem>
                  <NavItem href="/voice-ai" icon={Mic} badge="Development">
                    Voice AI
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

          {/* Mini Chat Card with minimize/maximize functionality */}
          <div className="px-3 py-4 border-t border-white/10">
            {!isCollapsed ? (
              <div className="overflow-hidden bg-white/5 rounded-lg shadow-sm">
                <div className="p-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative h-7 w-7 rounded-full overflow-hidden mr-2">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                    </div>
                    <span className="text-xs font-medium text-white">Suitpax AI Agent</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                      onClick={() => setIsChatMinimized(!isChatMinimized)}
                    >
                      {isChatMinimized ? <PlusCircleIcon className="h-3 w-3" /> : <MinusIcon className="h-3 w-3" />}
                    </button>
                    <button className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white ml-1">
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {!isChatMinimized && (
                  <>
                    <div className="p-2 h-40 overflow-y-auto bg-black/30 overscroll-contain">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-2 flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] p-2 rounded-lg text-[10px] ${
                              msg.isUser
                                ? "bg-white/10 text-white rounded-tr-none"
                                : "bg-white/5 text-white/90 rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start mb-2">
                          <div className="bg-white/5 p-2 rounded-lg rounded-tl-none">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                              <div
                                className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-2 border-t border-white/10">
                      <div className="relative">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask me anything..."
                          className="w-full pl-3 pr-9 py-2 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white"
                          disabled={!chatInput.trim() || isTyping}
                        >
                          <ArrowRightIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                </div>
              </div>
            )}
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
      </nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
