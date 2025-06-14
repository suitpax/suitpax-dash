"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Building2, CreditCard, Shield, Zap, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AIQuickInput from "@/components/ui/ai-quick-input"

interface BankConnection {
  id: string
  name: string
  logo: string
  status: "connected" | "pending" | "disconnected"
  accounts?: number
  lastSync?: string
}

const banks: BankConnection[] = [
  {
    id: "chase",
    name: "Chase Bank",
    logo: "/images/banks/chase.png",
    status: "connected",
    accounts: 3,
    lastSync: "2 minutes ago",
  },
  {
    id: "bofa",
    name: "Bank of America",
    logo: "/images/banks/bofa.png",
    status: "pending",
    accounts: 0,
  },
  {
    id: "wells",
    name: "Wells Fargo",
    logo: "/images/banks/wells.png",
    status: "disconnected",
    accounts: 0,
  },
  {
    id: "citi",
    name: "Citibank",
    logo: "/images/banks/citi.png",
    status: "disconnected",
    accounts: 0,
  },
]

const connectionSteps = [
  {
    step: 1,
    title: "Select Your Bank",
    description: "Choose from 10,000+ supported financial institutions",
    icon: Building2,
  },
  {
    step: 2,
    title: "Secure Authentication",
    description: "Login safely with bank-level encryption",
    icon: Shield,
  },
  {
    step: 3,
    title: "Sync & Analyze",
    description: "Automatically categorize and track expenses",
    icon: Zap,
  },
]

export default function SmartBankPage() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Add CSS animations
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  const handleConnect = async (bankId: string) => {
    setSelectedBank(bankId)
    setIsConnecting(true)

    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      setSelectedBank(null)
      // Update bank status in real app
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400 animate-pulse-custom" />
      default:
        return <AlertCircle className="h-5 w-5 text-white/30" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-white/5 text-white/50 border-white/10"
    }
  }

  const filteredBanks = banks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-2">Smart Bank</h1>
              <p className="text-white/70 font-light max-w-2xl">
                Connect your business accounts securely and let AI manage your finances automatically. Sync with 10,000+
                banks worldwide.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Bank-Level Security
              </Badge>
            </div>
          </div>
        </header>

        {/* Quick AI Input */}
        <div className="animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <AIQuickInput placeholder="Ask about bank connections, expenses, or financial insights..." />
        </div>

        {/* Connection Steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm animate-fadeInUp">
          <h2 className="text-xl font-light text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {connectionSteps.map((step, index) => (
              <div
                key={step.step}
                className="flex items-start space-x-4 animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="font-medium text-white mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm font-light">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Search */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-light text-white">Connect Your Banks</h2>
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search banks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-4 pr-4 py-2 focus:ring-1 focus:ring-white/20 text-sm font-light"
              />
            </div>
          </div>

          {/* Banks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredBanks.map((bank, index) => (
              <Card
                key={bank.id}
                className={`bg-white/5 border-white/10 hover:bg-white/8 transition-all duration-300 cursor-pointer animate-fadeInUp ${
                  selectedBank === bank.id ? "ring-2 ring-white/20" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => bank.status === "disconnected" && handleConnect(bank.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{bank.name}</h3>
                        {bank.accounts && bank.accounts > 0 && (
                          <p className="text-white/50 text-xs">{bank.accounts} accounts</p>
                        )}
                      </div>
                    </div>
                    {getStatusIcon(bank.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getStatusColor(bank.status)}`}>
                      {bank.status === "connected" && "Connected"}
                      {bank.status === "pending" && "Connecting..."}
                      {bank.status === "disconnected" && "Not Connected"}
                    </Badge>

                    {bank.status === "connected" && bank.lastSync && (
                      <span className="text-white/40 text-xs">Synced {bank.lastSync}</span>
                    )}

                    {bank.status === "disconnected" && (
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/10 h-7 px-3 text-xs"
                        disabled={isConnecting && selectedBank === bank.id}
                      >
                        {isConnecting && selectedBank === bank.id ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Connecting</span>
                          </div>
                        ) : (
                          <>
                            <span>Connect</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Connected Accounts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10 animate-fadeInUp">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Total Balance</h3>
                <CreditCard className="h-5 w-5 text-white/50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-light text-white">$45,230.75</p>
                <p className="text-green-400 text-sm font-light">+$2,340 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Monthly Expenses</h3>
                <Zap className="h-5 w-5 text-white/50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-light text-white">$8,450.20</p>
                <p className="text-red-400 text-sm font-light">+12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Connected Banks</h3>
                <Building2 className="h-5 w-5 text-white/50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-light text-white">{banks.filter((b) => b.status === "connected").length}</p>
                <p className="text-white/50 text-sm font-light">of {banks.length} available</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm animate-fadeInUp">
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-white mb-2">Bank-Level Security</h3>
              <p className="text-white/70 font-light mb-4">
                Your financial data is protected with 256-bit encryption, the same security used by major banks. We
                never store your banking credentials.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/10 text-white/70 border-white/20">SOC 2 Certified</Badge>
                <Badge className="bg-white/10 text-white/70 border-white/20">PCI Compliant</Badge>
                <Badge className="bg-white/10 text-white/70 border-white/20">GDPR Ready</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
