"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiTarget, PiTrendUp, PiCheckCircle, PiClock, PiWarning, PiPlus } from "react-icons/pi"

export default function GoalsPage() {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
    category: "cost-reduction",
  })

  const goals = [
    {
      id: "g1",
      title: "Reduce Travel Costs by 15%",
      category: "Cost Reduction",
      target: "15%",
      current: "12.3%",
      progress: 82,
      deadline: "2024-12-31",
      status: "on-track",
      description: "Optimize vendor negotiations and booking patterns",
    },
    {
      id: "g2",
      title: "Achieve 95% Policy Compliance",
      category: "Compliance",
      target: "95%",
      current: "94.7%",
      progress: 99,
      deadline: "2024-12-31",
      status: "almost-complete",
      description: "Improve adherence to travel booking policies",
    },
    {
      id: "g3",
      title: "Carbon Footprint Reduction",
      category: "Sustainability",
      target: "25%",
      current: "18.2%",
      progress: 73,
      deadline: "2025-06-30",
      status: "on-track",
      description: "Reduce CO2 emissions through sustainable travel options",
    },
    {
      id: "g4",
      title: "Increase Advance Booking Rate",
      category: "Efficiency",
      target: "80%",
      current: "67%",
      progress: 84,
      deadline: "2025-03-31",
      status: "at-risk",
      description: "Encourage earlier booking for better rates and availability",
    },
    {
      id: "g5",
      title: "Vendor Consolidation",
      category: "Operations",
      target: "5 vendors",
      current: "8 vendors",
      progress: 60,
      deadline: "2025-01-31",
      status: "behind",
      description: "Streamline vendor relationships for better management",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">
            <PiCheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )
      case "almost-complete":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-light">
            <PiTarget className="h-3 w-3 mr-1" />
            Almost There
          </Badge>
        )
      case "on-track":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">
            <PiTrendUp className="h-3 w-3 mr-1" />
            On Track
          </Badge>
        )
      case "at-risk":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-light">
            <PiWarning className="h-3 w-3 mr-1" />
            At Risk
          </Badge>
        )
      case "behind":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-light">
            <PiClock className="h-3 w-3 mr-1" />
            Behind
          </Badge>
        )
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20 font-light">{status}</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cost reduction":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "compliance":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "sustainability":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "efficiency":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "operations":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const addNewGoal = () => {
    if (!newGoal.title.trim()) return

    // In a real app, this would make an API call
    console.log("Adding new goal:", newGoal)

    setNewGoal({
      title: "",
      target: "",
      deadline: "",
      category: "cost-reduction",
    })
    setShowNewGoalForm(false)
  }

  const overallProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Travel Goals</h1>
            <p className="text-muted-foreground text-sm font-light">Set and track travel objectives</p>
          </div>
          <Button className="font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Your Goals</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiTarget className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No goals set yet</h3>
              <p className="text-muted-foreground mb-4">Create your first goal to start tracking travel objectives.</p>
              <Button>
                <PiPlus className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
