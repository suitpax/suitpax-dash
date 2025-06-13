"use client"

import { useState } from "react"
import { Bell, Check, X, Clock, Plane, CreditCard, Users, Settings } from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "flight",
      title: "Flight Confirmation",
      message: "Your flight to New York has been confirmed for March 15th at 2:30 PM",
      time: "2 minutes ago",
      read: false,
      icon: Plane,
      color: "text-blue-400",
    },
    {
      id: 2,
      type: "expense",
      title: "Expense Approved",
      message: "Your expense report for $1,245.50 has been approved by your manager",
      time: "1 hour ago",
      read: false,
      icon: CreditCard,
      color: "text-green-400",
    },
    {
      id: 3,
      type: "team",
      title: "New Team Member",
      message: "Sarah Johnson has joined your travel team",
      time: "3 hours ago",
      read: true,
      icon: Users,
      color: "text-purple-400",
    },
    {
      id: 4,
      type: "system",
      title: "Policy Update",
      message: "Your company travel policy has been updated. Please review the changes.",
      time: "1 day ago",
      read: true,
      icon: Settings,
      color: "text-orange-400",
    },
    {
      id: 5,
      type: "flight",
      title: "Flight Delay",
      message: "Your flight BA 123 to London has been delayed by 45 minutes",
      time: "2 days ago",
      read: true,
      icon: Plane,
      color: "text-red-400",
    },
  ]

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  const markAsRead = (id: number) => {
    console.log(`Marking notification ${id} as read`)
  }

  const markAllAsRead = () => {
    console.log("Marking all notifications as read")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-md font-medium text-white">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-sm mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "all" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "unread" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("flight")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "flight" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              Flights
            </button>
            <button
              onClick={() => setFilter("expense")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "expense" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilter("team")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "team" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setFilter("system")}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filter === "system" ? "bg-white text-black" : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              System
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/5 rounded-xl border p-4 shadow-sm transition-colors ${
                  notification.read ? "border-white/10" : "border-white/20 bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-white/10 ${notification.color}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.read ? "text-white/90" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${notification.read ? "text-white/70" : "text-white/80"}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-white/50">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-white/50 hover:text-green-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-1 text-white/50 hover:text-red-400 transition-colors" title="Dismiss">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-white/50 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">No notifications</h2>
              <p className="text-white/70">
                {filter === "all" ? "You're all caught up! No new notifications." : `No ${filter} notifications found.`}
              </p>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 shadow-sm mt-6">
          <h2 className="text-lg font-medium text-white mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Email Notifications</h3>
                <p className="text-sm text-white/70">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-white">
                  <div className="absolute top-0.5 left-0.5 bg-black w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-black"></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Push Notifications</h3>
                <p className="text-sm text-white/70">Receive push notifications in browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-white">
                  <div className="absolute top-0.5 left-0.5 bg-black w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-black"></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Flight Updates</h3>
                <p className="text-sm text-white/70">Get notified about flight changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-white">
                  <div className="absolute top-0.5 left-0.5 bg-black w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-black"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
