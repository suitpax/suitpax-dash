export type PolicyLevel = "company" | "department" | "team" | "employee"

export type PolicyCategory = "flights" | "hotels" | "transportation" | "meals" | "expenses" | "approvals"

export type PolicyStatus = "active" | "draft" | "archived"

export interface PolicyRule {
  id: string
  name: string
  description: string
  condition: string
  action: string
  priority: number
  isActive: boolean
}

export interface Policy {
  id: string
  name: string
  description: string
  level: PolicyLevel
  category: PolicyCategory
  status: PolicyStatus
  rules: PolicyRule[]
  appliesTo: string[] // IDs of entities this policy applies to
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

export interface PolicyTemplate {
  id: string
  name: string
  description: string
  category: PolicyCategory
  rules: Omit<PolicyRule, "id">[]
}
