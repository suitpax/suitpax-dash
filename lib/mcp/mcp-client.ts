import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

class SuitpaxMCPClient {
  private client: Client
  private transport: StdioClientTransport | null = null

  constructor() {
    this.client = new Client(
      {
        name: "suitpax-ai-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    )
  }

  async connect() {
    if (this.transport) {
      return
    }

    this.transport = new StdioClientTransport({
      command: "node",
      args: ["dist/lib/mcp/mcp-server.js"],
    })

    await this.client.connect(this.transport)
  }

  async disconnect() {
    if (this.transport) {
      await this.client.close()
      this.transport = null
    }
  }

  async createTask(taskData: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    assignee: string
    dueDate: string
    category: "travel" | "expense" | "meeting" | "general"
  }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "create_task",
      arguments: taskData,
    })

    return result
  }

  async updateTask(taskId: string, updates: { status?: string; priority?: string }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "update_task",
      arguments: {
        id: taskId,
        ...updates,
      },
    })

    return result
  }

  async listTasks(filters?: { status?: string; assignee?: string; category?: string }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "list_tasks",
      arguments: filters || {},
    })

    return result
  }

  async createTravelBooking(bookingData: {
    type: "flight" | "hotel" | "train" | "transfer"
    destination: string
    departure?: string
    departureDate: string
    returnDate?: string
    passengers: number
    class: string
  }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "create_travel_booking",
      arguments: bookingData,
    })

    return result
  }

  async createExpenseReport(expenseData: {
    title: string
    description: string
    amount: number
    currency: string
    category: string
    date: string
  }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "create_expense_report",
      arguments: expenseData,
    })

    return result
  }

  async analyzeTravelData(options?: { period?: string; metric?: string }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "analyze_travel_data",
      arguments: options || {},
    })

    return result
  }

  async generateTravelPolicy(policyData: {
    companySize: "startup" | "small" | "medium" | "large" | "enterprise"
    industry: string
    budget?: number
  }) {
    await this.connect()

    const result = await this.client.callTool({
      name: "generate_travel_policy",
      arguments: policyData,
    })

    return result
  }
}

export const mcpClient = new SuitpaxMCPClient()
