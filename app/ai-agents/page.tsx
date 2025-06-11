"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, BarChart2, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

export default function AIAgentsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for AI agent usage
  const agentUsage = {
    totalTokens: 1250000,
    usedTokens: 450000,
    remainingTokens: 800000,
    refreshDate: "May 15, 2023",
  }

  // Sample data for recent interactions
  const recentInteractions = [
    {
      id: "int-001",
      query: "Find flights from New York to London next week",
      date: "May 2, 2023",
      tokens: 1250,
      status: "completed",
    },
    {
      id: "int-002",
      query: "What are the best hotels in Tokyo for business travelers?",
      date: "May 1, 2023",
      tokens: 1850,
      status: "completed",
    },
    {
      id: "int-003",
      query: "Help me create an expense report for my Paris trip",
      date: "April 30, 2023",
      tokens: 2100,
      status: "completed",
    },
    {
      id: "int-004",
      query: "What's our company policy on business class flights?",
      date: "April 29, 2023",
      tokens: 950,
      status: "completed",
    },
    {
      id: "int-005",
      query: "Draft an email to request travel approval",
      date: "April 28, 2023",
      tokens: 1650,
      status: "completed",
    },
  ]

  // Sample data for saved prompts
  const savedPrompts = [
    {
      id: "prompt-001",
      title: "Flight Search Template",
      prompt: "Find me flights from [ORIGIN] to [DESTINATION] on [DATE] with [AIRLINE] in [CLASS]",
      category: "Travel Booking",
      usage: 24,
    },
    {
      id: "prompt-002",
      title: "Hotel Recommendation",
      prompt: "What are the best hotels in [CITY] for business travelers with [AMENITIES]?",
      category: "Travel Booking",
      usage: 18,
    },
    {
      id: "prompt-003",
      title: "Expense Report Generator",
      prompt: "Create an expense report for my trip to [CITY] from [START_DATE] to [END_DATE]",
      category: "Expense Management",
      usage: 32,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium tracking-tighter">AI Agents</h1>
        <Button className="bg-black text-white rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Create Custom Agent
        </Button>
      </div>

      <Card className="border border-black rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium tracking-tighter">AI Assistant Usage</CardTitle>
          <CardDescription>Monitor your AI token usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-black rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 p-2 bg-gray-100 rounded-full">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">Total Tokens</h3>
                  <p className="text-3xl font-bold mt-2">{agentUsage.totalTokens.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Monthly allocation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-black rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 p-2 bg-gray-100 rounded-full">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">Used Tokens</h3>
                  <p className="text-3xl font-bold mt-2">{agentUsage.usedTokens.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round((agentUsage.usedTokens / agentUsage.totalTokens) * 100)}% of allocation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-black rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 p-2 bg-gray-100 rounded-full">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">Remaining Tokens</h3>
                  <p className="text-3xl font-bold mt-2">{agentUsage.remainingTokens.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Refreshes on {agentUsage.refreshDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-black h-2.5 rounded-full"
                style={{ width: `${Math.round((agentUsage.usedTokens / agentUsage.totalTokens) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>0 tokens</span>
              <span>{agentUsage.totalTokens.toLocaleString()} tokens</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium tracking-tighter">AI Agent Management</CardTitle>
          <CardDescription>Configure and monitor your AI assistants</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                Recent Interactions
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                Saved Prompts
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                Agent Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tokens Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInteractions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell className="font-medium">{interaction.query}</TableCell>
                      <TableCell>{interaction.date}</TableCell>
                      <TableCell>{interaction.tokens}</TableCell>
                      <TableCell>
                        {interaction.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" /> Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            <XCircle className="h-3 w-3 mr-1" /> Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="border-black rounded-lg h-8">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPrompts.map((prompt) => (
                  <Card key={prompt.id} className="border border-black rounded-xl">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md font-medium">{prompt.title}</CardTitle>
                        <Badge className="bg-gray-100 text-black border-gray-300">{prompt.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{prompt.prompt}</p>
                      <p className="text-xs text-gray-500 mt-2">Used {prompt.usage} times</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" className="border-black rounded-lg h-8">
                        Edit
                      </Button>
                      <Button size="sm" className="bg-black text-white rounded-lg h-8">
                        Use Prompt
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select defaultValue="gpt4">
                      <SelectTrigger className="border-black rounded-xl">
                        <SelectValue placeholder="Select AI Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt4">GPT-4</SelectItem>
                        <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude">Claude 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">0.0</span>
                      <Slider defaultValue={[0.7]} max={1} min={0} step={0.1} className="flex-1" />
                      <span className="text-sm">1.0</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Controls randomness: Lower values are more deterministic, higher values more creative
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Enter a system prompt to guide the AI's behavior"
                    className="border-black rounded-xl"
                    rows={4}
                    defaultValue="You are Suitpax AI, a helpful assistant for business travel management. You help users book flights, find hotels, manage expenses, and understand travel policies."
                  />
                  <p className="text-xs text-gray-500">
                    This prompt sets the behavior and context for the AI assistant
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="knowledge-base" defaultChecked />
                  <Label htmlFor="knowledge-base">Enable Suitpax Knowledge Base</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="web-search" />
                  <Label htmlFor="web-search">Enable Web Search</Label>
                </div>

                <Button className="bg-black text-white rounded-xl">Save Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border border-black rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium tracking-tighter">AI Assistant</CardTitle>
          <CardDescription>Ask questions about business travel management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Image
              src="/images/ai-agent-avatar.jpeg"
              alt="AI Assistant"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 p-3 rounded-xl mb-3">
                <p className="text-sm">
                  Hello! I'm your Suitpax AI Assistant. I can help you with flight and hotel bookings, expense
                  management, travel policies, and more. What can I assist you with today?
                </p>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Ask me anything about business travel management..."
                  className="border-black rounded-xl pr-12 min-h-[100px]"
                />
                <Button className="absolute right-3 bottom-3 h-8 w-8 p-0 bg-black text-white rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
                    <path
                      d="M7 15L12 10L17 15"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs cursor-pointer bg-white hover:bg-gray-50">
                  Find flights to London
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer bg-white hover:bg-gray-50">
                  Hotel recommendations in Tokyo
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer bg-white hover:bg-gray-50">
                  Create travel checklist
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer bg-white hover:bg-gray-50">
                  Expense policy for meals
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer bg-white hover:bg-gray-50">
                  Draft approval request
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  )
}

function Select({ children, defaultValue }) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-black bg-white px-3 py-2 text-sm appearance-none"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

function SelectTrigger({ children, className }) {
  return <div className={className}>{children}</div>
}

function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>
}

function SelectContent({ children }) {
  return <div className="bg-white border border-black rounded-xl p-1 mt-1">{children}</div>
}

function SelectItem({ value, children }) {
  return <div className="px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer">{children}</div>
}

function Slider({ defaultValue, max, min, step, className }) {
  return (
    <div className={`h-2 bg-gray-200 rounded-full ${className}`}>
      <div
        className="h-full bg-black rounded-full"
        style={{ width: `${((defaultValue[0] - min) / (max - min)) * 100}%` }}
      ></div>
    </div>
  )
}

function Textarea({ id, placeholder, className, rows, defaultValue }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-black bg-white px-3 py-2 text-sm ${className}`}
      rows={rows}
      defaultValue={defaultValue}
    ></textarea>
  )
}

function Switch({ id, defaultChecked }) {
  return (
    <div className="relative inline-flex h-6 w-11 items-center rounded-full border border-black">
      <input type="checkbox" id={id} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-gray-300 transition-all peer-checked:left-6 peer-checked:bg-black`}
      ></span>
    </div>
  )
}
