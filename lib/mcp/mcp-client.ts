import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

export class MCPClient {
  private client: Client | null = null
  private transport: StdioClientTransport | null = null
  private isConnected = false

  async connect(): Promise<void> {
    try {
      // Create transport for MCP server
      this.transport = new StdioClientTransport({
        command: "node",
        args: ["dist/lib/mcp/mcp-server.js"],
        env: process.env,
      })

      // Create client
      this.client = new Client(
        {
          name: "suitpax-ai-client",
          version: "1.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        },
      )

      // Connect to server
      await this.client.connect(this.transport)
      this.isConnected = true

      console.log("✅ MCP Client connected successfully")
    } catch (error) {
      console.error("❌ MCP Client connection failed:", error)
      this.isConnected = false
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
    if (this.transport) {
      await this.transport.close()
      this.transport = null
    }
    this.isConnected = false
  }

  async callTool(name: string, arguments_: any): Promise<any> {
    if (!this.isConnected || !this.client) {
      await this.connect()
    }

    try {
      const result = await this.client!.callTool({
        name,
        arguments: arguments_,
      })

      console.log(`✅ MCP Tool ${name} executed successfully:`, result)
      return result
    } catch (error) {
      console.error(`❌ MCP Tool ${name} failed:`, error)
      throw error
    }
  }

  async listTools(): Promise<any[]> {
    if (!this.isConnected || !this.client) {
      await this.connect()
    }

    try {
      const result = await this.client!.listTools()
      return result.tools || []
    } catch (error) {
      console.error("❌ Failed to list MCP tools:", error)
      return []
    }
  }

  async getToolInfo(name: string): Promise<any> {
    const tools = await this.listTools()
    return tools.find((tool) => tool.name === name)
  }

  isClientConnected(): boolean {
    return this.isConnected
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect()
      }

      const tools = await this.listTools()
      return tools.length > 0
    } catch (error) {
      console.error("❌ MCP Health check failed:", error)
      return false
    }
  }
}

// Singleton instance
let mcpClientInstance: MCPClient | null = null

export function getMCPClient(): MCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient()
  }
  return mcpClientInstance
}
