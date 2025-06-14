"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import AIAgentInterface from "@/components/ui/ai-agent-interface"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Settings, History, Zap, Mail, FileText } from "lucide-react"
import { GlowBorder } from "@/components/ui/glow-border"

export default function AIAgentPage() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <GlowBorder className="inline-block px-4 py-2">
            <h1 className="text-2xl font-medium tracking-tighter text-white">Suitpax AI Agent</h1>
          </GlowBorder>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm h-[600px] flex flex-col">
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                  <TabsTrigger value="chat" onClick={() => setActiveTab("chat")} className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    onClick={() => setActiveTab("history")}
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    onClick={() => setActiveTab("settings")}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col">
                  <AIAgentInterface />
                </TabsContent>

                <TabsContent value="history">
                  <div className="p-4 text-center text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <h3 className="text-lg font-medium mb-1">Conversation History</h3>
                    <p className="text-sm">View and manage your past conversations with Suitpax AI.</p>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="p-4 text-center text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <h3 className="text-lg font-medium mb-1">Agent Settings</h3>
                    <p className="text-sm">Configure your AI agent preferences and capabilities.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm p-4">
              <h2 className="text-lg font-medium tracking-tighter text-white mb-4">Agent Capabilities</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Zap className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Travel Planning</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Search and book flights, hotels, and transportation based on your preferences and company policy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Email Integration</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Send travel confirmations, itineraries, and notifications directly to your email or team members.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Policy Compliance</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Ensure all travel bookings comply with your company's travel policy and budget constraints.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm p-4">
              <h2 className="text-lg font-medium tracking-tighter text-white mb-4">Travel Preferences</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-medium text-white/70">Preferred Airlines</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      United Airlines
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Delta
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      American Airlines
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-white/70">Preferred Hotels</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Marriott
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Hilton
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Hyatt
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-white/70">Travel Preferences</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Window Seat
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Direct Flights
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      Morning Departures
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
