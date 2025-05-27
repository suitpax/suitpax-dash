"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { PlusIcon, ArrowRightIcon, PlayIcon, PauseIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { RocketLaunchIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "paused" | "draft">("active")

  const workflows = [
    {
      id: "workflow-1",
      name: "Travel Request Approval",
      description: "Automatically route travel requests to the appropriate manager for approval.",
      status: "active",
      lastRun: "2 hours ago",
      runs: 245,
      successRate: 98,
      steps: 4,
      triggers: ["New travel request submitted"],
      actions: ["Route to manager", "Send notification", "Update status", "Archive request"],
    },
    {
      id: "workflow-2",
      name: "Expense Report Processing",
      description: "Process expense reports and route them for approval and reimbursement.",
      status: "active",
      lastRun: "30 minutes ago",
      runs: 189,
      successRate: 95,
      steps: 5,
      triggers: ["New expense report submitted"],
      actions: ["Validate expenses", "Route to finance", "Approve/Reject", "Process payment", "Update records"],
    },
    {
      id: "workflow-3",
      name: "Travel Policy Compliance Check",
      description: "Check travel bookings against company policy and flag non-compliant requests.",
      status: "paused",
      lastRun: "3 days ago",
      runs: 78,
      successRate: 92,
      steps: 3,
      triggers: ["New travel booking created"],
      actions: ["Check against policy", "Flag non-compliant items", "Notify traveler and manager"],
    },
    {
      id: "workflow-4",
      name: "Vendor Payment Processing",
      description: "Process payments to travel vendors on schedule.",
      status: "draft",
      lastRun: "Never",
      runs: 0,
      successRate: 0,
      steps: 4,
      triggers: ["Payment due date reached"],
      actions: ["Verify invoice", "Approve payment", "Process transaction", "Update accounting records"],
    },
  ]

  const filteredWorkflows = workflows.filter((workflow) => workflow.status === activeTab)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header específico de Workflows */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Workflows</h1>
              <p className="text-sm text-white/70 mt-1">Automate your travel processes with custom workflows</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors whitespace-nowrap">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Workflow
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "active" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "paused" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("paused")}
          >
            Paused
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "draft" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("draft")}
          >
            Drafts
          </button>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <RocketLaunchIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{workflow.name}</h3>
                      <p className="text-white/70 text-sm">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {workflow.status === "active" && (
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors">
                        <PauseIcon className="h-4 w-4" />
                      </button>
                    )}
                    {workflow.status === "paused" && (
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors">
                        <PlayIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/50 text-xs mb-1">Status</div>
                    <div className="flex items-center">
                      {workflow.status === "active" && (
                        <span className="flex items-center text-green-400 text-sm">
                          <CheckCircleIcon className="h-4 w-4 mr-1" /> Active
                        </span>
                      )}
                      {workflow.status === "paused" && (
                        <span className="flex items-center text-amber-400 text-sm">
                          <PauseIcon className="h-4 w-4 mr-1" /> Paused
                        </span>
                      )}
                      {workflow.status === "draft" && (
                        <span className="flex items-center text-white/70 text-sm">
                          <XCircleIcon className="h-4 w-4 mr-1" /> Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/50 text-xs mb-1">Last Run</div>
                    <div className="flex items-center text-white text-sm">
                      <ClockIcon className="h-4 w-4 mr-1 text-white/70" /> {workflow.lastRun}
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/50 text-xs mb-1">Total Runs</div>
                    <div className="text-white text-sm">{workflow.runs}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/50 text-xs mb-1">Success Rate</div>
                    <div className="text-white text-sm">{workflow.successRate}%</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="text-white/50 text-xs mb-2">Triggers</div>
                    <div className="space-y-1">
                      {workflow.triggers.map((trigger, index) => (
                        <div key={index} className="flex items-center text-white/70 text-sm">
                          <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                          {trigger}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white/50 text-xs mb-2">Actions</div>
                    <div className="space-y-1">
                      {workflow.actions.map((action, index) => (
                        <div key={index} className="flex items-center text-white/70 text-sm">
                          <ArrowRightIcon className="h-3 w-3 text-white/50 mr-2" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredWorkflows.length === 0 && (
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
              <RocketLaunchIcon className="h-10 w-10 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No {activeTab} workflows</h3>
              <p className="text-white/70 text-sm mb-4">
                {activeTab === "active"
                  ? "You don't have any active workflows. Create one or activate an existing workflow."
                  : activeTab === "paused"
                    ? "You don't have any paused workflows."
                    : "You don't have any draft workflows. Start creating one now."}
              </p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm">
                Create Workflow
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
