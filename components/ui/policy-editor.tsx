"use client"

import type React from "react"

import { useState } from "react"
import type { Policy, PolicyRule, PolicyCategory, PolicyLevel, PolicyStatus } from "@/types/policy"
import { X, Plus, Save, ArrowLeft } from "lucide-react"

interface PolicyEditorProps {
  policy?: Policy
  onSave: (policy: Omit<Policy, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function PolicyEditor({ policy, onSave, onCancel }: PolicyEditorProps) {
  const [name, setName] = useState(policy?.name || "")
  const [description, setDescription] = useState(policy?.description || "")
  const [level, setLevel] = useState<PolicyLevel>(policy?.level || "company")
  const [category, setCategory] = useState<PolicyCategory>(policy?.category || "flights")
  const [status, setStatus] = useState<PolicyStatus>(policy?.status || "draft")
  const [rules, setRules] = useState<PolicyRule[]>(policy?.rules || [])
  const [appliesTo, setAppliesTo] = useState<string[]>(policy?.appliesTo || ["all"])

  const addRule = () => {
    const newRule: PolicyRule = {
      id: `rule_${Date.now()}`,
      name: "",
      description: "",
      condition: "",
      action: "",
      priority: rules.length + 1,
      isActive: true,
    }
    setRules([...rules, newRule])
  }

  const updateRule = (index: number, updates: Partial<PolicyRule>) => {
    const updatedRules = [...rules]
    updatedRules[index] = { ...updatedRules[index], ...updates }
    setRules(updatedRules)
  }

  const removeRule = (index: number) => {
    const updatedRules = [...rules]
    updatedRules.splice(index, 1)
    setRules(updatedRules)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedPolicy: Omit<Policy, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      level,
      category,
      status,
      rules,
      appliesTo,
      createdBy: policy?.createdBy || "current_user",
      version: policy?.version || 1,
    }

    onSave(updatedPolicy)
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-medium text-white">{policy ? "Edit Policy" : "Create New Policy"}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                Policy Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-white/70 mb-1">
                  Policy Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as PolicyLevel)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="company">Company</option>
                  <option value="department">Department</option>
                  <option value="team">Team</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="flights">Flights</option>
                  <option value="hotels">Hotels</option>
                  <option value="transportation">Transportation</option>
                  <option value="meals">Meals</option>
                  <option value="expenses">Expenses</option>
                  <option value="approvals">Approvals</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-white/70 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PolicyStatus)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Policy Rules</h3>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
                <p className="text-white/50">No rules defined yet. Add your first rule to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-medium">Rule {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Rule Name</label>
                        <input
                          type="text"
                          value={rule.name}
                          onChange={(e) => updateRule(index, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                        <input
                          type="text"
                          value={rule.description}
                          onChange={(e) => updateRule(index, { description: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-1">Condition</label>
                          <input
                            type="text"
                            value={rule.condition}
                            onChange={(e) => updateRule(index, { condition: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="e.g. flight.duration > 6"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-1">Action</label>
                          <input
                            type="text"
                            value={rule.action}
                            onChange={(e) => updateRule(index, { action: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="e.g. REQUIRE_APPROVAL"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-${rule.id}`}
                          checked={rule.isActive}
                          onChange={(e) => updateRule(index, { isActive: e.target.checked })}
                          className="h-4 w-4 bg-white/5 border border-white/10 rounded text-white focus:ring-white/20"
                        />
                        <label htmlFor={`active-${rule.id}`} className="ml-2 text-sm text-white/70">
                          Rule is active
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applies To */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Applies To</h3>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="applies-all"
                  name="applies-to"
                  checked={appliesTo.includes("all")}
                  onChange={() => setAppliesTo(["all"])}
                  className="h-4 w-4 bg-white/5 border border-white/10 rounded-full text-white focus:ring-white/20"
                />
                <label htmlFor="applies-all" className="ml-2 text-sm text-white/70">
                  All employees
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="applies-specific"
                  name="applies-to"
                  checked={!appliesTo.includes("all")}
                  onChange={() => setAppliesTo([])}
                  className="h-4 w-4 bg-white/5 border border-white/10 rounded-full text-white focus:ring-white/20"
                />
                <label htmlFor="applies-specific" className="ml-2 text-sm text-white/70">
                  Specific groups or employees
                </label>
              </div>

              {!appliesTo.includes("all") && (
                <div className="mt-3 pl-6">
                  <input
                    type="text"
                    value={appliesTo.join(", ")}
                    onChange={(e) =>
                      setAppliesTo(
                        e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    placeholder="dept_sales, team_executive, emp_123"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Enter IDs separated by commas (e.g., dept_sales, team_executive)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Policy
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
