"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Check, X, Clock, User, DollarSign, Calendar, MapPin } from "lucide-react"

export default function ApprovalsPage() {
  const [filter, setFilter] = useState("pending")

  const approvals = [
    {
      id: 1,
      type: "travel",
      requester: "Sarah Johnson",
      requesterAvatar: "/images/team/genevieve-mclean.jpeg",
      title: "Business Trip to London",
      destination: "London, UK",
      dates: "June 15-20, 2024",
      amount: "$2,450",
      reason: "Client presentation and contract negotiation",
      status: "pending",
      submittedAt: "2 hours ago",
      urgency: "high",
    },
    {
      id: 2,
      type: "expense",
      requester: "Mike Chen",
      requesterAvatar: "/images/team/cohen-lozano.jpeg",
      title: "Conference Expenses",
      destination: "San Francisco, CA",
      dates: "May 10-12, 2024",
      amount: "$1,890",
      reason: "Tech conference attendance and networking",
      status: "pending",
      submittedAt: "5 hours ago",
      urgency: "medium",
    },
    {
      id: 3,
      type: "travel",
      requester: "Emily Rodriguez",
      requesterAvatar: "/images/team/orlando-diggs.jpeg",
      title: "Team Meeting in Chicago",
      destination: "Chicago, IL",
      dates: "July 8-10, 2024",
      amount: "$980",
      reason: "Quarterly team meeting and planning session",
      status: "approved",
      submittedAt: "1 day ago",
      urgency: "low",
    },
  ]

  const filteredApprovals = approvals.filter((approval) => filter === "all" || approval.status === filter)

  const handleApprove = (id: number) => {
    console.log(`Approving request ${id}`)
  }

  const handleReject = (id: number) => {
    console.log(`Rejecting request ${id}`)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-md font-medium text-black">Approvals</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredApprovals.filter((a) => a.status === "pending").length} pending
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-black p-4 shadow-sm mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === "pending" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({approvals.filter((a) => a.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === "approved" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved ({approvals.filter((a) => a.status === "approved").length})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === "rejected" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected ({approvals.filter((a) => a.status === "rejected").length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Approvals List */}
        <div className="space-y-4">
          {filteredApprovals.length > 0 ? (
            filteredApprovals.map((approval) => (
              <div
                key={approval.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-black transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={approval.requesterAvatar || "/placeholder.svg"}
                      alt={approval.requester}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-black">{approval.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(approval.status)}`}>
                          {approval.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(approval.urgency)}`}>
                          {approval.urgency} priority
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        Requested by {approval.requester}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {approval.destination}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {approval.dates}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {approval.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {approval.submittedAt}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-black mb-2">Reason for Travel</h4>
                  <p className="text-sm text-gray-600">{approval.reason}</p>
                </div>

                {approval.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Request More Info
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-black p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-black mb-2">No approvals found</h2>
              <p className="text-gray-600">
                {filter === "pending" ? "No pending approvals at the moment." : `No ${filter} approvals found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
