"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Save,
} from "lucide-react"

interface SettingsData {
  // Profile
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  bio: string
  avatar: string

  // Preferences
  language: string
  timezone: string
  currency: string
  theme: "light" | "dark" | "system"

  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  weeklyReports: boolean

  // Security
  twoFactorAuth: boolean
  sessionTimeout: string
  loginAlerts: boolean

  // Privacy
  profileVisibility: "public" | "private" | "team"
  dataSharing: boolean
  analytics: boolean
}

export default function SettingsPage() {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    firstName: "Alberto",
    lastName: "Zurano",
    email: "alberto@suitpax.com",
    phone: "+34 600 123 456",
    company: "Suitpax",
    role: "Travel Manager",
    bio: "Passionate about optimizing business travel experiences through technology.",
    avatar: "/images/ai-agent-avatar.jpeg",
    language: "en",
    timezone: "Europe/Madrid",
    currency: "EUR",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    twoFactorAuth: true,
    sessionTimeout: "30",
    loginAlerts: true,
    profileVisibility: "team",
    dataSharing: false,
    analytics: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleInputChange = (field: keyof SettingsData, value: any) => {
    setSettingsData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-white/70">Manage your account preferences and security settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-black/30 border-white/10 sticky top-8">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "preferences", label: "Preferences", icon: Palette },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "billing", label: "Billing", icon: CreditCard },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === item.id
                          ? "bg-white/10 text-white font-medium"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/30 border-white/10">
              <CardContent className="p-8">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>

                      {/* Avatar Section */}
                      <div className="flex items-center gap-6 mb-8">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={settingsData.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-white/10 text-white text-xl">
                            {settingsData.firstName[0]}
                            {settingsData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload new
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white/70 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                          <p className="text-xs text-white/50">JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName" className="text-white">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={settingsData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-white">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={settingsData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={settingsData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            value={settingsData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company" className="text-white">
                            Company
                          </Label>
                          <Input
                            id="company"
                            value={settingsData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role" className="text-white">
                            Role
                          </Label>
                          <Input
                            id="role"
                            value={settingsData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="bio" className="text-white">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={settingsData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-2"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-6">Preferences</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-white">Language</Label>
                          <Select
                            value={settingsData.language}
                            onValueChange={(value) => handleInputChange("language", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white">Timezone</Label>
                          <Select
                            value={settingsData.timezone}
                            onValueChange={(value) => handleInputChange("timezone", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                              <SelectItem value="Europe/London">Europe/London</SelectItem>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white">Currency</Label>
                          <Select
                            value={settingsData.currency}
                            onValueChange={(value) => handleInputChange("currency", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white">Theme</Label>
                          <Select
                            value={settingsData.theme}
                            onValueChange={(value) => handleInputChange("theme", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-6">Notification Settings</h2>

                      <div className="space-y-6">
                        {[
                          {
                            key: "emailNotifications",
                            title: "Email Notifications",
                            description: "Receive email notifications for important updates and activities",
                            icon: Mail,
                          },
                          {
                            key: "pushNotifications",
                            title: "Push Notifications",
                            description: "Get push notifications on your devices",
                            icon: Smartphone,
                          },
                          {
                            key: "marketingEmails",
                            title: "Marketing Emails",
                            description: "Receive emails about new features and promotions",
                            icon: Bell,
                          },
                          {
                            key: "weeklyReports",
                            title: "Weekly Reports",
                            description: "Get weekly summaries of your travel activity",
                            icon: Mail,
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 text-white/70" />
                              <div>
                                <h3 className="text-white font-medium">{item.title}</h3>
                                <p className="text-white/70 text-sm">{item.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={settingsData[item.key as keyof SettingsData] as boolean}
                              onCheckedChange={(checked) => handleInputChange(item.key as keyof SettingsData, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-6">Security Settings</h2>

                      <div className="space-y-6">
                        {/* Two-Factor Authentication */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-white/70" />
                              <div>
                                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                                <p className="text-white/70 text-sm">Add an extra layer of security to your account</p>
                              </div>
                            </div>
                            <Switch
                              checked={settingsData.twoFactorAuth}
                              onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                            />
                          </div>
                          {settingsData.twoFactorAuth && (
                            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <Shield className="h-4 w-4" />
                                Two-factor authentication is enabled
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Password Change */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <h3 className="text-white font-medium mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-white">Current Password</Label>
                              <div className="relative mt-2">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="bg-white/5 border-white/10 text-white pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-white">New Password</Label>
                              <Input type="password" className="bg-white/5 border-white/10 text-white mt-2" />
                            </div>
                            <div>
                              <Label className="text-white">Confirm New Password</Label>
                              <Input type="password" className="bg-white/5 border-white/10 text-white mt-2" />
                            </div>
                            <Button className="bg-white/10 text-white hover:bg-white/20">Update Password</Button>
                          </div>
                        </div>

                        {/* Session Management */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <h3 className="text-white font-medium mb-4">Session Management</h3>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-white">Session Timeout</Label>
                              <Select
                                value={settingsData.sessionTimeout}
                                onValueChange={(value) => handleInputChange("sessionTimeout", value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="60">1 hour</SelectItem>
                                  <SelectItem value="240">4 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-medium">Login Alerts</h4>
                                <p className="text-white/70 text-sm">Get notified of new login attempts</p>
                              </div>
                              <Switch
                                checked={settingsData.loginAlerts}
                                onCheckedChange={(checked) => handleInputChange("loginAlerts", checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === "billing" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-6">Billing & Subscription</h2>

                      {/* Current Plan */}
                      <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-white font-medium text-lg">Professional Plan</h3>
                            <p className="text-white/70">€89/month • Billed annually</p>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                        </div>
                        <div className="flex gap-4">
                          <Button className="bg-white/10 text-white hover:bg-white/20">Change Plan</Button>
                          <Button variant="outline" className="border-white/20 text-white/70 hover:text-white">
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-6">
                        <h3 className="text-white font-medium text-lg mb-4">Payment Method</h3>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <CreditCard className="h-8 w-8 text-white/70" />
                          <div className="flex-1">
                            <p className="text-white font-medium">•••• •••• •••• 4242</p>
                            <p className="text-white/70 text-sm">Expires 12/25</p>
                          </div>
                          <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                            Update
                          </Button>
                        </div>
                      </div>

                      {/* Billing History */}
                      <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-white font-medium text-lg mb-4">Billing History</h3>
                        <div className="space-y-3">
                          {[
                            { date: "Dec 1, 2024", amount: "€89.00", status: "Paid" },
                            { date: "Nov 1, 2024", amount: "€89.00", status: "Paid" },
                            { date: "Oct 1, 2024", amount: "€89.00", status: "Paid" },
                          ].map((invoice, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{invoice.date}</p>
                                <p className="text-white/70 text-sm">Professional Plan</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">{invoice.amount}</p>
                                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">{invoice.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-white/10">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-white/90 px-8"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
