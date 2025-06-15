import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { createClient } from "@/lib/supabase/server"

// Enhanced MCP Server with all Suitpax AI capabilities
class SuitpaxMCPServer {
  private server: Server
  private supabase: any

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

    this.supabase = createClient()
    this.setupToolHandlers()
  }

  private setupToolHandlers(): void {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_task",
            description: "Create a new task automatically from user input",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                priority: { type: "string", enum: ["low", "medium", "high"] },
                category: { type: "string" },
                due_date: { type: "string" },
                assignee: { type: "string" },
              },
              required: ["user_id", "title"],
            },
          },
          {
            name: "update_task",
            description: "Update task status and details",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                task_identifier: { type: "string" },
                status: { type: "string", enum: ["pending", "in_progress", "completed"] },
                updates: { type: "object" },
              },
              required: ["user_id", "task_identifier"],
            },
          },
          {
            name: "list_tasks",
            description: "List and filter tasks intelligently",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                filters: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    priority: { type: "string" },
                    category: { type: "string" },
                    date_range: { type: "object" },
                  },
                },
              },
              required: ["user_id"],
            },
          },
          {
            name: "create_travel_booking",
            description: "Create travel bookings automatically",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                type: { type: "string", enum: ["flight", "hotel", "car", "train"] },
                destination: { type: "string" },
                dates: { type: "object" },
                preferences: { type: "object" },
                budget: { type: "number" },
                travelers: { type: "number" },
              },
              required: ["user_id", "type", "destination"],
            },
          },
          {
            name: "create_expense_report",
            description: "Generate expense reports automatically",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                date_range: { type: "object" },
                categories: { type: "array", items: { type: "string" } },
                project: { type: "string" },
                format: { type: "string", enum: ["pdf", "excel", "csv"] },
              },
              required: ["user_id"],
            },
          },
          {
            name: "analyze_travel_data",
            description: "Analyze travel patterns and costs",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                analysis_type: { type: "string" },
                date_range: { type: "object" },
                metrics: { type: "array", items: { type: "string" } },
                filters: { type: "object" },
              },
              required: ["user_id", "analysis_type"],
            },
          },
          {
            name: "generate_travel_policy",
            description: "Create travel policies automatically",
            inputSchema: {
              type: "object",
              properties: {
                user_id: { type: "string" },
                policy_type: { type: "string" },
                company_size: { type: "string" },
                budget_limits: { type: "object" },
                compliance_requirements: { type: "array", items: { type: "string" } },
              },
              required: ["user_id", "policy_type"],
            },
          },
        ],
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        let result: any

        switch (name) {
          case "create_task":
            result = await this.createTask(args)
            break
          case "update_task":
            result = await this.updateTask(args)
            break
          case "list_tasks":
            result = await this.listTasks(args)
            break
          case "create_travel_booking":
            result = await this.createTravelBooking(args)
            break
          case "create_expense_report":
            result = await this.createExpenseReport(args)
            break
          case "analyze_travel_data":
            result = await this.analyzeTravelData(args)
            break
          case "generate_travel_policy":
            result = await this.generateTravelPolicy(args)
            break
          default:
            throw new Error(`Unknown tool: ${name}`)
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error.message,
                tool: name,
                timestamp: new Date().toISOString(),
              }),
            },
          ],
          isError: true,
        }
      }
    })
  }

  // Task Management Functions
  private async createTask(args: any): Promise<any> {
    const { data, error } = await this.supabase
      .from("tasks")
      .insert({
        user_id: args.user_id,
        title: args.title,
        description: args.description || "",
        priority: args.priority || "medium",
        category: args.category || "general",
        due_date: args.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        assignee: args.assignee || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(`Failed to create task: ${error.message}`)

    return {
      success: true,
      task: data[0],
      message: `✅ Task "${args.title}" created successfully`,
      action: "task_created",
      redirect: "/tasks",
    }
  }

  private async updateTask(args: any): Promise<any> {
    const { data, error } = await this.supabase
      .from("tasks")
      .update({
        status: args.status,
        updated_at: new Date().toISOString(),
        ...args.updates,
      })
      .eq("user_id", args.user_id)
      .eq("id", args.task_identifier)
      .select()

    if (error) throw new Error(`Failed to update task: ${error.message}`)

    return {
      success: true,
      task: data[0],
      message: `✅ Task updated to ${args.status}`,
      action: "task_updated",
      redirect: "/tasks",
    }
  }

  private async listTasks(args: any): Promise<any> {
    let query = this.supabase.from("tasks").select("*").eq("user_id", args.user_id)

    // Apply filters
    if (args.filters?.status) {
      query = query.eq("status", args.filters.status)
    }
    if (args.filters?.priority) {
      query = query.eq("priority", args.filters.priority)
    }
    if (args.filters?.category) {
      query = query.eq("category", args.filters.category)
    }
    if (args.filters?.date_range) {
      query = query.gte("due_date", args.filters.date_range.start).lte("due_date", args.filters.date_range.end)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw new Error(`Failed to list tasks: ${error.message}`)

    return {
      success: true,
      tasks: data,
      count: data.length,
      message: `📋 Found ${data.length} tasks`,
      action: "tasks_listed",
      redirect: "/tasks",
    }
  }

  // Travel Management Functions
  private async createTravelBooking(args: any): Promise<any> {
    const { data, error } = await this.supabase
      .from("travel_bookings")
      .insert({
        user_id: args.user_id,
        type: args.type,
        destination: args.destination,
        departure_date: args.dates?.departure,
        return_date: args.dates?.return,
        preferences: args.preferences || {},
        budget: args.budget,
        travelers: args.travelers || 1,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(`Failed to create booking: ${error.message}`)

    return {
      success: true,
      booking: data[0],
      message: `✈️ ${args.type} booking to ${args.destination} created`,
      action: "booking_created",
      redirect: "/flights",
    }
  }

  private async createExpenseReport(args: any): Promise<any> {
    // Get expenses for the date range
    let query = this.supabase.from("expenses").select("*").eq("user_id", args.user_id)

    if (args.date_range) {
      query = query.gte("date", args.date_range.start).lte("date", args.date_range.end)
    }

    if (args.categories && args.categories.length > 0 && !args.categories.includes("all")) {
      query = query.in("category", args.categories)
    }

    const { data: expenses, error } = await query.order("date", { ascending: false })

    if (error) throw new Error(`Failed to get expenses: ${error.message}`)

    // Calculate totals
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    // Create report record
    const { data: report, error: reportError } = await this.supabase
      .from("expense_reports")
      .insert({
        user_id: args.user_id,
        date_range: args.date_range,
        total_amount: totalAmount,
        category_totals: categoryTotals,
        expense_count: expenses.length,
        format: args.format || "pdf",
        project: args.project,
        status: "generated",
        created_at: new Date().toISOString(),
      })
      .select()

    if (reportError) throw new Error(`Failed to create report: ${reportError.message}`)

    return {
      success: true,
      report: report[0],
      expenses,
      summary: {
        total_amount: totalAmount,
        expense_count: expenses.length,
        category_totals: categoryTotals,
      },
      message: `💰 Expense report generated: €${totalAmount.toFixed(2)} (${expenses.length} expenses)`,
      action: "report_created",
      redirect: "/expenses",
    }
  }

  private async analyzeTravelData(args: any): Promise<any> {
    // Get travel data for analysis
    let expenseQuery = this.supabase.from("expenses").select("*").eq("user_id", args.user_id).eq("category", "travel")

    let bookingQuery = this.supabase.from("travel_bookings").select("*").eq("user_id", args.user_id)

    if (args.date_range) {
      expenseQuery = expenseQuery.gte("date", args.date_range.start).lte("date", args.date_range.end)
      bookingQuery = bookingQuery
        .gte("departure_date", args.date_range.start)
        .lte("departure_date", args.date_range.end)
    }

    const [{ data: expenses }, { data: bookings }] = await Promise.all([expenseQuery, bookingQuery])

    // Perform analysis
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const avgTripCost = bookings.length > 0 ? totalSpent / bookings.length : 0
    const topDestinations = bookings.reduce((acc, booking) => {
      acc[booking.destination] = (acc[booking.destination] || 0) + 1
      return acc
    }, {})

    const analysis = {
      total_spent: totalSpent,
      trip_count: bookings.length,
      avg_trip_cost: avgTripCost,
      top_destinations: Object.entries(topDestinations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      monthly_trend: this.calculateMonthlyTrend(expenses),
      cost_breakdown: this.calculateCostBreakdown(expenses),
      recommendations: this.generateRecommendations(totalSpent, bookings.length, avgTripCost),
    }

    return {
      success: true,
      analysis,
      message: `📊 Travel analysis: €${totalSpent.toFixed(2)} spent on ${bookings.length} trips`,
      action: "analysis_completed",
      redirect: "/dashboard",
    }
  }

  private async generateTravelPolicy(args: any): Promise<any> {
    const policyTemplate = this.createPolicyTemplate(args)

    const { data, error } = await this.supabase
      .from("travel_policies")
      .insert({
        user_id: args.user_id,
        policy_type: args.policy_type,
        company_size: args.company_size,
        budget_limits: args.budget_limits || {},
        compliance_requirements: args.compliance_requirements || [],
        policy_content: policyTemplate,
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(`Failed to create policy: ${error.message}`)

    return {
      success: true,
      policy: data[0],
      content: policyTemplate,
      message: `📜 Travel policy created for ${args.company_size} company`,
      action: "policy_created",
      redirect: "/travel-policy",
    }
  }

  // Helper functions
  private calculateMonthlyTrend(expenses: any[]): any[] {
    const monthlyData = expenses.reduce((acc, expense) => {
      const month = expense.date.substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {})

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }))
  }

  private calculateCostBreakdown(expenses: any[]): any {
    return expenses.reduce((acc, expense) => {
      const category = expense.category || "other"
      acc[category] = (acc[category] || 0) + expense.amount
      return acc
    }, {})
  }

  private generateRecommendations(totalSpent: number, tripCount: number, avgTripCost: number): string[] {
    const recommendations = []

    if (avgTripCost > 2000) {
      recommendations.push("Consider booking flights in advance to reduce costs")
      recommendations.push("Look for alternative accommodations to lower expenses")
    }

    if (tripCount > 10) {
      recommendations.push("Negotiate corporate rates with preferred hotels")
      recommendations.push("Consider a travel management company for better rates")
    }

    if (totalSpent > 50000) {
      recommendations.push("Implement stricter approval processes for high-cost trips")
      recommendations.push("Review travel policy limits and guidelines")
    }

    recommendations.push("Track expenses in real-time for better budget control")
    recommendations.push("Use Suitpax AI for automated expense categorization")

    return recommendations
  }

  private createPolicyTemplate(args: any): string {
    const { policy_type, company_size, budget_limits, compliance_requirements } = args

    let template = `# ${policy_type.replace("_", " ").toUpperCase()} POLICY\n\n`

    template += `## Company Size: ${company_size}\n\n`

    template += `## Budget Limits:\n`
    if (budget_limits?.daily) {
      template += `- Daily limit: €${budget_limits.daily}\n`
    }
    if (budget_limits?.monthly) {
      template += `- Monthly limit: €${budget_limits.monthly}\n`
    }

    template += `\n## Compliance Requirements:\n`
    compliance_requirements.forEach((req: string) => {
      template += `- ${req.replace("_", " ")}\n`
    })

    template += `\n## Approval Process:\n`
    template += `- All expenses above €500 require manager approval\n`
    template += `- International travel requires advance approval\n`
    template += `- Receipts must be submitted within 30 days\n`

    template += `\n## Preferred Vendors:\n`
    template += `- Use Suitpax platform for all bookings\n`
    template += `- Corporate rates available through approved vendors\n`

    return template
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.log("🚀 Suitpax MCP Server running with 7 powerful tools")
  }
}

// Start the server
const server = new SuitpaxMCPServer()
server.run().catch(console.error)
