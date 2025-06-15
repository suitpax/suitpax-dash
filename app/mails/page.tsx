"use client"

import { useState, Suspense } from "react"
import { Layout } from "@/components/ui/layout"
import {
  EnvelopeIcon,
  InboxIcon,
  PaperAirplaneIcon,
  TrashIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"

type Email = {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  isRead: boolean
  isStarred: boolean
  priority: "high" | "medium" | "low"
  category: "travel" | "expense" | "meeting" | "general"
}

function MailsContent() {
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [isConfigured, setIsConfigured] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [emails] = useState<Email[]>([
    {
      id: "1",
      from: "Travel Coordinator",
      subject: "Flight confirmation for NYC trip",
      preview: "Your flight to New York has been confirmed for March 15th...",
      date: "2 hours ago",
      isRead: false,
      isStarred: true,
      priority: "high",
      category: "travel",
    },
    {
      id: "2",
      from: "Hotel Marriott",
      subject: "Booking confirmation #MR2024",
      preview: "Thank you for choosing Marriott. Your reservation is confirmed...",
      date: "5 hours ago",
      isRead: true,
      isStarred: false,
      priority: "medium",
      category: "travel",
    },
    {
      id: "3",
      from: "Finance Team",
      subject: "Expense report approved",
      preview: "Your expense report for February has been approved...",
      date: "Yesterday",
      isRead: true,
      isStarred: false,
      priority: "low",
      category: "expense",
    },
  ])

  const folders = [
    { id: "inbox", name: "Inbox", icon: InboxIcon, count: emails.filter((e) => !e.isRead).length },
    { id: "sent", name: "Sent", icon: PaperAirplaneIcon, count: 0 },
    { id: "starred", name: "Starred", icon: StarIcon, count: emails.filter((e) => e.isStarred).length },
    { id: "trash", name: "Trash", icon: TrashIcon, count: 0 },
  ]

  const categories = [
    { id: "all", name: "All", count: emails.length },
    { id: "travel", name: "Travel", count: emails.filter((e) => e.category === "travel").length },
    { id: "expense", name: "Expenses", count: emails.filter((e) => e.category === "expense").length },
    { id: "meeting", name: "Meetings", count: emails.filter((e) => e.category === "meeting").length },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "expense":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "meeting":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  if (!isConfigured) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <EnvelopeIcon className="h-8 w-8 text-white/50" />
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Connect Your Email</h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Connect your email accounts to manage travel-related communications and automate expense tracking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <EnvelopeIcon className="h-6 w-6 text-white/70 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Smart Categorization</h3>
                <p className="text-white/50 text-xs">Automatically sort travel, expense, and meeting emails</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <StarIcon className="h-6 w-6 text-white/70 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Priority Detection</h3>
                <p className="text-white/50 text-xs">AI identifies important travel confirmations and deadlines</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsConfigured(true)}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Connect Gmail
              </button>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <button className="text-white/50 hover:text-white/70">Connect Outlook</button>
                <span className="text-white/30">•</span>
                <button className="text-white/50 hover:text-white/70">Connect Yahoo</button>
                <span className="text-white/30">•</span>
                <button onClick={() => setIsConfigured(true)} className="text-white/50 hover:text-white/70">
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tighter text-white mb-1">Mail</h1>
            <p className="text-white/70 text-sm">Manage your travel and business communications</p>
          </div>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Compose
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Folders */}
              <div>
                <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Folders</h3>
                <div className="space-y-0.5">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        selectedFolder === folder.id
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <folder.icon className="h-4 w-4 mr-2" />
                        <span className="text-xs">{folder.name}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{folder.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Categories</h3>
                <div className="space-y-0.5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full px-3 py-1.5 rounded-lg flex items-center justify-between text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <span className="text-xs">{category.name}</span>
                      {category.count > 0 && (
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer ${
                    !email.isRead ? "border-white/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium ${!email.isRead ? "text-white" : "text-white/70"}`}>
                        {email.from}
                      </h4>
                      <Badge className={`text-[10px] px-2 py-0.5 ${getCategoryColor(email.category)}`}>
                        {email.category}
                      </Badge>
                      <Badge className={`text-[10px] px-2 py-0.5 ${getPriorityColor(email.priority)}`}>
                        {email.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {email.isStarred && <StarIcon className="h-4 w-4 text-yellow-400" />}
                      <span className="text-[10px] text-white/50">{email.date}</span>
                    </div>
                  </div>

                  <h5 className={`text-sm mb-1 ${!email.isRead ? "text-white font-medium" : "text-white/70"}`}>
                    {email.subject}
                  </h5>

                  <p className="text-xs text-white/50 line-clamp-2">{email.preview}</p>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-white/50 hover:text-white">Reply</button>
                      <button className="text-xs text-white/50 hover:text-white">Forward</button>
                      <button className="text-xs text-white/50 hover:text-white">Archive</button>
                    </div>
                    <button className="text-xs text-white/70 hover:text-white">View Full</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {emails.length === 0 && (
              <div className="text-center py-12">
                <EnvelopeIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-white/70 text-sm mb-2">No emails found</h3>
                <p className="text-white/50 text-xs">Your inbox will appear here once connected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function MailsPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/5 rounded-lg w-48"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-white/5 rounded-lg"></div>
                  ))}
                </div>
                <div className="lg:col-span-3 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <MailsContent />
    </Suspense>
  )
}
