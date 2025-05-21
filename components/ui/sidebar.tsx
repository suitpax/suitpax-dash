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
  CommandLineIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Users, X, Menu, Receipt, Mic, Car, Send } from "lucide-react"
import { cn } from "@/lib/utils"
// Primero, asegúrate de que tenemos el componente Badge importado
import { Badge } from "@/components/ui/badge"
import type { Message } from "@/lib/ai/anthropic-service"
import { Airplane, Train as TrainIcon } from "@phosphor-icons/react"

interface SidebarProps {
  isOpen?: boolean
  toggleSidebar?: () => void
}

export function Sidebar({ isOpen = true, toggleSidebar }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    automations: false,
    records: false,
    lists: false,
    finance: false,
    aiTools: false,
    analytics: false,
  })
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [showMiniChat, setShowMiniChat] = useState(false)
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

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || isTyping) return

    // Add user message
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
      // Simular respuesta de la IA para evitar errores de API
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Estoy aquí para ayudarte con la gestión de viajes de negocios. ¿En qué puedo asistirte hoy?",
            id: Date.now().toString(),
            createdAt: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error)
      // Añadir mensaje de error
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
          id: Date.now().toString(),
          createdAt: new Date(),
        },
      ])
      setIsTyping(false)
    }
  }

  function handleQuickActionsClick() {
    setShowMiniChat(true)
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
          <div className="flex items-center justify-between w-full">
            <span className="truncate font-light">{children}</span>
            {badge && (
              <Badge
                className="ml-2 text-[9px] py-0 px-1.5 h-4 bg-amber-500/20 text-amber-500 border-amber-500/30"
                variant="outline"
              >
                {badge}
              </Badge>
            )}
          </div>
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
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-1.5 rounded-lg bg-black/90 shadow-md text-white border border-white/10"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4 flex-shrink-0" />
      </button>

      {/* Sidebar navigation */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-[60] transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:relative lg:border-r",
          "bg-black border-white/10",
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
          isCollapsed ? "lg:w-16" : "lg:w-64 md:w-64 sm:w-full",
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
                        src="/images/suitpax-cloud-logo.webp"
                        alt="Suitpax Logo"
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
                    src="/images/suitpax-cloud-logo.webp"
                    alt="Suitpax Logo"
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
                    onClick={handleQuickActionsClick}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded">
                    CTRL K
                  </div>
                </div>
              </div>

              {/* Mini Chat */}
              {showMiniChat && (
                <div className="px-2 mb-3">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm overflow-hidden">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-2 border-b border-white/10">
                      <div className="flex items-center">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                          <Image src="/images/ai-agent-avatar.png" alt="AI Assistant" fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-xs">Suitpax AI</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMiniChat(false)}
                        className="p-1 rounded-lg hover:bg-white/5 text-white/70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="max-h-[200px] overflow-y-auto p-2 space-y-2">
                      {chatMessages.length === 0 ? (
                        <div className="text-xs text-white/70 text-center py-2">
                          Ask me anything about business travel...
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-2 ${
                                message.role === "user"
                                  ? "bg-white/10 text-white rounded-tr-none"
                                  : "bg-white/5 text-white/70 rounded-tl-none"
                              }`}
                            >
                              <p className="text-xs whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 text-white/70 rounded-lg rounded-tl-none max-w-[80%] p-2">
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

                    {/* Chat Input */}
                    <form onSubmit={handleChatSubmit} className="p-2 border-t border-white/10">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full pl-3 pr-8 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isTyping}
                          className={`absolute right-2 p-1 rounded-full ${
                            chatInput.trim() && !isTyping
                              ? "text-white hover:bg-white/10"
                              : "text-white/30 cursor-not-allowed"
                          }`}
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      </div>
                    </form>

                    {/* Footer */}
                    <div className="p-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-white/50">Powered by Suitpax</span>
                      <Link
                        href="/ai-assistant"
                        className="text-[10px] text-white/70 hover:text-white flex items-center"
                      >
                        Open full chat <ChevronRightIcon className="h-2 w-2 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Chat Input */}
              <div className="px-2 mb-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full overflow-hidden">
                    <Image
                      src="/images/ai-agent-avatar.png"
                      alt="AI Assistant"
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="w-full pl-10 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                    onClick={handleQuickActionsClick}
                  />
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
                {/* Añadir la sección de Transfers después de Trains en la sección Business Travel */}
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
                    <NavItem href="#" icon={RocketLaunchIcon}>
                      Sequences
                    </NavItem>
                    <NavItem href="#" icon={SparklesIcon}>
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
                    {/* Nuevas secciones añadidas */}
                    <NavItem href="/emails" icon={EnvelopeIcon}>
                      Emails
                    </NavItem>
                    <NavItem href="/meetings" icon={CalendarIcon}>
                      Meetings
                    </NavItem>
                    <NavItem href="/analytics" icon={ChartBarIcon}>
                      Analytics
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
                    <NavItem href="#" icon={BriefcaseIcon}>
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

              {/* AI Tools Section */}
              <div className="space-y-0.5">
                <SectionHeader
                  title="AI Tools"
                  collapsedTitle="AI"
                  isExpanded={expandedSections.aiTools}
                  onToggle={() => toggleSection("aiTools")}
                />
                {expandedSections.aiTools && !isCollapsed && (
                  <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    <NavItem href="/ai-agents" icon={PlusCircleIcon}>
                      AI Agents
                    </NavItem>
                    <NavItem href="/voice-ai" icon={Mic}>
                      Voice AI
                    </NavItem>
                  </div>
                )}
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
