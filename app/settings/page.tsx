"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Save, Bell, Globe, Lock, CreditCard, Moon, Sun } from "lucide-react"

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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tighter text-black mb-6">Settings</h1>

        <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "general" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Globe className="h-4 w-4 mr-3" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "notifications"
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "security" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="h-4 w-4 mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "payment" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Payment
                </button>
              </nav>
            </div>

            <div className="md:w-3/4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "general" && (
                  <>
                    <h2 className="text-lg font-medium text-black mb-4">General Settings</h2>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={settingsData.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">This will change the language of the interface.</p>
                    </div>

                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                        Theme
                      </label>
                      <div className="flex gap-4">
                        <label
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                            settingsData.theme === "light" ? "border-black bg-gray-50" : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={settingsData.theme === "light"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <Sun className="h-5 w-5 text-gray-700" />
                          <span className="text-sm font-medium">Light</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                            settingsData.theme === "dark" ? "border-black bg-gray-50" : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={settingsData.theme === "dark"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <Moon className="h-5 w-5 text-gray-700" />
                          <span className="text-sm font-medium">Dark</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                            settingsData.theme === "system" ? "border-black bg-gray-50" : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value="system"
                            checked={settingsData.theme === "system"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-gray-700"
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          <span className="text-sm font-medium">System</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "notifications" && (
                  <>
                    <h2 className="text-lg font-medium text-black mb-4">Notification Settings</h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                          <p className="text-xs text-gray-500">Receive email notifications for important updates.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={settingsData.emailNotifications}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors ${
                              settingsData.emailNotifications ? "bg-black" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                                settingsData.emailNotifications ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Push Notifications</h3>
                          <p className="text-xs text-gray-500">Receive push notifications on your device.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={settingsData.pushNotifications}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors ${
                              settingsData.pushNotifications ? "bg-black" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                                settingsData.pushNotifications ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "security" && (
                  <>
                    <h2 className="text-lg font-medium text-black mb-4">Security Settings</h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
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
                            className={`w-11 h-6 rounded-full transition-colors ${
                              settingsData.twoFactorAuth ? "bg-black" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                                settingsData.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </label>
                      </div>

                      <div className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Password</h3>
                        <p className="text-xs text-gray-500 mb-3">
                          It's a good idea to use a strong password that you don't use elsewhere.
                        </p>
                        <button type="button" className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800">
                          <span className="text-xs">Change Password</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "payment" && (
                  <>
                    <h2 className="text-lg font-medium text-black mb-4">Payment Settings</h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                          Default Currency
                        </label>
                        <select
                          id="defaultCurrency"
                          name="defaultCurrency"
                          value={settingsData.defaultCurrency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Methods</h3>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                          <p className="text-sm text-gray-600 mb-3">You haven't added any payment methods yet.</p>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
                          >
                            <span className="text-xs">Add Payment Method</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                    disabled={isSaving}
                  >
                    <span className="text-xs">{isSaving ? "Saving..." : "Save Settings"}</span>
                    {!isSaving && <Save size={14} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
