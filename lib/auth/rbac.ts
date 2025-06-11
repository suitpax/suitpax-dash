// Role-based access control types and utilities

export type UserRole = "admin" | "travel_manager" | "finance_manager" | "team_member" | "guest"

export interface Permission {
  id: string
  name: string
  description: string
  requiredRoles: UserRole[]
}

// Define all available permissions in the system
export const PERMISSIONS: Record<string, Permission> = {
  VIEW_DASHBOARD: {
    id: "view_dashboard",
    name: "View Dashboard",
    description: "Access to main dashboard",
    requiredRoles: ["admin", "travel_manager", "finance_manager", "team_member", "guest"],
  },
  MANAGE_TEAM: {
    id: "manage_team",
    name: "Manage Team",
    description: "Add, edit, remove team members",
    requiredRoles: ["admin"],
  },
  APPROVE_EXPENSES: {
    id: "approve_expenses",
    name: "Approve Expenses",
    description: "Approve expense reports",
    requiredRoles: ["admin", "finance_manager", "travel_manager"],
  },
  BOOK_TRAVEL: {
    id: "book_travel",
    name: "Book Travel",
    description: "Book flights and accommodations",
    requiredRoles: ["admin", "travel_manager", "team_member"],
  },
  ACCESS_REPORTS: {
    id: "access_reports",
    name: "Access Reports",
    description: "View and export reports",
    requiredRoles: ["admin", "finance_manager", "travel_manager"],
  },
  MANAGE_BILLING: {
    id: "manage_billing",
    name: "Manage Billing",
    description: "Manage billing and payment information",
    requiredRoles: ["admin", "finance_manager"],
  },
  CONFIGURE_AI_AGENTS: {
    id: "configure_ai_agents",
    name: "Configure AI Agents",
    description: "Configure and customize AI travel agents",
    requiredRoles: ["admin", "travel_manager"],
  },
  VIEW_ANALYTICS: {
    id: "view_analytics",
    name: "View Analytics",
    description: "Access to analytics and reporting dashboards",
    requiredRoles: ["admin", "finance_manager", "travel_manager"],
  },
}

// Check if a user has a specific permission based on their role
export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  const permission = PERMISSIONS[permissionId]
  if (!permission) return false

  return permission.requiredRoles.includes(userRole)
}

// Get all permissions available for a specific role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return Object.values(PERMISSIONS).filter((permission) => permission.requiredRoles.includes(role))
}

// Get all permissions with their availability for a specific role
export function getPermissionsWithAvailability(role: UserRole): Array<Permission & { available: boolean }> {
  return Object.values(PERMISSIONS).map((permission) => ({
    ...permission,
    available: permission.requiredRoles.includes(role),
  }))
}
