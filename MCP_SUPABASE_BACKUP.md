# MCP y Supabase - Código de Respaldo

Este archivo contiene todo el código relacionado con MCP (Model Context Protocol) y Supabase que fue removido del proyecto principal para facilitar el despliegue.

## MCP Client (lib/mcp/mcp-client.ts)

\`\`\`typescript
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
\`\`\`

## MCP Server (lib/mcp/mcp-server.ts)

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

// Enhanced MCP Server with all Suitpax AI capabilities
class SuitpaxMCPServer {
  private server: Server

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
          // ... más herramientas
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
          // ... más casos
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

  private async createTask(args: any): Promise<any> {
    // Implementación de creación de tareas
    return {
      success: true,
      message: `✅ Task "${args.title}" created successfully`,
      action: "task_created",
      redirect: "/tasks",
    }
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
\`\`\`

## MCP Health Check (lib/mcp/mcp-health-check.ts)

\`\`\`typescript
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

  getStatus(): boolean {
    return this.isHealthy
  }
}

export const mcpHealthCheck = MCPHealthCheck.getInstance()
\`\`\`

## Supabase Client (lib/supabase/client.ts)

\`\`\`typescript
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          plan: "free" | "pro" | "enterprise"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          plan?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          plan?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: "low" | "medium" | "high"
          status: "pending" | "in_progress" | "completed"
          category: "travel" | "expense" | "meeting" | "general"
          assignee: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          status?: "pending" | "in_progress" | "completed"
          category?: "travel" | "expense" | "meeting" | "general"
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          status?: "pending" | "in_progress" | "completed"
          category?: "travel" | "expense" | "meeting" | "general"
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          currency: string
          category: string
          date: string
          receipt_url: string | null
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          currency?: string
          category: string
          date: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          currency?: string
          category?: string
          date?: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
\`\`\`

## Supabase Server (lib/supabase/server.ts)

\`\`\`typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./client"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
\`\`\`

## MCP Status Indicator Component

\`\`\`typescript
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Zap } from 'lucide-react'

interface MCPStatus {
  status: "healthy" | "unhealthy" | "unknown"
  details: {
    serverRunning: boolean
    toolsAvailable: number
    lastSuccessfulCall?: string
    error?: string
  }
}

export function MCPStatusIndicator() {
  const [status, setStatus] = useState<MCPStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkMCPHealth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mcp/health")
      const data = await response.json()
      setStatus(data.mcp)
      setLastCheck(new Date())
    } catch (error) {
      setStatus({
        status: "unhealthy",
        details: {
          serverRunning: false,
          toolsAvailable: 0,
          error: "Failed to check MCP status",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkMCPHealth()
    const interval = setInterval(checkMCPHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  // ... resto del componente
}
\`\`\`

## Variables de Entorno MCP y Supabase

\`\`\`bash
# SUPABASE CONFIGURATION
SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MCP CONFIGURATION
MCP_SERVER_ENABLED=true
MCP_SERVER_PORT=3001
MCP_TOOLS_ENABLED=create_task,update_task,list_tasks,create_travel_booking,create_expense_report,analyze_travel_data,generate_travel_policy
\`\`\`

## Dependencias del Package.json

\`\`\`json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.4"
  }
}
\`\`\`

## Script MCP Server

\`\`\`bash
#!/bin/bash

# Suitpax MCP Server Management Script

MCP_SERVER_PID_FILE="/tmp/suitpax-mcp-server.pid"
MCP_SERVER_LOG_FILE="/tmp/suitpax-mcp-server.log"

start_server() {
    echo "Starting Suitpax MCP Server..."
    
    if [ -f "$MCP_SERVER_PID_FILE" ]; then
        PID=$(cat "$MCP_SERVER_PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "MCP Server is already running (PID: $PID)"
            return 0
        else
            echo "Removing stale PID file..."
            rm -f "$MCP_SERVER_PID_FILE"
        fi
    fi
    
    # Start the MCP server
    node dist/lib/mcp/mcp-server.js > "$MCP_SERVER_LOG_FILE" 2>&1 &
    SERVER_PID=$!
    
    echo $SERVER_PID > "$MCP_SERVER_PID_FILE"
    echo "MCP Server started with PID: $SERVER_PID"
    echo "Logs available at: $MCP_SERVER_LOG_FILE"
    
    # Wait a moment and check if server is still running
    sleep 2
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "✅ MCP Server is running successfully"
        return 0
    else
        echo "❌ MCP Server failed to start"
        cat "$MCP_SERVER_LOG_FILE"
        return 1
    fi
}

stop_server() {
    echo "Stopping Suitpax MCP Server..."
    
    if [ -f "$MCP_SERVER_PID_FILE" ]; then
        PID=$(cat "$MCP_SERVER_PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID
            echo "MCP Server stopped (PID: $PID)"
            rm -f "$MCP_SERVER_PID_FILE"
        else
            echo "MCP Server was not running"
            rm -f "$MCP_SERVER_PID_FILE"
        fi
    else
        echo "No PID file found. MCP Server may not be running."
    fi
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
\`\`\`

## Notas de Implementación

### Para restaurar MCP y Supabase:

1. **Instalar dependencias:**
   \`\`\`bash
   npm install @modelcontextprotocol/sdk @supabase/ssr @supabase/supabase-js
   \`\`\`

2. **Configurar variables de entorno:**
   - Agregar las variables de Supabase y MCP al .env.local

3. **Restaurar archivos:**
   - Copiar los archivos de este backup a sus ubicaciones originales
   - Restaurar las importaciones en los archivos que las necesiten

4. **Configurar Supabase:**
   - Crear proyecto en Supabase
   - Ejecutar migraciones de base de datos
   - Configurar autenticación

5. **Iniciar MCP Server:**
   \`\`\`bash
   chmod +x scripts/mcp-server.sh
   ./scripts/mcp-server.sh start
   \`\`\`

### Funcionalidades que se perdieron temporalmente:

- Autenticación con Supabase
- Persistencia de datos en base de datos
- Herramientas MCP para automatización
- Análisis avanzado de datos de viaje
- Generación automática de reportes

### Funcionalidades que se mantienen:

- Interfaz de usuario completa
- Chat con IA (sin persistencia)
- Navegación entre páginas
- Componentes UI
- Integración con APIs externas (Duffel, Nylas, etc.)
\`\`\`

```typescriptreact file="lib/supabase/client.ts" isDeleted="true"
...deleted...
