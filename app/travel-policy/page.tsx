"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Settings,
  Edit3,
} from "lucide-react"

type Policy = {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "archived"
  lastUpdated: string
  complianceRate?: number
}

type ApprovalRequest = {
  id: string
  employeeName: string
  tripPurpose: string
  destination: string
  dates: string
  estimatedCost: number
  status: "pending" | "approved" | "rejected"
  submittedDate: string
}

const mockPolicies: Policy[] = [
  {
    id: "pol1",
    name: "Standard Flight Policy",
    description: "Defines rules for domestic and international flight bookings.",
    status: "active",
    lastUpdated: "2024-05-15",
    complianceRate: 92,
  },
  {
    id: "pol2",
    name: "Hotel Accommodation Tiering",
    description: "Sets limits for hotel star ratings based on travel purpose.",
    status: "active",
    lastUpdated: "2024-04-20",
    complianceRate: 88,
  },
  {
    id: "pol3",
    name: "Ground Transportation Guidelines",
    description: "Rules for car rentals, taxis, and ride-sharing.",
    status: "draft",
    lastUpdated: "2024-06-01",
  },
]

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "app1",
    employeeName: "Alice Wonderland",
    tripPurpose: "Client Meeting",
    destination: "New York",
    dates: "Jul 10 - Jul 12, 2024",
    estimatedCost: 1250,
    status: "pending",
    submittedDate: "2024-06-10",
  },
  {
    id: "app2",
    employeeName: "Bob The Builder",
    tripPurpose: "Conference",
    destination: "London",
    dates: "Aug 05 - Aug 09, 2024",
    estimatedCost: 2100,
    status: "approved",
    submittedDate: "2024-06-05",
  },
  {
    id: "app3",
    employeeName: "Charlie Chaplin",
    tripPurpose: "Team Offsite",
    destination: "Paris",
    dates: "Sep 01 - Sep 03, 2024",
    estimatedCost: 850,
    status: "rejected",
    submittedDate: "2024-05-28",
  },
]

export default function TravelPolicyPage() {
  const [activeTab, setActiveTab] = useState<"policies" | "approvals">("policies")
  const [approvalFilter, setApprovalFilter] = useState<"pending" | "approved" | "rejected">("pending")

  const filteredApprovals = mockApprovalRequests.filter((req) => req.status === approvalFilter)

  const getStatusBadge = (status: Policy["status"] | ApprovalRequest["status"]) => {
    switch (status) {
      case "active":
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            {status}
          </Badge>
        )
      case "draft":
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <AlertTriangle className="h-3 w-3 mr-1.5" />
            {status}
          </Badge>
        )
      case "archived":
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1.5" />
            {status}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-medium text-white mb-1">Travel Policy</h1>
              <p className="text-sm text-white/70">Manage company travel guidelines and approval workflows.</p>
            </div>
            <Button className="mt-3 md:mt-0 bg-white text-black hover:bg-white/90 rounded-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Create New Policy
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-2">
          {(["policies", "approvals"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className={`capitalize text-sm px-4 py-2 h-auto rounded-full ${activeTab === tab ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              {tab === "policies" ? <FileText className="h-4 w-4 mr-2" /> : <Users className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Policies Section */}
        {activeTab === "policies" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPolicies.map((policy, index) => (
              <Card
                key={policy.id}
                className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium text-white">{policy.name}</CardTitle>
                    {getStatusBadge(policy.status)}
                  </div>
                  <p className="text-xs text-white/50 pt-1">Last updated: {policy.lastUpdated}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70 mb-3 h-12 overflow-hidden text-ellipsis">{policy.description}</p>
                  {policy.status === "active" && policy.complianceRate && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Compliance</span>
                        <span>{policy.complianceRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-green-400 h-1.5 rounded-full"
                          style={{ width: `${policy.complianceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card
              className="bg-transparent border-2 border-dashed border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] cursor-pointer backdrop-blur-sm"
              onClick={() => console.log("Create new policy clicked")}
            >
              <PlusCircle className="h-10 w-10 text-white/40 mb-2" />
              <p className="text-white/60 font-medium">Create New Policy</p>
            </Card>
          </div>
        )}

        {/* Approvals Section */}
        {activeTab === "approvals" && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle className="text-xl font-medium text-white mb-2 md:mb-0">Travel Approval Requests</CardTitle>
                <div className="flex space-x-1">
                  {(["pending", "approved", "rejected"] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={approvalFilter === filter ? "default" : "outline"}
                      onClick={() => setApprovalFilter(filter)}
                      size="sm"
                      className={`capitalize text-xs px-3 py-1 h-auto rounded-full ${approvalFilter === filter ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"}`}
                    >
                      {filter === "pending" ? (
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      ) : filter === "approved" ? (
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      {filter} ({mockApprovalRequests.filter((req) => req.status === filter).length})
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredApprovals.length > 0 ? (
                <div className="space-y-3">
                  {filteredApprovals.map((req, index) => (
                    <div
                      key={req.id}
                      className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                      style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <div>
                          <h3 className="font-medium text-white">
                            {req.tripPurpose} - {req.destination}
                          </h3>
                          <p className="text-xs text-white/70">
                            {req.employeeName} • {req.dates}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2 md:mt-0">
                          <span className="text-sm text-white/80 font-medium">${req.estimatedCost}</span>
                          {getStatusBadge(req.status)}
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <div className="mt-3 pt-3 border-t border-white/20 flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <XCircle className="h-4 w-4 mr-1.5" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-500/80 text-white hover:bg-green-500">
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShieldCheck className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">No {approvalFilter} requests at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <style jsx global>{`
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
      `}</style>
    </div>
  )
}
