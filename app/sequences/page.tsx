"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface Sequence {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  trigger: string
  steps: number
  enrolled: number
  completed: number
  openRate: number
  clickRate: number
  createdAt: string
  lastModified: string
}

const sequences: Sequence[] = [
  {
    id: "1",
    name: "Welcome New Travelers",
    description: "Automated sequence to onboard new travelers with travel policy and platform introduction",
    status: "active",
    trigger: "New user registration",
    steps: 5,
    enrolled: 127,
    completed: 89,
    openRate: 85.2,
    clickRate: 34.6,
    createdAt: "2024-01-15",
    lastModified: "2024-03-10",
  },
  {
    id: "2",
    name: "Travel Booking Confirmation",
    description: "Follow-up sequence after flight or hotel booking with itinerary and tips",
    status: "active",
    trigger: "Booking completed",
    steps: 3,
    enrolled: 245,
    completed: 198,
    openRate: 92.1,
    clickRate: 28.3,
    createdAt: "2024-02-01",
    lastModified: "2024-03-15",
  },
  {
    id: "3",
    name: "Expense Report Reminder",
    description: "Weekly reminders for pending expense reports and submission deadlines",
    status: "active",
    trigger: "Weekly schedule",
    steps: 4,
    enrolled: 89,
    completed: 56,
    openRate: 78.9,
    clickRate: 45.2,
    createdAt: "2024-02-20",
    lastModified: "2024-03-08",
  },
  {
    id: "4",
    name: "Travel Policy Updates",
    description: "Notification sequence for travel policy changes and compliance requirements",
    status: "paused",
    trigger: "Policy update",
    steps: 2,
    enrolled: 156,
    completed: 134,
    openRate: 88.5,
    clickRate: 52.1,
    createdAt: "2024-01-30",
    lastModified: "2024-02-28",
  },
  {
    id: "5",
    name: "Budget Threshold Alert",
    description: "Alert sequence when travel budget reaches 75% and 90% thresholds",
    status: "draft",
    trigger: "Budget threshold",
    steps: 3,
    enrolled: 0,
    completed: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "2024-03-01",
    lastModified: "2024-03-20",
  },
]

export default function SequencesPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400"
      case "paused":
        return "bg-amber-500/20 text-amber-400"
      case "draft":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-white/5 text-white/70"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "draft":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredSequences =
    selectedStatus === "all" ? sequences : sequences.filter((seq) => seq.status === selectedStatus)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Email Sequences</h1>
              <p className="text-sm text-white/70 mt-1">Create and manage automated email sequences for travelers</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2"
            >
              <Plus size={14} />
              <span className="text-xs">Create Sequence</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Active Sequences</p>
                  <p className="text-xl font-bold text-white">
                    {sequences.filter((s) => s.status === "active").length}
                  </p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Play className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Total Enrolled</p>
                  <p className="text-xl font-bold text-white">{sequences.reduce((sum, s) => sum + s.enrolled, 0)}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Avg Open Rate</p>
                  <p className="text-xl font-bold text-white">
                    {(
                      sequences.filter((s) => s.status === "active").reduce((sum, s) => sum + s.openRate, 0) /
                      sequences.filter((s) => s.status === "active").length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Avg Click Rate</p>
                  <p className="text-xl font-bold text-white">
                    {(
                      sequences.filter((s) => s.status === "active").reduce((sum, s) => sum + s.clickRate, 0) /
                      sequences.filter((s) => s.status === "active").length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "active", "paused", "draft"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedStatus === status ? "bg-white/10 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sequences List */}
        <div className="space-y-4">
          {filteredSequences.map((sequence) => (
            <Card key={sequence.id} className="bg-black rounded-lg border border-white/10">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-white">{sequence.name}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(sequence.status)}
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(sequence.status)}`}
                        >
                          {sequence.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mb-3">{sequence.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Trigger: {sequence.trigger}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {sequence.steps} steps
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {sequence.enrolled} enrolled
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{sequence.completed}</div>
                      <div className="text-xs text-white/50">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-400">{sequence.openRate}%</div>
                      <div className="text-xs text-white/50">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{sequence.clickRate}%</div>
                      <div className="text-xs text-white/50">Click Rate</div>
                    </div>
                    <div className="flex gap-2">
                      {sequence.status === "active" ? (
                        <Button size="sm" className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded">
                          <Pause size={14} />
                        </Button>
                      ) : (
                        <Button size="sm" className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded">
                          <Play size={14} />
                        </Button>
                      )}
                      <Button size="sm" className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded">
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSequences.length === 0 && (
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-12 text-center">
              <Mail className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No sequences found</h3>
              <p className="text-white/70 mb-4">
                {selectedStatus === "all"
                  ? "Create your first email sequence to automate traveler communications."
                  : `No ${selectedStatus} sequences found.`}
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-white/10 text-white hover:bg-white/20">
                <Plus className="h-4 w-4 mr-2" />
                Create Sequence
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
