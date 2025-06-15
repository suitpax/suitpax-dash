"use client"

import type * as React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  CommandLineIcon,
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
  Truck,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  TrendingUp,
  FileText,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    travel: false,
    analytics: false,
    business: false,
    finance: false,
  })

  // Replace the chat state and functionality with this enhanced version:
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    {
      text: "Hello! I'm your corporate travel assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

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
          plan: "pro",
          userId: "sidebar-user",
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
          text: "Sorry, I'm having technical issues. Please try again.",
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
        <div className="flex items-center flex-1">
          <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"} flex-shrink-0`} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span className="font-light">{children}</span>
            </div>
          )}
        </div>
        {badge && !isCollapsed && (
          <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full">
            {badge}
          </span>
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
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-white/50 hover:text-white/70 rounded-lg transition-colors"
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
          <div className="h-14 px-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              {!isCollapsed && (
                <div className="flex items-center">
                  <div className="relative h-8 w-8 mr-3 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/suitpax-cloud-logo.webp"
                      alt="Suitpax Logo"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-white">{userProfile?.companyName || "Suitpax"}</h2>
                    <div className="flex items-center space-x-1">
                      <Crown className="h-3 w-3 text-yellow-400" />
                      <p className="text-[10px] text-yellow-300 font-medium">
                        {userProfile?.currentPlan || "Pro Plan"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="relative h-8 w-8 mx-auto rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/suitpax-cloud-logo.webp"
                    alt="Suitpax Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
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
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-1">
                <NavItem href="/dashboard" icon={HomeIcon} isActive={false}>
                  Dashboard
                </NavItem>
                <NavItem href="/suitpax-ai" icon={SparklesIcon}>
                  Suitpax AI
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
                    <NavItem href="/transfers" icon={Truck}>
                      Car Transfers
                      <span className="ml-2 px-2 py-0.5 text-[9px] font-medium bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                        Development
                      </span>
                    </NavItem>
                    <NavItem href="/travel-policy" icon={DocumentTextIcon}>
                      Travel Policy
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
                    <NavItem href="#" icon={FileText}>
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
                    <NavItem href="/smart-bank" icon={BanknotesIcon}>
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
                </div>
              </div>
            </div>
          </div>

          {/* Mini Chat Card */}
          <div className="p-3 border-t border-white/10">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* AI Agent Quick Input */}
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-white">AI Agent</span>
                      <div className="ml-2 px-2 py-0.5 text-[9px] font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-full">
                        Pro
                      </div>
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
                      <div className="p-2 h-36 overflow-y-auto bg-black/20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`mb-3 flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[90%] p-2.5 rounded-xl text-[10px] leading-relaxed ${
                                msg.isUser
                                  ? "bg-white/15 text-white rounded-tr-none"
                                  : "bg-white/8 text-white rounded-tl-none border border-white/10"
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                              <div className="text-[8px] text-white/50 mt-1.5 text-right">
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
                            <div className="bg-white/5 p-2 rounded-lg rounded-tl-none">
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
                            placeholder="Try ask anything..."
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
                <div className="bg-white/5 rounded-xl border border-white/10 p-2">
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

// Export both named and default
export { Sidebar }
export default Sidebar
