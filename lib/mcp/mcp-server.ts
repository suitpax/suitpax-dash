import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema, type CallToolResult } from "@modelcontextprotocol/sdk/types.js"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in-progress" | "completed"
  assignee: string
  dueDate: string
  category: "travel" | "expense" | "meeting" | "general"
  createdAt: string
  updatedAt: string
}

interface TravelBooking {
  id: string
  type: "flight" | "hotel" | "train" | "transfer"
  destination: string
  departure?: string
  departureDate: string
  returnDate?: string
  passengers: number
  class: string
  status: "pending" | "confirmed" | "cancelled"
  totalCost: number
  currency: string
}

interface ExpenseReport {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  category: string
  date: string
  status: "draft" | "submitted" | "approved" | "rejected"
  receipts: string[]
}

class SuitpaxMCPServer {
  private server: Server
  private tasks: Task[] = []
  private bookings: TravelBooking[] = []
  private expenses: ExpenseReport[] = []

  constructor() {
    this.server = new Server(
      {
        name: "suitpax-ai-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )

    this.setupToolHandlers()
    this.setupRequestHandlers()
  }

  private setupRequestHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_task",
            description: "Create a new task in the task management system",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Task title",
                },
                description: {
                  type: "string",
                  description: "Task description",
                },
                priority: {
                  type: "string",
                  enum: ["high", "medium", "low"],
                  description: "Task priority level",
                },
                assignee: {
                  type: "string",
                  description: "Person assigned to the task",
                },
                dueDate: {
                  type: "string",
                  description: "Due date in YYYY-MM-DD format",
                },
                category: {
                  type: "string",
                  enum: ["travel", "expense", "meeting", "general"],
                  description: "Task category",
                },
              },
              required: ["title", "description", "priority", "assignee", "dueDate", "category"],
            },
          },
          {
            name: "update_task",
            description: "Update an existing task",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "Task ID",
                },
                status: {
                  type: "string",
                  enum: ["todo", "in-progress", "completed"],
                  description: "New task status",
                },
                priority: {
                  type: "string",
                  enum: ["high", "medium", "low"],
                  description: "New task priority",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "list_tasks",
            description: "List all tasks with optional filtering",
            inputSchema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["todo", "in-progress", "completed"],
                  description: "Filter by status",
                },
                assignee: {
                  type: "string",
                  description: "Filter by assignee",
                },
                category: {
                  type: "string",
                  enum: ["travel", "expense", "meeting", "general"],
                  description: "Filter by category",
                },
              },
            },
          },
          {
            name: "create_travel_booking",
            description: "Create a new travel booking",
            inputSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["flight", "hotel", "train", "transfer"],
                  description: "Type of booking",
                },
                destination: {
                  type: "string",
                  description: "Destination city or location",
                },
                departure: {
                  type: "string",
                  description: "Departure city (for flights/trains)",
                },
                departureDate: {
                  type: "string",
                  description: "Departure date in YYYY-MM-DD format",
                },
                returnDate: {
                  type: "string",
                  description: "Return date in YYYY-MM-DD format",
                },
                passengers: {
                  type: "number",
                  description: "Number of passengers",
                },
                class: {
                  type: "string",
                  description: "Travel class (economy, business, first)",
                },
              },
              required: ["type", "destination", "departureDate", "passengers", "class"],
            },
          },
          {
            name: "create_expense_report",
            description: "Create a new expense report",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Expense report title",
                },
                description: {
                  type: "string",
                  description: "Expense description",
                },
                amount: {
                  type: "number",
                  description: "Expense amount",
                },
                currency: {
                  type: "string",
                  description: "Currency code (EUR, USD, etc.)",
                },
                category: {
                  type: "string",
                  description: "Expense category",
                },
                date: {
                  type: "string",
                  description: "Expense date in YYYY-MM-DD format",
                },
              },
              required: ["title", "description", "amount", "currency", "category", "date"],
            },
          },
          {
            name: "analyze_travel_data",
            description: "Analyze travel patterns and provide insights",
            inputSchema: {
              type: "object",
              properties: {
                period: {
                  type: "string",
                  description: "Analysis period (month, quarter, year)",
                },
                metric: {
                  type: "string",
                  description: "Metric to analyze (cost, frequency, destinations)",
                },
              },
            },
          },
          {
            name: "generate_travel_policy",
            description: "Generate travel policy recommendations",
            inputSchema: {
              type: "object",
              properties: {
                companySize: {
                  type: "string",
                  enum: ["startup", "small", "medium", "large", "enterprise"],
                  description: "Company size category",
                },
                industry: {
                  type: "string",
                  description: "Company industry",
                },
                budget: {
                  type: "number",
                  description: "Annual travel budget",
                },
              },
              required: ["companySize", "industry"],
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        let result: CallToolResult

        switch (name) {
          case "create_task":
            result = await this.createTask(args as any)
            break
          case "update_task":
            result = await this.updateTask(args as any)
            break
          case "list_tasks":
            result = await this.listTasks(args as any)
            break
          case "create_travel_booking":
            result = await this.createTravelBooking(args as any)
            break
          case "create_expense_report":
            result = await this.createExpenseReport(args as any)
            break
          case "analyze_travel_data":
            result = await this.analyzeTravelData(args as any)
            break
          case "generate_travel_policy":
            result = await this.generateTravelPolicy(args as any)
            break
          default:
            throw new Error(`Unknown tool: ${name}`)
        }

        return result
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        }
      }
    })
  }

  private setupToolHandlers() {
    // Tool handlers are set up in setupRequestHandlers
  }

  private async createTask(args: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    assignee: string
    dueDate: string
    category: "travel" | "expense" | "meeting" | "general"
  }): Promise<CallToolResult> {
    const task: Task = {
      id: `task_${Date.now()}`,
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: "todo",
      assignee: args.assignee,
      dueDate: args.dueDate,
      category: args.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.tasks.push(task)

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("suitpax_tasks", JSON.stringify(this.tasks))
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Task created successfully!\n\n**${task.title}**\n- ID: ${task.id}\n- Priority: ${task.priority}\n- Assignee: ${task.assignee}\n- Due: ${task.dueDate}\n- Category: ${task.category}\n\nThe task has been added to your Task Management page.`,
        },
      ],
    }
  }

  private async updateTask(args: {
    id: string
    status?: "todo" | "in-progress" | "completed"
    priority?: "high" | "medium" | "low"
  }): Promise<CallToolResult> {
    const taskIndex = this.tasks.findIndex((t) => t.id === args.id)
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${args.id} not found`)
    }

    const task = this.tasks[taskIndex]
    if (args.status) task.status = args.status
    if (args.priority) task.priority = args.priority
    task.updatedAt = new Date().toISOString()

    this.tasks[taskIndex] = task

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("suitpax_tasks", JSON.stringify(this.tasks))
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Task updated successfully!\n\n**${task.title}**\n- Status: ${task.status}\n- Priority: ${task.priority}\n- Updated: ${new Date(task.updatedAt).toLocaleString()}`,
        },
      ],
    }
  }

  private async listTasks(args: {
    status?: "todo" | "in-progress" | "completed"
    assignee?: string
    category?: "travel" | "expense" | "meeting" | "general"
  }): Promise<CallToolResult> {
    let filteredTasks = this.tasks

    if (args.status) {
      filteredTasks = filteredTasks.filter((t) => t.status === args.status)
    }
    if (args.assignee) {
      filteredTasks = filteredTasks.filter((t) => t.assignee.toLowerCase().includes(args.assignee!.toLowerCase()))
    }
    if (args.category) {
      filteredTasks = filteredTasks.filter((t) => t.category === args.category)
    }

    const taskList = filteredTasks
      .map(
        (task) =>
          `**${task.title}** (${task.id})\n- Status: ${task.status}\n- Priority: ${task.priority}\n- Assignee: ${task.assignee}\n- Due: ${task.dueDate}\n- Category: ${task.category}`,
      )
      .join("\n\n")

    return {
      content: [
        {
          type: "text",
          text: `📋 **Task List** (${filteredTasks.length} tasks)\n\n${taskList || "No tasks found matching the criteria."}`,
        },
      ],
    }
  }

  private async createTravelBooking(args: {
    type: "flight" | "hotel" | "train" | "transfer"
    destination: string
    departure?: string
    departureDate: string
    returnDate?: string
    passengers: number
    class: string
  }): Promise<CallToolResult> {
    const booking: TravelBooking = {
      id: `booking_${Date.now()}`,
      type: args.type,
      destination: args.destination,
      departure: args.departure,
      departureDate: args.departureDate,
      returnDate: args.returnDate,
      passengers: args.passengers,
      class: args.class,
      status: "pending",
      totalCost: 0, // Would be calculated based on real API
      currency: "EUR",
    }

    this.bookings.push(booking)

    return {
      content: [
        {
          type: "text",
          text: `✈️ **Travel Booking Created**\n\n- Type: ${booking.type}\n- Destination: ${booking.destination}\n${booking.departure ? `- Departure: ${booking.departure}\n` : ""}- Date: ${booking.departureDate}${booking.returnDate ? ` - ${booking.returnDate}` : ""}\n- Passengers: ${booking.passengers}\n- Class: ${booking.class}\n- Status: ${booking.status}\n\nBooking ID: ${booking.id}`,
        },
      ],
    }
  }

  private async createExpenseReport(args: {
    title: string
    description: string
    amount: number
    currency: string
    category: string
    date: string
  }): Promise<CallToolResult> {
    const expense: ExpenseReport = {
      id: `expense_${Date.now()}`,
      title: args.title,
      description: args.description,
      amount: args.amount,
      currency: args.currency,
      category: args.category,
      date: args.date,
      status: "draft",
      receipts: [],
    }

    this.expenses.push(expense)

    return {
      content: [
        {
          type: "text",
          text: `💰 **Expense Report Created**\n\n- Title: ${expense.title}\n- Amount: ${expense.amount} ${expense.currency}\n- Category: ${expense.category}\n- Date: ${expense.date}\n- Status: ${expense.status}\n\nExpense ID: ${expense.id}`,
        },
      ],
    }
  }

  private async analyzeTravelData(args: { period?: string; metric?: string }): Promise<CallToolResult> {
    const analysis = {
      totalBookings: this.bookings.length,
      totalExpenses: this.expenses.length,
      totalTasks: this.tasks.length,
      avgCostPerTrip: this.bookings.reduce((sum, b) => sum + b.totalCost, 0) / this.bookings.length || 0,
      topDestinations: this.getTopDestinations(),
      taskCompletionRate: this.getTaskCompletionRate(),
    }

    return {
      content: [
        {
          type: "text",
          text: `📊 **Travel Data Analysis**\n\n- Total Bookings: ${analysis.totalBookings}\n- Total Expenses: ${analysis.totalExpenses}\n- Total Tasks: ${analysis.totalTasks}\n- Avg Cost/Trip: €${analysis.avgCostPerTrip.toFixed(2)}\n- Task Completion: ${analysis.taskCompletionRate}%\n\n**Top Destinations:**\n${analysis.topDestinations.join("\n")}`,
        },
      ],
    }
  }

  private async generateTravelPolicy(args: {
    companySize: "startup" | "small" | "medium" | "large" | "enterprise"
    industry: string
    budget?: number
  }): Promise<CallToolResult> {
    const policies = {
      startup: {
        flightClass: "Economy only",
        hotelBudget: "€100-150/night",
        mealAllowance: "€50/day",
        approvalLimit: "€500",
      },
      small: {
        flightClass: "Economy, Business for 6+ hours",
        hotelBudget: "€150-200/night",
        mealAllowance: "€75/day",
        approvalLimit: "€1000",
      },
      medium: {
        flightClass: "Economy, Business for 4+ hours",
        hotelBudget: "€200-300/night",
        mealAllowance: "€100/day",
        approvalLimit: "€2000",
      },
      large: {
        flightClass: "Business for international",
        hotelBudget: "€300-400/night",
        mealAllowance: "€125/day",
        approvalLimit: "€5000",
      },
      enterprise: {
        flightClass: "Business/First class allowed",
        hotelBudget: "€400+/night",
        mealAllowance: "€150/day",
        approvalLimit: "€10000",
      },
    }

    const policy = policies[args.companySize]

    return {
      content: [
        {
          type: "text",
          text: `📋 **Travel Policy Recommendations**\n\n**Company:** ${args.companySize} ${args.industry} company\n${args.budget ? `**Budget:** €${args.budget.toLocaleString()}/year\n` : ""}\n**Flight Policy:** ${policy.flightClass}\n**Hotel Budget:** ${policy.hotelBudget}\n**Meal Allowance:** ${policy.mealAllowance}\n**Approval Limit:** ${policy.approvalLimit}\n\n*These recommendations are based on industry standards and company size.*`,
        },
      ],
    }
  }

  private getTopDestinations(): string[] {
    const destinations = this.bookings.reduce(
      (acc, booking) => {
        acc[booking.destination] = (acc[booking.destination] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(destinations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([dest, count]) => `- ${dest}: ${count} trips`)
  }

  private getTaskCompletionRate(): number {
    const completed = this.tasks.filter((t) => t.status === "completed").length
    return this.tasks.length > 0 ? Math.round((completed / this.tasks.length) * 100) : 0
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.log("Suitpax MCP Server running on stdio")
  }
}

export { SuitpaxMCPServer }
