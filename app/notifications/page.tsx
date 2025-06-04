"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Flight Booking Confirmed",
      message: "Your flight to London has been confirmed for June 15, 2025",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      actionUrl: "/flights",
    },
    {
      id: "2",
      title: "Expense Report Pending",
      message: "Your expense report for March needs approval",
      type: "warning",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      actionUrl: "/expenses",
    },
    {
      id: "3",
      title: "Travel Policy Updated",
      message: "New travel policy guidelines have been published",
      type: "info",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      actionUrl: "/travel-policy",
    },
    {
      id: "4",
      title: "Payment Failed",
      message: "Your payment for hotel booking could not be processed",
      type: "error",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      actionUrl: "/hotels",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckIcon className="h-5 w-5 text-emerald-400" />
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
      case "error":
        return <XMarkIcon className="h-5 w-5 text-red-400" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <BellIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-white/70">Stay updated with your travel activities</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} className="bg-white/10 text-white hover:bg-white/20">
                Mark all as read
              </Button>
            )}
          </div>

          {unreadCount > 0 && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">
                  You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Read ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`bg-black/30 border-white/10 transition-all hover:border-white/20 ${
                    !notification.read ? "ring-1 ring-blue-500/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                            <p className="text-white/70 text-sm mb-3">{notification.message}</p>
                            <div className="flex items-center gap-3">
                              <Badge className={getBadgeColor(notification.type)}>{notification.type}</Badge>
                              <div className="flex items-center gap-1 text-white/50 text-xs">
                                <ClockIcon className="h-3 w-3" />
                                {formatTime(notification.createdAt)}
                              </div>
                              {!notification.read && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">New</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="bg-white/10 text-white hover:bg-white/20"
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotification(notification.id)}
                              className="border-white/20 text-white/70 hover:bg-white/5"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="space-y-4">
              {notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <Card key={notification.id} className="bg-black/30 border-white/10 ring-1 ring-blue-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                              <p className="text-white/70 text-sm mb-3">{notification.message}</p>
                              <div className="flex items-center gap-3">
                                <Badge className={getBadgeColor(notification.type)}>{notification.type}</Badge>
                                <div className="flex items-center gap-1 text-white/50 text-xs">
                                  <ClockIcon className="h-3 w-3" />
                                  {formatTime(notification.createdAt)}
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">New</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="bg-white/10 text-white hover:bg-white/20"
                              >
                                Mark as read
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteNotification(notification.id)}
                                className="border-white/20 text-white/70 hover:bg-white/5"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {notifications.filter((n) => !n.read).length === 0 && (
                <Card className="bg-black/30 border-white/10">
                  <CardContent className="p-12 text-center">
                    <CheckIcon className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">All caught up!</h3>
                    <p className="text-white/70">You have no unread notifications.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="read">
            <div className="space-y-4">
              {notifications
                .filter((n) => n.read)
                .map((notification) => (
                  <Card key={notification.id} className="bg-black/30 border-white/10 opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                              <p className="text-white/70 text-sm mb-3">{notification.message}</p>
                              <div className="flex items-center gap-3">
                                <Badge className={getBadgeColor(notification.type)}>{notification.type}</Badge>
                                <div className="flex items-center gap-1 text-white/50 text-xs">
                                  <ClockIcon className="h-3 w-3" />
                                  {formatTime(notification.createdAt)}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotification(notification.id)}
                              className="border-white/20 text-white/70 hover:bg-white/5"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {notifications.filter((n) => n.read).length === 0 && (
                <Card className="bg-black/30 border-white/10">
                  <CardContent className="p-12 text-center">
                    <BellIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No read notifications</h3>
                    <p className="text-white/70">Read notifications will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
