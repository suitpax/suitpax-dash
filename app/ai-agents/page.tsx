"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "@/components/ui/layout"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, ArrowRight, Star, Clock, Brain, Database, Sparkles, Settings } from "lucide-react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

export default function AIAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("train")
  const [trainingStep, setTrainingStep] = useState(1)
  const [agentName, setAgentName] = useState("Travel Assistant")
  const [agentDescription, setAgentDescription] = useState("Helps with business travel planning and booking")
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    "Flight booking",
    "Hotel recommendations",
  ])
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  // Available capabilities for the agent
  const availableCapabilities = [
    "Flight booking",
    "Hotel recommendations",
    "Itinerary planning",
    "Travel policy compliance",
    "Expense tracking",
    "Local transportation",
    "Meeting scheduling",
    "Restaurant recommendations",
    "Language translation",
    "Currency conversion",
    "Weather forecasts",
    "Local customs advice",
  ]

  // Training data sources
  const dataSources = [
    {
      name: "Company Travel Policy",
      description: "Rules and guidelines for business travel",
      size: "1.2 MB",
      status: "Connected",
    },
    {
      name: "Previous Bookings",
      description: "Historical booking data from your organization",
      size: "8.5 MB",
      status: "Connected",
    },
    {
      name: "Preferred Vendors",
      description: "List of company-approved travel vendors",
      size: "0.5 MB",
      status: "Connected",
    },
    {
      name: "Employee Feedback",
      description: "Feedback on previous travel experiences",
      size: "3.2 MB",
      status: "Not connected",
    },
  ]

  // Handle capability selection
  const toggleCapability = (capability: string) => {
    if (selectedCapabilities.includes(capability)) {
      setSelectedCapabilities(selectedCapabilities.filter((c) => c !== capability))
    } else {
      setSelectedCapabilities([...selectedCapabilities, capability])
    }
  }

  // Simulate training process
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsTraining(false)
            return 100
          }
          return prev + 5
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [isTraining])

  // Start training process
  const startTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)
  }

  // Handle next step in training wizard
  const handleNextStep = () => {
    if (trainingStep < 4) {
      setTrainingStep(trainingStep + 1)
    } else {
      startTraining()
    }
  }

  // Handle previous step in training wizard
  const handlePrevStep = () => {
    if (trainingStep > 1) {
      setTrainingStep(trainingStep - 1)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-medium tracking-tighter text-white">AI Agent Studio</h1>

          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Badge className="bg-white/10 text-white hover:bg-white/20 transition-colors">
              <Bot className="h-3 w-3 mr-1" />
              Powered by Claude
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 mb-6">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setSelectedTab("train")}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === "train"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Train New Agent
            </button>
            <button
              onClick={() => setSelectedTab("manage")}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === "manage"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Manage Agents
            </button>
            <button
              onClick={() => setSelectedTab("analytics")}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === "analytics"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Analytics
            </button>
          </div>

          {selectedTab === "train" && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <span className="text-white font-medium">{trainingStep}</span>
                </div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/30" style={{ width: `${(trainingStep / 4) * 100}%` }}></div>
                </div>
              </div>

              {/* Step 1: Basic Information */}
              {trainingStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-white">Basic Information</h2>
                  <p className="text-white/70">Let's start by defining the basic details of your custom AI agent.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Agent Name</label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                      <textarea
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Agent Avatar</label>
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-white/10">
                          <Image src="/images/ai-agent-avatar.jpeg" alt="Agent Avatar" fill className="object-cover" />
                        </div>
                        <button className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
                          Change Avatar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Capabilities */}
              {trainingStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-white">Agent Capabilities</h2>
                  <p className="text-white/70">
                    Select the capabilities you want your AI agent to have. These will determine what tasks it can
                    perform.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableCapabilities.map((capability) => (
                      <button
                        key={capability}
                        onClick={() => toggleCapability(capability)}
                        className={`flex items-center px-3 py-2 rounded-lg border ${
                          selectedCapabilities.includes(capability)
                            ? "bg-white/10 border-white/30 text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 mr-2 rounded-sm border ${
                            selectedCapabilities.includes(capability)
                              ? "bg-white/20 border-white/30"
                              : "border-white/30"
                          }`}
                        >
                          {selectedCapabilities.includes(capability) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 text-white"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{capability}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Knowledge Base */}
              {trainingStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-white">Knowledge Base</h2>
                  <p className="text-white/70">
                    Connect data sources to train your AI agent with specific knowledge relevant to your business.
                  </p>

                  <div className="space-y-3">
                    {dataSources.map((source) => (
                      <div
                        key={source.name}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Database className="h-5 w-5 text-white/50 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-white">{source.name}</h3>
                            <p className="text-xs text-white/50">{source.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-white/50 mr-3">{source.size}</span>
                          <Badge
                            className={
                              source.status === "Connected"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-white/10 text-white/70 border-white/20"
                            }
                          >
                            {source.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    <button className="w-full flex items-center justify-center p-3 border border-dashed border-white/20 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                      <Database className="h-4 w-4 mr-2" />
                      <span>Connect Additional Data Source</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Behavior & Personality */}
              {trainingStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-white">Behavior & Personality</h2>
                  <p className="text-white/70">
                    Define how your AI agent should interact with users and what personality traits it should exhibit.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Communication Style</label>
                      <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white">
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Response Length</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-white/50">Concise</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          defaultValue="3"
                          className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                        <span className="text-xs text-white/50">Detailed</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Personality Traits</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          "Helpful",
                          "Knowledgeable",
                          "Efficient",
                          "Patient",
                          "Proactive",
                          "Empathetic",
                          "Analytical",
                          "Creative",
                        ].map((trait) => (
                          <button
                            key={trait}
                            className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                          >
                            {trait}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Custom Instructions</label>
                      <textarea
                        rows={3}
                        placeholder="Add any specific instructions for how your agent should behave..."
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Training in Progress */}
              {isTraining && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-white">Training in Progress</h2>
                  <p className="text-white/70">
                    Your AI agent is being trained with the selected capabilities and knowledge base. This may take a
                    few minutes.
                  </p>

                  <div className="space-y-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500/50 to-purple-500/50"
                        style={{ width: `${trainingProgress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-white/50">
                      <span>{trainingProgress}% Complete</span>
                      <span>Estimated time: {Math.ceil((100 - trainingProgress) / 10)} minutes</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-white/70">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Processing capabilities data...</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <Database className="h-4 w-4 mr-2 text-purple-400" />
                        <span>Analyzing knowledge base...</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <Brain className="h-4 w-4 mr-2 text-pink-400" />
                        <span>Training neural networks...</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <Settings className="h-4 w-4 mr-2 text-green-400" />
                        <span>Configuring personality settings...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Training Complete */}
              {trainingProgress === 100 && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-white">Training Complete!</h2>
                      <p className="text-white/70">Your custom AI agent is ready to use.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="Agent Avatar" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-white">{agentName}</h3>
                        <p className="text-sm text-white/70">{agentDescription}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {selectedCapabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} className="bg-white/5 text-white/70">
                          {capability}
                        </Badge>
                      ))}
                      {selectedCapabilities.length > 3 && (
                        <Badge className="bg-white/5 text-white/70">+{selectedCapabilities.length - 3} more</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      href="/ai-agents/travel-assistant"
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>Chat with Agent</span>
                    </Link>
                    <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Configure Agent</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              {!isTraining && trainingProgress < 100 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className={`px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white ${
                      trainingStep === 1 ? "invisible" : ""
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {trainingStep === 4 ? "Start Training" : "Next"}
                  </button>
                </div>
              )}

              {trainingProgress === 100 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => {
                      setTrainingStep(1)
                      setTrainingProgress(0)
                    }}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Train Another Agent
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedTab === "manage" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Your AI Agents</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                  />
                  <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agent Cards */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border border-white/10">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="Travel Assistant" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-white">Travel Assistant</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                      </div>
                      <p className="text-sm text-white/70 mt-1">Helps with business travel planning and booking</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Flight booking</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Hotel recommendations</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">+4 more</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-xs text-white/50">
                          <Clock className="h-3 w-3 mr-1" />
                          Last used: 2 hours ago
                        </div>
                        <Link href="/ai-agents/travel-assistant" className="flex items-center text-xs text-white group">
                          <span>Chat</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border border-white/10">
                      <Image
                        src="/images/ai-assistant-avatar.png"
                        alt="Expense Manager"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-white">Expense Manager</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                      </div>
                      <p className="text-sm text-white/70 mt-1">Automates expense tracking and reimbursements</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Receipt scanning</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Expense categorization</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">+3 more</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-xs text-white/50">
                          <Clock className="h-3 w-3 mr-1" />
                          Last used: Yesterday
                        </div>
                        <Link href="#" className="flex items-center text-xs text-white group">
                          <span>Chat</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border border-white/10">
                      <Image src="/images/team-member-5.png" alt="Meeting Scheduler" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-white">Meeting Scheduler</h3>
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Training</Badge>
                      </div>
                      <p className="text-sm text-white/70 mt-1">Coordinates meetings across time zones</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Calendar management</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">Time zone coordination</Badge>
                        <Badge className="bg-white/5 text-white/70 text-[10px]">+2 more</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-xs text-white/50">
                          <Clock className="h-3 w-3 mr-1" />
                          Training: 65% complete
                        </div>
                        <button className="flex items-center text-xs text-white/50 cursor-not-allowed">
                          <span>Unavailable</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed border-white/20 rounded-lg p-4 flex items-center justify-center">
                  <button className="flex flex-col items-center text-white/50 hover:text-white">
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                      <PlusCircleIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm">Create New Agent</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "analytics" && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-6">Agent Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white/70">Total Interactions</h3>
                    <MessageSquare className="h-4 w-4 text-white/50" />
                  </div>
                  <p className="text-2xl font-medium text-white">1,248</p>
                  <p className="text-xs text-white/50">+12% from last month</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white/70">Success Rate</h3>
                    <Sparkles className="h-4 w-4 text-white/50" />
                  </div>
                  <p className="text-2xl font-medium text-white">94.3%</p>
                  <p className="text-xs text-white/50">+2.1% from last month</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white/70">Active Agents</h3>
                    <Bot className="h-4 w-4 text-white/50" />
                  </div>
                  <p className="text-2xl font-medium text-white">3</p>
                  <p className="text-xs text-white/50">+1 from last month</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-white mb-4">Agent Usage</h3>
                <div className="h-48 flex items-end justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "70%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Mon</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "85%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Tue</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "65%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Wed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "90%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Thu</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "75%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Fri</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "40%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Sat</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500/30 rounded-t-sm" style={{ height: "30%" }}></div>
                    <span className="text-xs text-white/50 mt-2">Sun</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white mb-4">Top Performing Agents</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src="/images/ai-agent-avatar.jpeg"
                            alt="Travel Assistant"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-white">Travel Assistant</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-white/70">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src="/images/ai-assistant-avatar.png"
                            alt="Expense Manager"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-white">Expense Manager</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-white/70">4.6</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white mb-4">Common User Requests</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Flight booking</span>
                      <span className="text-xs text-white/50">32%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/30" style={{ width: "32%" }}></div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-white/70">Hotel recommendations</span>
                      <span className="text-xs text-white/50">28%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/30" style={{ width: "28%" }}></div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-white/70">Expense tracking</span>
                      <span className="text-xs text-white/50">24%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/30" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
