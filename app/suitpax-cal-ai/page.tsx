"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Mail,
  Clock,
  Settings,
  CheckCircle,
  Plus,
  ExternalLink,
  Zap,
  Brain,
  Video,
  MapPin,
} from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  attendees: string[]
  location?: string
  meetingLink?: string
  status: "confirmed" | "tentative" | "cancelled"
}

interface EmailSummary {
  id: string
  from: string
  subject: string
  snippet: string
  category: "travel" | "meeting" | "expense" | "general"
  unread: boolean
  date: Date
}

export default function SuitpaxCalAI() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [availableSlots, setAvailableSlots] = useState<{ start: Date; end: Date }[]>([])

  // Check connection status
  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch("/api/integrations/nylas/status")
      const data = await response.json()
      setIsConnected(data.connected)

      if (data.connected) {
        loadCalendarData()
        loadEmailData()
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const connectNylas = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/integrations/nylas/connect", {
        method: "POST",
      })
      const data = await response.json()

      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error("Error connecting to Nylas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCalendarData = async () => {
    try {
      const response = await fetch("/api/integrations/nylas/calendar")
      const data = await response.json()

      if (data.success) {
        setEvents(
          data.data.map((event: any) => ({
            ...event,
            start: new Date(event.when.startTime * 1000),
            end: new Date(event.when.endTime * 1000),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading calendar:", error)
    }
  }

  const loadEmailData = async () => {
    try {
      const response = await fetch("/api/integrations/nylas/emails")
      const data = await response.json()

      if (data.success) {
        setEmails(
          data.data.map((email: any) => ({
            ...email,
            date: new Date(email.date * 1000),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading emails:", error)
    }
  }

  const findAvailableSlots = async () => {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) // Next 7 days

      const response = await fetch("/api/integrations/nylas/calendar/available-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: 60, // 1 hour meetings
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          workingHours: { start: 9, end: 17 },
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAvailableSlots(
          data.data.map((slot: any) => ({
            start: new Date(slot.startTime),
            end: new Date(slot.endTime),
          })),
        )
      }
    } catch (error) {
      console.error("Error finding slots:", error)
    }
  }

  const scheduleAIAssistant = async (slot: { start: Date; end: Date }) => {
    try {
      const response = await fetch("/api/integrations/nylas/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Suitpax Cal AI - Travel Planning Session",
          description: "AI-powered travel planning and booking assistance",
          startTime: slot.start.toISOString(),
          endTime: slot.end.toISOString(),
          conferencing: {
            provider: "Google Meet",
            autocreate: true,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        loadCalendarData() // Refresh calendar
        alert("¡Meeting scheduled successfully with Suitpax Cal AI!")
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground p-3">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Suitpax Cal AI</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              AI-powered calendar and email management for business travel. Connect your Gmail and Calendar to get
              started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Mail className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Email</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically categorize travel emails and extract booking details
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Calendar className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Intelligent Calendar</h3>
                <p className="text-sm text-muted-foreground">Find optimal meeting times and manage travel schedules</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Book meetings with AI for travel planning and assistance
                </p>
              </div>
            </div>

            <Button
              onClick={connectNylas}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Gmail & Calendar
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Secure OAuth connection via Nylas. Your data is encrypted and protected.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
              <Brain className="h-6 w-6 mr-2 text-blue-500" />
              Suitpax Cal AI
            </h1>
            <p className="text-muted-foreground">AI-powered calendar and email management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="emails">Smart Emails</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Events */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No upcoming events</p>
                      </div>
                    ) : (
                      events.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.start.toLocaleString()}
                              {event.location && (
                                <>
                                  <MapPin className="h-3 w-3 ml-3 mr-1" />
                                  {event.location}
                                </>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={
                              event.status === "confirmed"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={findAvailableSlots} className="w-full justify-start" variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Find Available Slots
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Create Video Call
                    </Button>
                  </CardContent>
                </Card>

                {/* Available Slots */}
                {availableSlots.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-sm">Available This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {availableSlots.slice(0, 3).map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                          <span>
                            {slot.start.toLocaleDateString()} at{" "}
                            {slot.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => scheduleAIAssistant(slot)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Book AI
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Smart Email Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { category: "travel", count: emails.filter((e) => e.category === "travel").length, color: "blue" },
                    {
                      category: "meeting",
                      count: emails.filter((e) => e.category === "meeting").length,
                      color: "green",
                    },
                    {
                      category: "expense",
                      count: emails.filter((e) => e.category === "expense").length,
                      color: "yellow",
                    },
                    {
                      category: "general",
                      count: emails.filter((e) => e.category === "general").length,
                      color: "gray",
                    },
                  ].map((cat) => (
                    <div key={cat.category} className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold text-${cat.color}-500`}>{cat.count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{cat.category}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {emails.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No emails to display</p>
                    </div>
                  ) : (
                    emails.slice(0, 10).map((email) => (
                      <div
                        key={email.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          email.unread ? "bg-blue-500/5 border-blue-500/20" : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{email.from}</span>
                            <Badge
                              className={`text-xs ${
                                email.category === "travel"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : email.category === "meeting"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : email.category === "expense"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                              }`}
                            >
                              {email.category}
                            </Badge>
                            {email.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                          <h3 className="font-medium mb-1">{email.subject}</h3>
                          <p className="text-sm text-muted-foreground">{email.snippet}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{email.date.toLocaleDateString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    Schedule AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Book a meeting with Suitpax AI for personalized travel planning, expense management, and booking
                    assistance.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <Label>Meeting Duration</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded-lg bg-background">
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                      </select>
                    </div>

                    <div>
                      <Label>Meeting Type</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded-lg bg-background">
                        <option value="travel-planning">Travel Planning</option>
                        <option value="expense-review">Expense Review</option>
                        <option value="policy-consultation">Policy Consultation</option>
                        <option value="general-assistance">General Assistance</option>
                      </select>
                    </div>

                    <Button
                      onClick={findAvailableSlots}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Find Available Times
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { icon: "✈️", title: "Flight Booking", desc: "Search and book flights with real-time pricing" },
                      { icon: "🏨", title: "Hotel Reservations", desc: "Find and book accommodations worldwide" },
                      { icon: "💰", title: "Expense Analysis", desc: "Review and optimize travel expenses" },
                      { icon: "📋", title: "Policy Compliance", desc: "Ensure bookings meet company policies" },
                      { icon: "📊", title: "Travel Analytics", desc: "Insights and recommendations for future trips" },
                      {
                        icon: "🌱",
                        title: "Sustainability",
                        desc: "Carbon footprint tracking and eco-friendly options",
                      },
                    ].map((capability, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <span className="text-lg">{capability.icon}</span>
                        <div>
                          <h4 className="font-medium">{capability.title}</h4>
                          <p className="text-sm text-muted-foreground">{capability.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Email Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{emails.length}</div>
                  <p className="text-sm text-muted-foreground">Emails categorized</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Calendar Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                  <p className="text-sm text-muted-foreground">Events managed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">AI Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Sessions completed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
