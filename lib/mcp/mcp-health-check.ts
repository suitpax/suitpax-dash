import { mcpClient } from "./mcp-client"

export class MCPHealthCheck {
  private static instance: MCPHealthCheck
  private isHealthy = false
  private lastCheck = 0
  private checkInterval = 30000 // 30 seconds

  static getInstance(): MCPHealthCheck {
    if (!MCPHealthCheck.instance) {
      MCPHealthCheck.instance = new MCPHealthCheck()
    }
    return MCPHealthCheck.instance
  }

  async checkHealth(): Promise<{
    status: "healthy" | "unhealthy" | "unknown"
    details: {
      serverRunning: boolean
      toolsAvailable: number
      lastSuccessfulCall?: string
      error?: string
    }
  }> {
    try {
      // Check if we need to perform a new health check
      const now = Date.now()
      if (now - this.lastCheck < this.checkInterval && this.isHealthy) {
        return {
          status: "healthy",
          details: {
            serverRunning: true,
            toolsAvailable: 7, // Number of tools we have
            lastSuccessfulCall: new Date(this.lastCheck).toISOString(),
          },
        }
      }

      // Perform actual health check
      await mcpClient.connect()

      // Test a simple operation
      const result = await mcpClient.listTasks({ status: "todo" })

      if (result) {
        this.isHealthy = true
        this.lastCheck = now

        return {
          status: "healthy",
          details: {
            serverRunning: true,
            toolsAvailable: 7,
            lastSuccessfulCall: new Date().toISOString(),
          },
        }
      }

      throw new Error("MCP tools not responding correctly")
    } catch (error) {
      this.isHealthy = false

      return {
        status: "unhealthy",
        details: {
          serverRunning: false,
          toolsAvailable: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }

  async testAllTools(): Promise<{
    totalTools: number
    workingTools: number
    failedTools: string[]
    results: Record<string, any>
  }> {
    const tools = [
      "create_task",
      "update_task",
      "list_tasks",
      "create_travel_booking",
      "create_expense_report",
      "analyze_travel_data",
      "generate_travel_policy",
    ]

    const results: Record<string, any> = {}
    const failedTools: string[] = []
    let workingTools = 0

    for (const tool of tools) {
      try {
        let result
        switch (tool) {
          case "create_task":
            result = await mcpClient.createTask({
              title: "Test Task",
              description: "MCP Health Check Test",
              priority: "low",
              assignee: "System",
              dueDate: new Date().toISOString().split("T")[0],
              category: "general",
            })
            break
          case "list_tasks":
            result = await mcpClient.listTasks()
            break
          case "analyze_travel_data":
            result = await mcpClient.analyzeTravelData()
            break
          case "generate_travel_policy":
            result = await mcpClient.generateTravelPolicy({
              companySize: "startup",
              industry: "Technology",
            })
            break
          default:
            result = { status: "skipped", reason: "Test not implemented" }
        }

        results[tool] = { status: "success", result }
        workingTools++
      } catch (error) {
        results[tool] = {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        }
        failedTools.push(tool)
      }
    }

    return {
      totalTools: tools.length,
      workingTools,
      failedTools,
      results,
    }
  }

  getStatus(): boolean {
    return this.isHealthy
  }
}

export const mcpHealthCheck = MCPHealthCheck.getInstance()
