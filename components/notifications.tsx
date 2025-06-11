"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info, AlertTriangle, CreditCard, TrendingUp, Gift, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const notifications = [
  {
    id: 1,
    title: "New Feature",
    message: "Check out our new budget tracking tool!",
    date: "2023-07-15",
    icon: Info,
    color: "text-blue-500",
    read: false,
  },
  {
    id: 2,
    title: "Account Alert",
    message: "Unusual activity detected on your account.",
    date: "2023-07-14",
    icon: AlertTriangle,
    color: "text-yellow-500",
    read: false,
  },
  {
    id: 3,
    title: "Payment Due",
    message: "Your credit card payment is due in 3 days.",
    date: "2023-07-13",
    icon: CreditCard,
    color: "text-red-500",
    read: false,
  },
  {
    id: 4,
    title: "Investment Update",
    message: "Your investment portfolio has grown by 5% this month.",
    date: "2023-07-12",
    icon: TrendingUp,
    color: "text-green-500",
    read: true,
  },
  {
    id: 5,
    title: "New Offer",
    message: "You're eligible for a new savings account with higher interest!",
    date: "2023-07-11",
    icon: Gift,
    color: "text-purple-500",
    read: true,
  },
]

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [userNotifications, setUserNotifications] = useState(notifications)
  const [unreadCount, setUnreadCount] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileToast, setMobileToast] = useState<{ show: boolean; notification: (typeof notifications)[0] | null }>({
    show: false,
    notification: null,
  })

  // Calculate unread notifications
  useEffect(() => {
    const count = userNotifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [userNotifications])

  // Simulate receiving a new notification
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of receiving a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification = {
          id: Date.now(),
          title: "New Travel Deal",
          message: "Special discount on flights to popular business destinations!",
          date: new Date().toISOString().split("T")[0],
          icon: Gift,
          color: "text-blue-500",
          read: false,
        }

        setUserNotifications((prev) => [newNotification, ...prev])

        // Show mobile toast notification
        if (isMobile) {
          setMobileToast({
            show: true,
            notification: newNotification,
          })

          // Hide toast after 5 seconds
          setTimeout(() => {
            setMobileToast({
              show: false,
              notification: null,
            })
          }, 5000)
        } else {
          // Show desktop toast
          toast(newNotification.title, {
            description: newNotification.message,
            action: {
              label: "View",
              onClick: () => setIsOpen(true),
            },
          })
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isMobile])

  const markAsRead = (id: number) => {
    setUserNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setUserNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Desktop Notification Panel */}
      {isOpen && !isMobile && (
        <Card className="absolute right-0 mt-2 w-96 z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 rounded-xl text-xs" onClick={markAllAsRead}>
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="h-7 w-7 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {userNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                userNotifications.map((notification) => (
                  <Card key={notification.id} className="mb-4 last:mb-0 border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`${notification.color} p-2 rounded-full bg-opacity-10`}>
                          <notification.icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-[10px]">
                                  New
                                </Badge>
                              )}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-xl"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.read ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Mobile Notification Panel */}
      {isOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 rounded-xl text-xs" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="max-h-[calc(80vh-60px)]">
              <div className="p-4 space-y-3">
                {userNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  userNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${!notification.read ? "bg-gray-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${notification.color} p-2 rounded-full bg-opacity-10 flex-shrink-0`}>
                          <notification.icon className={`h-4 w-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-[10px]">
                                  New
                                </Badge>
                              )}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-xl flex-shrink-0 ml-1"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Toast Notification */}
      <AnimatePresence>
        {mobileToast.show && mobileToast.notification && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <Card className="border shadow-md">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <div className={`${mobileToast.notification.color} p-2 rounded-full bg-opacity-10`}>
                    <mobileToast.notification.icon className={`h-4 w-4 ${mobileToast.notification.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{mobileToast.notification.title}</p>
                    <p className="text-xs text-gray-500">{mobileToast.notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-xl"
                    onClick={() => setMobileToast({ show: false, notification: null })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
