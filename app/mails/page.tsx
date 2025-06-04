"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  PaperClipIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"

interface Email {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  content: string
  date: Date
  read: boolean
  starred: boolean
  hasAttachment: boolean
  category: "travel" | "expense" | "policy" | "general"
}

export default function MailsPage() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      from: "Travel Booking System",
      fromEmail: "noreply@suitpax.com",
      subject: "Flight Confirmation - London Trip",
      preview: "Your flight to London has been confirmed for June 15, 2025...",
      content: "Dear traveler, your flight booking has been confirmed...",
      date: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      starred: true,
      hasAttachment: true,
      category: "travel",
    },
    {
      id: "2",
      from: "Finance Team",
      fromEmail: "finance@company.com",
      subject: "Expense Report Approval Required",
      preview: "Your March expense report is pending approval...",
      content: "Please review and approve the expense report...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      starred: false,
      hasAttachment: false,
      category: "expense",
    },
    {
      id: "3",
      from: "HR Department",
      fromEmail: "hr@company.com",
      subject: "Updated Travel Policy Guidelines",
      preview: "New travel policy guidelines have been published...",
      content: "We have updated our travel policy guidelines...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      starred: false,
      hasAttachment: true,
      category: "policy",
    },
  ])

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleStar = (id: string) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, starred: !email.starred } : email)))
  }

  const markAsRead = (id: string) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, read: true } : email)))
  }

  const deleteEmail = (id: string) => {
    setEmails(emails.filter((email) => email.id !== id))
    if (selectedEmail?.id === id) {
      setSelectedEmail(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "expense":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "policy":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default:
        return "bg-white/20 text-white/70 border-white/30"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <EnvelopeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mail</h1>
                <p className="text-white/70">Manage your travel-related communications</p>
              </div>
            </div>
            <Button className="bg-white/10 text-white hover:bg-white/20">
              <PencilIcon className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="mb-4 bg-white/5 border border-white/10 w-full">
                <TabsTrigger
                  value="inbox"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1"
                >
                  Inbox ({filteredEmails.filter((e) => !e.read).length})
                </TabsTrigger>
                <TabsTrigger
                  value="starred"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1"
                >
                  Starred ({filteredEmails.filter((e) => e.starred).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inbox">
                <div className="space-y-2">
                  {filteredEmails.map((email) => (
                    <Card
                      key={email.id}
                      className={`bg-black/30 border-white/10 cursor-pointer transition-all hover:border-white/20 ${
                        selectedEmail?.id === email.id ? "ring-1 ring-blue-500/50" : ""
                      } ${!email.read ? "border-blue-500/30" : ""}`}
                      onClick={() => {
                        setSelectedEmail(email)
                        markAsRead(email.id)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${!email.read ? "text-white" : "text-white/70"}`}>
                              {email.from}
                            </span>
                            {!email.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(email.id)
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              {email.starred ? (
                                <StarSolidIcon className="h-4 w-4 text-amber-400" />
                              ) : (
                                <StarIcon className="h-4 w-4 text-white/50" />
                              )}
                            </button>
                            {email.hasAttachment && <PaperClipIcon className="h-4 w-4 text-white/50" />}
                          </div>
                        </div>
                        <h3 className={`text-sm mb-1 ${!email.read ? "font-medium text-white" : "text-white/70"}`}>
                          {email.subject}
                        </h3>
                        <p className="text-xs text-white/50 mb-2 line-clamp-2">{email.preview}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getCategoryColor(email.category)}>{email.category}</Badge>
                          <span className="text-xs text-white/50">{formatTime(email.date)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="starred">
                <div className="space-y-2">
                  {filteredEmails
                    .filter((email) => email.starred)
                    .map((email) => (
                      <Card
                        key={email.id}
                        className={`bg-black/30 border-white/10 cursor-pointer transition-all hover:border-white/20 ${
                          selectedEmail?.id === email.id ? "ring-1 ring-blue-500/50" : ""
                        }`}
                        onClick={() => {
                          setSelectedEmail(email)
                          markAsRead(email.id)
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{email.from}</span>
                              <StarSolidIcon className="h-4 w-4 text-amber-400" />
                            </div>
                            {email.hasAttachment && <PaperClipIcon className="h-4 w-4 text-white/50" />}
                          </div>
                          <h3 className="text-sm font-medium text-white mb-1">{email.subject}</h3>
                          <p className="text-xs text-white/50 mb-2 line-clamp-2">{email.preview}</p>
                          <div className="flex items-center justify-between">
                            <Badge className={getCategoryColor(email.category)}>{email.category}</Badge>
                            <span className="text-xs text-white/50">{formatTime(email.date)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {filteredEmails.filter((email) => email.starred).length === 0 && (
                    <Card className="bg-black/30 border-white/10">
                      <CardContent className="p-8 text-center">
                        <StarIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No starred emails</h3>
                        <p className="text-white/70 text-sm">Star important emails to find them easily later.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Email Content */}
          <div className="lg:col-span-2">
            {selectedEmail ? (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">{selectedEmail.subject}</h2>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>
                          From: {selectedEmail.from} &lt;{selectedEmail.fromEmail}&gt;
                        </span>
                        <span>{formatTime(selectedEmail.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStar(selectedEmail.id)} className="p-2 hover:bg-white/10 rounded">
                        {selectedEmail.starred ? (
                          <StarSolidIcon className="h-5 w-5 text-amber-400" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-white/50" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteEmail(selectedEmail.id)}
                        className="p-2 hover:bg-white/10 rounded text-red-400"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Badge className={getCategoryColor(selectedEmail.category)}>{selectedEmail.category}</Badge>
                    {selectedEmail.hasAttachment && (
                      <Badge className="ml-2 bg-white/10 text-white/70">
                        <PaperClipIcon className="h-3 w-3 mr-1" />
                        Attachment
                      </Badge>
                    )}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/80 leading-relaxed">{selectedEmail.content}</p>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button className="bg-white/10 text-white hover:bg-white/20">Reply</Button>
                    <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/5">
                      Forward
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-12 text-center">
                  <EnvelopeIcon className="h-16 w-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Select an email</h3>
                  <p className="text-white/70">Choose an email from the list to view its content.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
