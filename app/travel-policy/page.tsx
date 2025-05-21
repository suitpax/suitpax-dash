"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/ui/layout"
import { PolicyCard } from "@/components/ui/policy-card"
import { PolicyEditor } from "@/components/ui/policy-editor"
import { PolicyTemplateCard } from "@/components/ui/policy-template-card"
import type { Policy, PolicyTemplate } from "@/types/policy"
import {
  getPolicies,
  getPolicyTemplates,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "@/lib/services/policy-service"
import { Plus, Search, Filter, AlertTriangle } from "lucide-react"

export default function TravelPolicyPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [templates, setTemplates] = useState<PolicyTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("policies")
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [policiesData, templatesData] = await Promise.all([getPolicies(), getPolicyTemplates()])
        setPolicies(policiesData)
        setTemplates(templatesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load policies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setIsCreating(false)
  }

  const handleCreatePolicy = () => {
    setEditingPolicy(null)
    setIsCreating(true)
  }

  const handleCancelEdit = () => {
    setEditingPolicy(null)
    setIsCreating(false)
  }

  const handleSavePolicy = async (policyData: Omit<Policy, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingPolicy) {
        // Update existing policy
        const updated = await updatePolicy(editingPolicy.id, policyData)
        setPolicies(policies.map((p) => (p.id === editingPolicy.id ? updated : p)))
      } else {
        // Create new policy
        const created = await createPolicy(policyData)
        setPolicies([...policies, created])
      }

      setEditingPolicy(null)
      setIsCreating(false)
    } catch (err) {
      console.error("Error saving policy:", err)
      setError("Failed to save policy. Please try again.")
    }
  }

  const handleArchivePolicy = async (policy: Policy) => {
    try {
      const updated = await updatePolicy(policy.id, { status: "archived" })
      setPolicies(policies.map((p) => (p.id === policy.id ? updated : p)))
    } catch (err) {
      console.error("Error archiving policy:", err)
      setError("Failed to archive policy. Please try again.")
    }
  }

  const handleDeletePolicy = async (policy: Policy) => {
    if (window.confirm(`Are you sure you want to delete the policy "${policy.name}"?`)) {
      try {
        await deletePolicy(policy.id)
        setPolicies(policies.filter((p) => p.id !== policy.id))
      } catch (err) {
        console.error("Error deleting policy:", err)
        setError("Failed to delete policy. Please try again.")
      }
    }
  }

  const handleUseTemplate = (template: PolicyTemplate) => {
    // Convert template to policy format for the editor
    const newPolicy: Omit<Policy, "id" | "createdAt" | "updatedAt"> = {
      name: template.name,
      description: template.description,
      level: "company",
      category: template.category,
      status: "draft",
      rules: template.rules.map((rule) => ({
        ...rule,
        id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      })),
      appliesTo: ["all"],
      createdBy: "current_user",
      version: 1,
    }

    setEditingPolicy(null)
    setIsCreating(true)
    // We need to wait for the state to update before setting the form values
    setTimeout(() => {
      handleSavePolicy(newPolicy)
    }, 0)
  }

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // If we're editing or creating, show the editor
  if (editingPolicy || isCreating) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <PolicyEditor policy={editingPolicy || undefined} onSave={handleSavePolicy} onCancel={handleCancelEdit} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-white mb-1">Travel Policy Management</h1>
            <p className="text-white/70">Create and manage travel policies for your organization</p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <button
              onClick={handleCreatePolicy}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-white/70 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Error</h3>
              <p className="text-white/70">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-black border border-white/10 rounded-lg mb-6">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("policies")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "policies"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Policies
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "templates"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Templates
            </button>
          </div>

          {activeTab === "policies" && (
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option value="all">All Categories</option>
                    <option value="flights">Flights</option>
                    <option value="hotels">Hotels</option>
                    <option value="transportation">Transportation</option>
                    <option value="meals">Meals</option>
                    <option value="expenses">Expenses</option>
                    <option value="approvals">Approvals</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  <p className="mt-2 text-white/70">Loading policies...</p>
                </div>
              ) : filteredPolicies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPolicies.map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      onEdit={handleEditPolicy}
                      onArchive={handleArchivePolicy}
                      onDelete={handleDeletePolicy}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/50">No policies found. Create your first policy to get started.</p>
                  <button
                    onClick={handleCreatePolicy}
                    className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Create Policy
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "templates" && (
            <div className="p-4">
              <h2 className="text-lg font-medium text-white mb-4">Policy Templates</h2>
              <p className="text-white/70 mb-6">
                Use these pre-configured templates to quickly create policies for your organization.
              </p>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  <p className="mt-2 text-white/70">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <PolicyTemplateCard key={template.id} template={template} onUseTemplate={handleUseTemplate} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-black border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Policy Best Practices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Clear Communication</h3>
                  <p className="text-white/70 text-sm">
                    Ensure policies are clearly communicated to all employees. Use simple language and provide examples.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Regular Updates</h3>
                  <p className="text-white/70 text-sm">
                    Review and update policies regularly to reflect changing business needs and market conditions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Compliance Monitoring</h3>
                  <p className="text-white/70 text-sm">
                    Implement systems to monitor policy compliance and address violations consistently.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Employee Feedback</h3>
                  <p className="text-white/70 text-sm">
                    Gather feedback from employees to ensure policies are practical and address real-world scenarios.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Flexibility</h3>
                  <p className="text-white/70 text-sm">
                    Build in appropriate exceptions and approval processes for special circumstances.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-white/5 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/70"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Data-Driven Decisions</h3>
                  <p className="text-white/70 text-sm">
                    Use travel data and analytics to inform policy decisions and identify optimization opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
