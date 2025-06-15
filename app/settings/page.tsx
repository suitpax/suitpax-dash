"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Bell,
  Globe,
  Lock,
  CreditCard,
  Moon,
  Sun,
  Shield,
  Users,
  Zap,
  Database,
  Smartphone,
  Mail,
  Key,
  Eye,
  EyeOff,
  Download,
  Trash2,
} from "lucide-react"

interface SettingsData {
  language: string
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  twoFactorAuth: boolean
  defaultCurrency: string
  defaultPaymentMethod: string
  autoBackup: boolean
  dataRetention: string
  sessionTimeout: string
  apiAccess: boolean
  webhookUrl: string
  slackIntegration: boolean
  teamsIntegration: boolean
}

export default function SettingsPage() {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    language: "en",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    twoFactorAuth: false,
    defaultCurrency: "USD",
    defaultPaymentMethod: "",
    autoBackup: true,
    dataRetention: "12",
    sessionTimeout: "30",
    apiAccess: false,
    webhookUrl: "",
    slackIntegration: false,
    teamsIntegration: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [showApiKey, setShowApiKey] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setSettingsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
  ]

  const currencies = [
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" },
    { code: "CNY", name: "Chinese Yuan (¥)" },
  ]

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "data", label: "Data & Privacy", icon: Database },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-light text-white tracking-tight">Settings</h1>
          <p className="text-white/70 text-sm font-light mt-1">Manage your account preferences and configurations</p>
        </header>

        {/* Main Content */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar Navigation */}
              <div className="lg:w-1/4 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 group font-light ${
                          activeTab === tab.id
                            ? "bg-white/10 text-white font-medium shadow-lg"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 mr-3 transition-colors ${
                            activeTab === tab.id ? "text-white" : "text-white/50 group-hover:text-white/70"
                          }`}
                        />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content Area */}
              <div className="lg:w-3/4 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {activeTab === "general" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">General Settings</h2>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-light text-white mb-3">Language</label>
                            <Select
                              value={settingsData.language}
                              onValueChange={(value) => setSettingsData((prev) => ({ ...prev, language: value }))}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-white/50 mt-2 font-light">
                              This will change the language of the interface.
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-light text-white mb-4">Theme Preference</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { value: "light", label: "Light", icon: Sun, desc: "Light theme" },
                                { value: "dark", label: "Dark", icon: Moon, desc: "Dark theme" },
                                { value: "system", label: "System", icon: Globe, desc: "Follow system" },
                              ].map((option) => {
                                const Icon = option.icon
                                return (
                                  <label
                                    key={option.value}
                                    className={`relative flex flex-col items-center p-6 border rounded-2xl cursor-pointer transition-all duration-300 group ${
                                      settingsData.theme === option.value
                                        ? "border-white/30 bg-white/10 shadow-lg"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="theme"
                                      value={option.value}
                                      checked={settingsData.theme === option.value}
                                      onChange={handleInputChange}
                                      className="sr-only"
                                    />
                                    <Icon
                                      className={`h-8 w-8 mb-3 transition-colors ${
                                        settingsData.theme === option.value
                                          ? "text-white"
                                          : "text-white/50 group-hover:text-white/70"
                                      }`}
                                    />
                                    <span
                                      className={`font-light mb-1 transition-colors ${
                                        settingsData.theme === option.value ? "text-white" : "text-white/70"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                    <span className="text-xs text-white/50 text-center font-light">{option.desc}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-light text-white mb-3">Default Currency</label>
                            <Select
                              value={settingsData.defaultCurrency}
                              onValueChange={(value) =>
                                setSettingsData((prev) => ({ ...prev, defaultCurrency: value }))
                              }
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">Notification Settings</h2>

                        <div className="space-y-6">
                          {[
                            {
                              key: "emailNotifications",
                              title: "Email Notifications",
                              desc: "Receive email notifications for important updates and bookings.",
                              icon: Mail,
                              checked: settingsData.emailNotifications,
                            },
                            {
                              key: "pushNotifications",
                              title: "Push Notifications",
                              desc: "Receive push notifications on your device for real-time updates.",
                              icon: Smartphone,
                              checked: settingsData.pushNotifications,
                            },
                            {
                              key: "smsNotifications",
                              title: "SMS Notifications",
                              desc: "Receive SMS notifications for critical travel updates.",
                              icon: Bell,
                              checked: settingsData.smsNotifications,
                            },
                          ].map((notification) => {
                            const Icon = notification.icon
                            return (
                              <div
                                key={notification.key}
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-white/70" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-white font-light mb-1">{notification.title}</h3>
                                    <p className="text-white/60 text-sm font-light">{notification.desc}</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={notification.checked}
                                  onCheckedChange={(checked) => handleSwitchChange(notification.key, checked)}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">Security Settings</h2>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Shield className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Two-Factor Authentication</h3>
                                <p className="text-white/60 text-sm font-light">
                                  Add an extra layer of security to your account.
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={settingsData.twoFactorAuth}
                              onCheckedChange={(checked) => handleSwitchChange("twoFactorAuth", checked)}
                            />
                          </div>

                          <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Lock className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Password</h3>
                                <p className="text-white/60 text-sm font-light">
                                  It's a good idea to use a strong password that you don't use elsewhere.
                                </p>
                              </div>
                            </div>
                            <Button className="bg-white/10 hover:bg-white/15 text-white font-light rounded-xl border border-white/10">
                              Change Password
                            </Button>
                          </div>

                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Key className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">API Access</h3>
                                <p className="text-white/60 text-sm font-light">
                                  Generate API keys for integrating with external systems.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Switch
                                checked={settingsData.apiAccess}
                                onCheckedChange={(checked) => handleSwitchChange("apiAccess", checked)}
                              />
                              {settingsData.apiAccess && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type={showApiKey ? "text" : "password"}
                                    value="sk-1234567890abcdef"
                                    readOnly
                                    className="bg-white/5 border-white/10 text-white w-48"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="bg-white/10 hover:bg-white/15 text-white"
                                  >
                                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Session Management</h3>
                                <p className="text-white/60 text-sm font-light">Control how long you stay logged in.</p>
                              </div>
                            </div>
                            <Select
                              value={settingsData.sessionTimeout}
                              onValueChange={(value) => setSettingsData((prev) => ({ ...prev, sessionTimeout: value }))}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="240">4 hours</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "integrations" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">Integrations</h2>

                        <div className="space-y-6">
                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Zap className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Webhook URL</h3>
                                <p className="text-white/60 text-sm font-light">
                                  Receive real-time notifications about booking changes.
                                </p>
                              </div>
                            </div>
                            <Input
                              name="webhookUrl"
                              value={settingsData.webhookUrl}
                              onChange={handleInputChange}
                              placeholder="https://your-domain.com/webhook"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <img
                                      src="/placeholder.svg?height=24&width=24&text=S"
                                      alt="Slack"
                                      className="h-6 w-6"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-light mb-1">Slack</h3>
                                    <p className="text-white/60 text-sm font-light">Get notifications in Slack</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={settingsData.slackIntegration}
                                  onCheckedChange={(checked) => handleSwitchChange("slackIntegration", checked)}
                                />
                              </div>
                              {settingsData.slackIntegration && (
                                <Button className="w-full bg-white/10 hover:bg-white/15 text-white font-light rounded-xl border border-white/10">
                                  Configure Slack
                                </Button>
                              )}
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <img
                                      src="/placeholder.svg?height=24&width=24&text=T"
                                      alt="Teams"
                                      className="h-6 w-6"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-light mb-1">Microsoft Teams</h3>
                                    <p className="text-white/60 text-sm font-light">Get notifications in Teams</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={settingsData.teamsIntegration}
                                  onCheckedChange={(checked) => handleSwitchChange("teamsIntegration", checked)}
                                />
                              </div>
                              {settingsData.teamsIntegration && (
                                <Button className="w-full bg-white/10 hover:bg-white/15 text-white font-light rounded-xl border border-white/10">
                                  Configure Teams
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "data" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">Data & Privacy</h2>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Database className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Automatic Backup</h3>
                                <p className="text-white/60 text-sm font-light">
                                  Automatically backup your data daily.
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={settingsData.autoBackup}
                              onCheckedChange={(checked) => handleSwitchChange("autoBackup", checked)}
                            />
                          </div>

                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Trash2 className="h-6 w-6 text-white/70" />
                              </div>
                              <div>
                                <h3 className="text-white font-light mb-1">Data Retention</h3>
                                <p className="text-white/60 text-sm font-light">How long to keep your travel data.</p>
                              </div>
                            </div>
                            <Select
                              value={settingsData.dataRetention}
                              onValueChange={(value) => setSettingsData((prev) => ({ ...prev, dataRetention: value }))}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="6">6 months</SelectItem>
                                <SelectItem value="12">1 year</SelectItem>
                                <SelectItem value="24">2 years</SelectItem>
                                <SelectItem value="60">5 years</SelectItem>
                                <SelectItem value="forever">Forever</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Download className="h-8 w-8 text-white/70" />
                              </div>
                              <h3 className="text-white font-light mb-2">Export Data</h3>
                              <p className="text-white/60 text-sm font-light mb-4">
                                Download all your data in JSON format.
                              </p>
                              <Button className="bg-white/10 hover:bg-white/15 text-white font-light rounded-xl border border-white/10">
                                <Download className="h-4 w-4 mr-2" />
                                Export Data
                              </Button>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-8 w-8 text-red-400" />
                              </div>
                              <h3 className="text-white font-light mb-2">Delete Account</h3>
                              <p className="text-white/60 text-sm font-light mb-4">
                                Permanently delete your account and all data.
                              </p>
                              <Button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-light rounded-xl border border-red-500/30">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "billing" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-light text-white mb-6 tracking-tight">Billing & Payments</h2>

                        <div className="space-y-6">
                          <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <CreditCard className="h-8 w-8 text-white/70" />
                            </div>
                            <h3 className="text-white font-light mb-2">Payment Methods</h3>
                            <p className="text-white/60 text-sm font-light mb-6">
                              You haven't added any payment methods yet.
                            </p>
                            <Button className="bg-white/10 hover:bg-white/15 text-white font-light rounded-xl border border-white/10">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Add Payment Method
                            </Button>
                          </div>

                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="text-white font-light mb-4">Billing History</h3>
                            <div className="space-y-3">
                              {[
                                { date: "Dec 1, 2024", amount: "$79.00", status: "Paid", plan: "Professional" },
                                { date: "Nov 1, 2024", amount: "$79.00", status: "Paid", plan: "Professional" },
                                { date: "Oct 1, 2024", amount: "$79.00", status: "Paid", plan: "Professional" },
                              ].map((invoice, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                                >
                                  <div>
                                    <p className="text-white font-light">{invoice.plan} Plan</p>
                                    <p className="text-white/60 text-sm font-light">{invoice.date}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-white font-light">{invoice.amount}</p>
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                      {invoice.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-6 border-t border-white/10">
                    <Button
                      type="submit"
                      className="bg-white text-black hover:bg-white/90 font-light py-3 px-8 rounded-xl transition-all duration-300"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
