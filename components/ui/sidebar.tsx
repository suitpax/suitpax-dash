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
  BellIcon,
  ClipboardDocumentListIcon,
  CommandLineIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowRightIcon,
  MinusIcon,
} from "@heroicons/react/24/outline"
import {
  Plane,
  TrainIcon,
  Users,
  Receipt,
  MailIcon,
  CalendarIcon,
  CalendarDaysIcon,
  Car,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  TrendingUp,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserConfig } from "@/lib/contexts/user-config-context"

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    travel: false,
    analytics: false,
    business: false,
    ai: false,
    finance: false,
  })

  // Replace the chat state and functionality with this enhanced version:
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    {
      text: "¡Hola! Soy tu asistente de viajes corporativos. ¿En qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userConfig } = useUserConfig()

  // Scroll to bottom of chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return

    const userMessage = chatInput.trim()
    setChatInput("")
    setIsLoading(true)
    setIsTyping(true)

    // Add user message immediately
    setChatMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      },
    ])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          isPro: false, // You can make this dynamic based on user plan
          plan: "free",
          userId: "sidebar-user", // You can make this dynamic
          conversationId: `sidebar-${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.response || "Error al procesar la solicitud")
      }

      // Add AI response
      setChatMessages((prev) => [
        ...prev,
        {
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Chat error:", error)

      // Add error message
      setChatMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, he tenido un problema técnico. Por favor, inténtalo de nuevo.",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  function toggleSection(section: string) {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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
        onClick={onClick}
        className={cn(
          "flex items-center justify-between px-3 py-2 text-xs rounded-md transition-all duration-200",
          isActive ? "bg-white/10 text-white font-medium shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white",
        )}
        title={isCollapsed ? String(children) : ""}
      >
        <div className="flex items-center">
          <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"} flex-shrink-0`} />
          {!isCollapsed && <span className="font-light">{children}</span>}
        </div>
        {badge && !isCollapsed && (
          <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-white/10 rounded-full">{badge}</span>
        )}
      </Link>
    )
  }

  function SectionHeader({
    title,
    isExpanded,
    onToggle,
    icon: Icon,
  }: {
    title: string
    isExpanded: boolean
    onToggle: () => void
    icon?: any
  }) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-white/50 hover:text-white/70 rounded-md transition-colors"
      >
        <div className="flex items-center">
          {Icon && <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />}
          {!isCollapsed && <span className="uppercase tracking-wider text-[11px]">{title}</span>}
        </div>
        {!isCollapsed && <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />}
      </button>
    )
  }

  return (
    <>
      {/* Sidebar navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out",
          "bg-black border-r border-white/10",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 px-3 flex items-center justify-between border-b border-white/10 bg-white/5">
            <div className="flex items-center min-w-0 flex-1">
              {!isCollapsed ? (
                <div className="flex items-center min-w-0 flex-1">
                  <div className="relative h-10 w-10 mr-3 rounded-lg overflow-hidden bg-white/10 border border-white/20 flex-shrink-0">
                    {/* Dynamic logo based on user configuration */}
                    <Image
                      src={userConfig?.company?.logo || userConfig?.avatar || "/images/suitpax-cloud-logo.webp"}
                      alt={userConfig?.company ? "Company Logo" : "Profile"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-sm font-semibold text-white truncate">
                        {userConfig?.company?.name || `${userConfig?.firstName} ${userConfig?.lastName}` || "Suitpax"}
                      </h2>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                          userConfig?.accountType === "enterprise"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : userConfig?.accountType === "business"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {userConfig?.accountType === "enterprise"
                          ? "ENTERPRISE"
                          : userConfig?.accountType === "business"
                            ? "PRO"
                            : "PERSONAL"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-[11px] text-white/60 truncate">
                        {userConfig?.company
                          ? `${userConfig.company.industry || "Business"} Account`
                          : `${userConfig?.email || "Personal Account"}`}
                      </p>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-10 w-10 mx-auto rounded-lg overflow-hidden bg-white/10 border border-white/20">
                  <Image
                    src={userConfig?.company?.logo || userConfig?.avatar || "/images/suitpax-cloud-logo.webp"}
                    alt={userConfig?.company ? "Company Logo" : "Profile"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                      userConfig?.accountType === "enterprise"
                        ? "bg-amber-400"
                        : userConfig?.accountType === "business"
                          ? "bg-emerald-400"
                          : "bg-blue-400"
                    }`}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {!isCollapsed && (
                <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                  <Cog6ToothIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            <div className="space-y-6">
              {/* Quick Actions */}
              {!isCollapsed && (
                <div className="px-1 mb-4">
                  <div className="relative">
                    <CommandLineIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Quick actions..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-1">
                <NavItem href="/dashboard" icon={HomeIcon} isActive={true}>
                  Dashboard
                </NavItem>
                <NavItem href="/ai-agents" icon={ChatBubbleLeftRightIcon}>
                  AI Assistant
                </NavItem>
                <NavItem href="/mails" icon={MailIcon} badge="3">
                  Mails
                </NavItem>
                <NavItem href="/meetings" icon={CalendarIcon}>
                  Meetings
                </NavItem>
                <NavItem href="/events" icon={CalendarDaysIcon}>
                  Events
                </NavItem>
                <NavItem href="/notifications" icon={BellIcon} badge="3">
                  Notifications
                </NavItem>
              </div>

              {/* Business Travel Section */}
              <div className="space-y-1">
                <SectionHeader
                  title="Business Travel"
                  icon={Plane}
                  isExpanded={expandedSections.travel}
                  onToggle={() => toggleSection("travel")}
                />
                {expandedSections.travel && !isCollapsed && (
                  <div className="ml-7 space-y-1">
                    <NavItem href="/flights" icon={Plane}>
                      Flights
                    </NavItem>
                    <NavItem href="/hotels" icon={BuildingOfficeIcon}>
                      Hotels
                    </NavItem>
                    <NavItem href="/trains" icon={TrainIcon}>
                      Trains
                    </NavItem>
                    <NavItem href="/transfers" icon={Car}>
                      Car Transfers
                    </NavItem>
                    <NavItem href="/airport-vip-lounge" icon={CreditCardIcon}>
                      VIP Lounge
                    </NavItem>
                    <NavItem href="/travel-policy" icon={DocumentTextIcon}>
                      Travel Policy
                    </NavItem>
                    <NavItem href="/cars" icon={Car}>
                      Car Rental
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Analytics Section */}
              <div className="space-y-1">
                <SectionHeader
                  title="Analytics"
                  icon={BarChart3}
                  isExpanded={expandedSections.analytics}
                  onToggle={() => toggleSection("analytics")}
                />
                {expandedSections.analytics && !isCollapsed && (
                  <div className="ml-7 space-y-1">
                    <NavItem href="#" icon={TrendingUp}>
                      Performance
                    </NavItem>
                    <NavItem href="#" icon={SparklesIcon}>
                      Insights
                    </NavItem>
                    <NavItem href="/reports" icon={FileText}>
                      Reports
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Business Hub Section */}
              <div className="space-y-1">
                <SectionHeader
                  title="Business Hub"
                  icon={BriefcaseIcon}
                  isExpanded={expandedSections.business}
                  onToggle={() => toggleSection("business")}
                />
                {expandedSections.business && !isCollapsed && (
                  <div className="ml-7 space-y-1">
                    <NavItem href="#" icon={BuildingOfficeIcon}>
                      Companies
                    </NavItem>
                    <NavItem href="#" icon={UserIcon}>
                      People
                    </NavItem>
                    <NavItem href="#" icon={BriefcaseIcon}>
                      Deals
                    </NavItem>
                    <NavItem href="#" icon={BellIcon}>
                      Notifications
                    </NavItem>
                    <NavItem href="/tasks" icon={ClipboardDocumentListIcon}>
                      Tasks
                    </NavItem>
                    <NavItem href="/approvals" icon={ClipboardDocumentListIcon}>
                      Approvals
                    </NavItem>
                    <NavItem href="/travel-history" icon={DocumentTextIcon}>
                      Travel History
                    </NavItem>
                  </div>
                )}
              </div>

              {/* AI Tools Section */}
              <div className="space-y-1">
                <SectionHeader
                  title="AI Tools"
                  icon={SparklesIcon}
                  isExpanded={expandedSections.ai}
                  onToggle={() => toggleSection("ai")}
                />
                {expandedSections.ai && !isCollapsed && (
                  <div className="ml-7 space-y-1">
                    <NavItem href="/ai-agents" icon={ChatBubbleLeftRightIcon}>
                      AI Agents
                    </NavItem>
                    {/* Eliminadas las opciones de AI Capabilities y AI Studio */}
                  </div>
                )}
              </div>

              {/* Finance Section */}
              <div className="space-y-1">
                <SectionHeader
                  title="Finance"
                  icon={BanknotesIcon}
                  isExpanded={expandedSections.finance}
                  onToggle={() => toggleSection("finance")}
                />
                {expandedSections.finance && !isCollapsed && (
                  <div className="ml-7 space-y-1">
                    <NavItem href="#" icon={BriefcaseIcon}>
                      Budgets
                    </NavItem>
                    <NavItem href="/expenses" icon={Receipt}>
                      Expenses
                    </NavItem>
                    <NavItem href="#" icon={BanknotesIcon}>
                      Smart Bank
                    </NavItem>
                    <NavItem href="/team-management" icon={Users}>
                      Teams
                    </NavItem>
                  </div>
                )}
              </div>

              {/* Account Section */}
              <div className="space-y-1">
                <div
                  className={`px-3 mb-1 text-[10px] font-medium tracking-wider uppercase text-white/50 ${isCollapsed ? "text-center" : ""}`}
                >
                  {!isCollapsed && "Account"}
                </div>
                <div className="space-y-1">
                  <NavItem href="/profile" icon={UserIcon}>
                    Profile
                  </NavItem>
                  <NavItem href="/settings" icon={Cog6ToothIcon}>
                    Settings
                  </NavItem>
                  <NavItem href="/billing" icon={CreditCardIcon}>
                    Billing
                  </NavItem>
                  <NavItem href="/help" icon={BellIcon}>
                    Help & Support
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Chat Card */}
          <div className="p-3 border-t border-white/10">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* AI Agent Quick Input */}
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-white">AI Agent</span>
                    </div>
                    <button
                      className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                      onClick={() => setIsChatMinimized(!isChatMinimized)}
                    >
                      {isChatMinimized ? <PlusCircleIcon className="h-3 w-3" /> : <MinusIcon className="h-3 w-3" />}
                    </button>
                  </div>

                  {!isChatMinimized && (
                    <>
                      <div className="p-2 h-32 overflow-y-auto bg-black/30">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`mb-2 flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[85%] p-2 rounded-md text-[10px] ${
                                msg.isUser
                                  ? "bg-white/10 text-white rounded-tr-none"
                                  : "bg-white/5 text-white/90 rounded-tl-none"
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                              <div className="text-[8px] text-white/40 mt-1">
                                {msg.timestamp.toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start mb-2">
                            <div className="bg-white/5 p-2 rounded-md rounded-tl-none">
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
                                <div
                                  className="w-1 h-1 bg-white/50 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-1 h-1 bg-white/50 rounded-full animate-bounce"
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
                            placeholder="Ask AI agent..."
                            disabled={isLoading}
                            className="w-full pl-3 pr-8 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-50"
                            disabled={!chatInput.trim() || isLoading}
                          >
                            {isLoading ? (
                              <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                            ) : (
                              <ArrowRightIcon className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* Quick AI Input - Always visible */}
                <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                  <form onSubmit={handleChatSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Quick AI query..."
                        disabled={isLoading}
                        className="w-full pl-3 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-50"
                        disabled={!chatInput.trim() || isLoading}
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                        ) : (
                          <ArrowRightIcon className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                </div>
                <div className="w-full">
                  <form onSubmit={handleChatSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="AI..."
                        disabled={isLoading}
                        className="w-full px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 text-center"
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}
