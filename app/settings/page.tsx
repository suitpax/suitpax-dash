"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Save, Bell, Globe, Lock, CreditCard, Moon, Sun, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SettingsData {
  language: string
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorAuth: boolean
  defaultCurrency: string
  defaultPaymentMethod: string
}

export default function SettingsPage() {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    language: "en",
    theme: "system",
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    defaultCurrency: "USD",
    defaultPaymentMethod: "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setSettingsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    { id: "payment", label: "Payment", icon: CreditCard },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-black p-3 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-white/20 rounded-full animate-ping"></div>
          <div
            className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/10 rounded-full animate-ping delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-medium text-white mb-2 tracking-tight">Settings</h1>
              <p className="text-white/70">Manage your account preferences and configurations</p>
            </div>
          </div>

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
                          className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 group ${
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
                          <h2 className="text-xl font-medium text-white mb-6">General Settings</h2>

                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-white mb-3">Language</label>
                              <select
                                name="language"
                                value={settingsData.language}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                              >
                                {languages.map((lang) => (
                                  <option key={lang.code} value={lang.code} className="bg-black text-white">
                                    {lang.name}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-white/50 mt-2">
                                This will change the language of the interface.
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-4">Theme Preference</label>
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
                                        className={`font-medium mb-1 transition-colors ${
                                          settingsData.theme === option.value ? "text-white" : "text-white/70"
                                        }`}
                                      >
                                        {option.label}
                                      </span>
                                      <span className="text-xs text-white/50 text-center">{option.desc}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "notifications" && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-xl font-medium text-white mb-6">Notification Settings</h2>

                          <div className="space-y-6">
                            {[
                              {
                                key: "emailNotifications",
                                title: "Email Notifications",
                                desc: "Receive email notifications for important updates and bookings.",
                                checked: settingsData.emailNotifications,
                              },
                              {
                                key: "pushNotifications",
                                title: "Push Notifications",
                                desc: "Receive push notifications on your device for real-time updates.",
                                checked: settingsData.pushNotifications,
                              },
                            ].map((notification) => (
                              <div
                                key={notification.key}
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl"
                              >
                                <div className="flex-1">
                                  <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                                  <p className="text-white/60 text-sm">{notification.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-6">
                                  <input
                                    type="checkbox"
                                    name={notification.key}
                                    checked={notification.checked}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                      notification.checked ? "bg-white/30" : "bg-white/10"
                                    }`}
                                  >
                                    <div
                                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-lg ${
                                        notification.checked ? "translate-x-6" : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "security" && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-xl font-medium text-white mb-6">Security Settings</h2>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                  <Shield className="h-6 w-6 text-white/70" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium mb-1">Two-Factor Authentication</h3>
                                  <p className="text-white/60 text-sm">
                                    Add an extra layer of security to your account.
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="twoFactorAuth"
                                  checked={settingsData.twoFactorAuth}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                    settingsData.twoFactorAuth ? "bg-white/30" : "bg-white/10"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-lg ${
                                      settingsData.twoFactorAuth ? "translate-x-6" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                              </label>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl">
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                  <Lock className="h-6 w-6 text-white/70" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium mb-1">Password</h3>
                                  <p className="text-white/60 text-sm">
                                    It's a good idea to use a strong password that you don't use elsewhere.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white font-medium py-2 px-6 rounded-xl border border-white/10 transition-all duration-300 hover:shadow-lg"
                              >
                                Change Password
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "payment" && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-xl font-medium text-white mb-6">Payment Settings</h2>

                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-white mb-3">Default Currency</label>
                              <select
                                name="defaultCurrency"
                                value={settingsData.defaultCurrency}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                              >
                                {currencies.map((currency) => (
                                  <option key={currency.code} value={currency.code} className="bg-black text-white">
                                    {currency.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl text-center">
                              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-8 w-8 text-white/70" />
                              </div>
                              <h3 className="text-white font-medium mb-2">Payment Methods</h3>
                              <p className="text-white/60 text-sm mb-6">You haven't added any payment methods yet.</p>
                              <button
                                type="button"
                                className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white font-medium py-3 px-6 rounded-xl border border-white/10 transition-all duration-300 hover:shadow-lg"
                              >
                                Add Payment Method
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-6 border-t border-white/10">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Save Settings
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
