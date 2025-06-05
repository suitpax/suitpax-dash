"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Calendar,
  User,
  Building,
  MoreHorizontal,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react"

interface Deal {
  id: string
  title: string
  company: string
  contactPerson: string
  avatar: string
  value: number
  stage: "prospecting" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  probability: number
  closeDate: string
  createdAt: string
  description: string
  tags: string[]
  lastActivity: string
}

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")

  const deals: Deal[] = [
    {
      id: "1",
      title: "Corporate Travel Management - TechCorp",
      company: "TechCorp Solutions",
      contactPerson: "Sarah Johnson",
      avatar: "/images/team/genevieve-mclean.jpeg",
      value: 125000,
      stage: "negotiation",
      probability: 75,
      closeDate: "2024-04-15",
      createdAt: "2024-03-01",
      description: "Complete travel management solution for 250+ employees",
      tags: ["Enterprise", "Travel Management", "High Value"],
      lastActivity: "2 hours ago",
    },
    {
      id: "2",
      title: "VIP Travel Services - Global Dynamics",
      company: "Global Dynamics",
      contactPerson: "Marcus Weber",
      avatar: "/images/team/aston-hood.jpeg",
      value: 450000,
      stage: "proposal",
      probability: 60,
      closeDate: "2024-05-01",
      createdAt: "2024-02-15",
      description: "Premium travel services for executive team and board members",
      tags: ["VIP", "Executive Travel", "Premium"],
      lastActivity: "1 day ago",
    },
    {
      id: "3",
      title: "Startup Travel Package - Innovate Labs",
      company: "Innovate Labs",
      contactPerson: "Emma Thompson",
      avatar: "/images/team/isla-allison.jpeg",
      value: 35000,
      stage: "prospecting",
      probability: 25,
      closeDate: "2024-06-01",
      createdAt: "2024-03-10",
      description: "Cost-effective travel solution for growing startup",
      tags: ["Startup", "Budget-Friendly", "Growth"],
      lastActivity: "3 days ago",
    },
    {
      id: "4",
      title: "Global Expansion Support - Future Systems",
      company: "Future Systems",
      contactPerson: "Carlos Rodriguez",
      avatar: "/images/team/cohen-lozano.jpeg",
      value: 280000,
      stage: "closed-won",
      probability: 100,
      closeDate: "2024-03-20",
      createdAt: "2024-01-15",
      description: "International travel management for global expansion",
      tags: ["Global", "Expansion", "International"],
      lastActivity: "5 days ago",
    },
    {
      id: "5",
      title: "Event Management Services - Digital Ventures",
      company: "Digital Ventures",
      contactPerson: "Lisa van Berg",
      avatar: "/images/team/isobel-fuller.jpeg",
      value: 75000,
      stage: "closed-lost",
      probability: 0,
      closeDate: "2024-03-25",
      createdAt: "2024-02-01",
      description: "Travel coordination for company events and conferences",
      tags: ["Events", "Conferences", "Coordination"],
      lastActivity: "1 week ago",
    },
  ]

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStage = selectedStage === "all" || deal.stage === selectedStage

    return matchesSearch && matchesStage
  })

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospecting":
        return "bg-blue-500/20 text-blue-400"
      case "proposal":
        return "bg-yellow-500/20 text-yellow-400"
      case "negotiation":
        return "bg-orange-500/20 text-orange-400"
      case "closed-won":
        return "bg-emerald-500/20 text-emerald-400"
      case "closed-lost":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "prospecting":
        return <Search className="h-3 w-3" />
      case "proposal":
        return <Target className="h-3 w-3" />
      case "negotiation":
        return <TrendingUp className="h-3 w-3" />
      case "closed-won":
        return <CheckCircle className="h-3 w-3" />
      case "closed-lost":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const wonDeals = deals.filter((deal) => deal.stage === "closed-won")
  const activeDeals = deals.filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage))

  const stats = [
    { label: "Total Pipeline", value: `$${totalValue.toLocaleString()}`, change: "+12%" },
    { label: "Active Deals", value: activeDeals.length.toString(), change: "+8%" },
    {
      label: "Won This Month",
      value: `$${wonDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`,
      change: "+25%",
    },
    { label: "Win Rate", value: `${((wonDeals.length / deals.length) * 100).toFixed(0)}%`, change: "+5%" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Deals Pipeline</h1>
              <p className="text-white/70">Track and manage your sales opportunities</p>
            </div>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/30 border-white/10">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70 mb-1">{stat.label}</div>
                <div className="text-xs text-emerald-400">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2">
            {["all", "prospecting", "proposal", "negotiation", "closed-won", "closed-lost"].map((stage) => (
              <Button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                variant={selectedStage === stage ? "default" : "outline"}
                className={
                  selectedStage === stage
                    ? "bg-white text-black"
                    : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                }
                size="sm"
              >
                {stage === "all" ? "All" : stage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Deals List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black/30 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {deal.contactPerson
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">{deal.title}</h3>
                          <Badge className={`${getStageColor(deal.stage)} flex items-center gap-1`}>
                            {getStageIcon(deal.stage)}
                            {deal.stage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {deal.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {deal.contactPerson}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Close: {new Date(deal.closeDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 mb-3">{deal.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {deal.tags.map((tag, i) => (
                            <Badge key={i} className="bg-white/10 text-white/70 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${deal.value.toLocaleString()}</div>
                        <div className="text-sm text-white/70">{deal.probability}% probability</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Last activity: {deal.lastActivity}</span>
                        <Button size="sm" variant="ghost" className="text-white/50 hover:text-white h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredDeals.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Target className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No deals found</h3>
            <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Create First Deal
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
