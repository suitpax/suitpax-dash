"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Zap } from "lucide-react"

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
      // Simulate MCP health check for now
      // In production, this would call /api/mcp/health
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus({
        status: "unhealthy",
        details: {
          serverRunning: false,
          toolsAvailable: 0,
          error: "MCP server not configured",
        },
      })
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

  const runMCPTest = async () => {
    setIsLoading(true)
    try {
      // Simulate MCP test for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("MCP Test: Server not configured")
      await checkMCPHealth()
    } catch (error) {
      console.error("MCP Test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkMCPHealth()
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkMCPHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-3 w-3 animate-spin text-white/50" />

    switch (status?.status) {
      case "healthy":
        return <CheckCircle className="h-3 w-3 text-green-400" />
      case "unhealthy":
        return <XCircle className="h-3 w-3 text-red-400" />
      default:
        return <AlertCircle className="h-3 w-3 text-yellow-400" />
    }
  }

  const getStatusColor = () => {
    switch (status?.status) {
      case "healthy":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "unhealthy":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }
  }

  const getStatusText = () => {
    if (isLoading) return "Checking..."

    switch (status?.status) {
      case "healthy":
        return `MCP Active (${status.details.toolsAvailable} tools)`
      case "unhealthy":
        return "MCP Offline"
      default:
        return "MCP Unknown"
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge className={`${getStatusColor()} text-xs px-2 py-1 rounded-full border`}>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <span className="hidden sm:inline">{getStatusText()}</span>
          <span className="sm:hidden">MCP</span>
        </div>
      </Badge>

      <div className="flex items-center space-x-1">
        <Button
          onClick={checkMCPHealth}
          disabled={isLoading}
          size="sm"
          className="bg-transparent hover:bg-white/10 h-6 w-6 p-0 rounded-full text-white/70 hover:text-white"
          title="Refresh MCP Status"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <Button
          onClick={runMCPTest}
          disabled={isLoading}
          size="sm"
          className="bg-transparent hover:bg-white/10 h-6 w-6 p-0 rounded-full text-white/70 hover:text-white"
          title="Test MCP Tools"
        >
          <Zap className="h-3 w-3" />
        </Button>
      </div>

      {lastCheck && <span className="hidden lg:inline text-xs text-white/50">{lastCheck.toLocaleTimeString()}</span>}

      {status?.details.error && (
        <div className="hidden xl:block text-xs text-red-400 max-w-xs truncate" title={status.details.error}>
          Error: {status.details.error}
        </div>
      )}
    </div>
  )
}
