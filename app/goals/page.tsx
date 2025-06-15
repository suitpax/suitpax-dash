"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PiTarget, PiTrendUp, PiCheckCircle, PiClock, PiWarning, PiPlus, PiCalendar } from "react-icons/pi"

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
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Goals & Objectives</h1>
            <p className="text-white/70 text-sm font-light">Track progress towards travel management goals</p>
          </div>
          <Button onClick={() => setShowNewGoalForm(true)} className="bg-white text-black hover:bg-white/90 font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Overall Progress</h2>
                <p className="text-white/70 text-sm font-light">Average completion across all goals</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-white">{overallProgress}%</p>
                <p className="text-sm text-white/70 font-light">{goals.length} active goals</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Goal Form */}
        {showNewGoalForm && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-white font-light tracking-tighter text-lg">Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Goal Title</label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Enter goal title..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Target</label>
                  <Input
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    placeholder="e.g., 15%, $50K, 90%"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white font-light"
                  >
                    <option value="cost-reduction">Cost Reduction</option>
                    <option value="compliance">Compliance</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="efficiency">Efficiency</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Deadline</label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="bg-white/5 border-white/10 text-white font-light"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={addNewGoal} className="bg-white text-black hover:bg-white/90 font-light">
                  Create Goal
                </Button>
                <Button
                  onClick={() => setShowNewGoalForm(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-light"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Active Goals</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <PiTarget className="h-5 w-5 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-light text-white">{goal.title}</h3>
                          {getStatusBadge(goal.status)}
                        </div>
                        <p className="text-sm text-white/70 font-light mb-2">{goal.description}</p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <Badge className={`text-xs font-light ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <PiCalendar className="h-3 w-3" />
                            <span className="font-light">Due: {goal.deadline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-light text-white">{goal.current}</p>
                      <p className="text-xs text-white/50 font-light">of {goal.target}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="font-light">Progress</span>
                      <span className="font-light">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          goal.progress >= 90
                            ? "bg-green-400"
                            : goal.progress >= 70
                              ? "bg-blue-400"
                              : goal.progress >= 50
                                ? "bg-yellow-400"
                                : "bg-red-400"
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
