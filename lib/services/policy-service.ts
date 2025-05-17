import type { Policy, PolicyTemplate } from "@/types/policy"

// Esta función simula la obtención de políticas desde una API
export async function getPolicies(): Promise<Policy[]> {
  // En un entorno real, esto sería una llamada a la API
  return [
    {
      id: "pol_1",
      name: "Standard Business Travel Policy",
      description: "Default policy for all business travel",
      level: "company",
      category: "flights",
      status: "active",
      rules: [
        {
          id: "rule_1",
          name: "Economy Class for Short Flights",
          description: "Flights under 6 hours must be booked in economy class",
          condition: 'flight.duration < 6 && flight.type != "emergency"',
          action: "RESTRICT_TO_ECONOMY",
          priority: 1,
          isActive: true,
        },
        {
          id: "rule_2",
          name: "Business Class for Long Flights",
          description: "Flights over 6 hours may be booked in business class for director level and above",
          condition: 'flight.duration >= 6 && employee.level >= "director"',
          action: "ALLOW_BUSINESS_CLASS",
          priority: 2,
          isActive: true,
        },
      ],
      appliesTo: ["all"],
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-05-20T00:00:00Z",
      createdBy: "admin",
      version: 1,
    },
    {
      id: "pol_2",
      name: "Executive Travel Policy",
      description: "Policy for executive team members",
      level: "team",
      category: "hotels",
      status: "active",
      rules: [
        {
          id: "rule_3",
          name: "Premium Hotels Allowed",
          description: "Executives may book 5-star hotels",
          condition: 'employee.team == "executive"',
          action: "ALLOW_PREMIUM_HOTELS",
          priority: 1,
          isActive: true,
        },
      ],
      appliesTo: ["team_executive"],
      createdAt: "2023-02-10T00:00:00Z",
      updatedAt: "2023-02-10T00:00:00Z",
      createdBy: "admin",
      version: 1,
    },
    {
      id: "pol_3",
      name: "Sales Team Expense Policy",
      description: "Special expense policy for the sales team",
      level: "department",
      category: "expenses",
      status: "active",
      rules: [
        {
          id: "rule_4",
          name: "Higher Meal Allowance",
          description: "Sales team members get higher meal allowance for client dinners",
          condition: 'expense.type == "meal" && expense.withClient == true',
          action: "INCREASE_LIMIT_BY_50_PERCENT",
          priority: 1,
          isActive: true,
        },
      ],
      appliesTo: ["dept_sales"],
      createdAt: "2023-03-05T00:00:00Z",
      updatedAt: "2023-06-15T00:00:00Z",
      createdBy: "sales_director",
      version: 2,
    },
  ]
}

export async function getPolicyTemplates(): Promise<PolicyTemplate[]> {
  return [
    {
      id: "template_1",
      name: "Standard Travel Policy",
      description: "A balanced policy suitable for most companies",
      category: "flights",
      rules: [
        {
          name: "Economy for Short Flights",
          description: "All flights under 6 hours must be in economy class",
          condition: "flight.duration < 6",
          action: "RESTRICT_TO_ECONOMY",
          priority: 1,
          isActive: true,
        },
        {
          name: "Advance Booking Required",
          description: "Flights must be booked at least 14 days in advance",
          condition: "booking.advanceDays < 14 && !flight.isEmergency",
          action: "REQUIRE_APPROVAL",
          priority: 2,
          isActive: true,
        },
      ],
    },
    {
      id: "template_2",
      name: "Economy Hotel Policy",
      description: "Cost-saving hotel policy for budget-conscious companies",
      category: "hotels",
      rules: [
        {
          name: "Maximum Hotel Rate",
          description: "Hotel rates must not exceed $200 per night",
          condition: "hotel.nightlyRate > 200",
          action: "REQUIRE_APPROVAL",
          priority: 1,
          isActive: true,
        },
        {
          name: "Preferred Hotels Only",
          description: "Bookings should be made with preferred hotel partners",
          condition: "!hotel.isPreferred",
          action: "WARN_USER",
          priority: 2,
          isActive: true,
        },
      ],
    },
    {
      id: "template_3",
      name: "Standard Expense Policy",
      description: "Balanced expense policy with reasonable limits",
      category: "expenses",
      rules: [
        {
          name: "Meal Expense Limit",
          description: "Meals should not exceed $75 per day",
          condition: 'expense.category == "meal" && expense.dailyTotal > 75',
          action: "REQUIRE_APPROVAL",
          priority: 1,
          isActive: true,
        },
        {
          name: "Receipt Required",
          description: "Receipts required for expenses over $25",
          condition: "expense.amount > 25 && !expense.hasReceipt",
          action: "BLOCK_SUBMISSION",
          priority: 1,
          isActive: true,
        },
      ],
    },
  ]
}

export async function createPolicy(policy: Omit<Policy, "id" | "createdAt" | "updatedAt">): Promise<Policy> {
  // En un entorno real, esto sería una llamada a la API
  const newPolicy: Policy = {
    ...policy,
    id: `pol_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return newPolicy
}

export async function updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
  // En un entorno real, esto sería una llamada a la API
  const policy = (await getPolicies()).find((p) => p.id === id)

  if (!policy) {
    throw new Error(`Policy with ID ${id} not found`)
  }

  const updatedPolicy: Policy = {
    ...policy,
    ...updates,
    updatedAt: new Date().toISOString(),
    version: policy.version + 1,
  }

  return updatedPolicy
}

export async function deletePolicy(id: string): Promise<void> {
  // En un entorno real, esto sería una llamada a la API
  console.log(`Deleting policy with ID ${id}`)
}
