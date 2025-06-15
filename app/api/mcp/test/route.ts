import { NextResponse } from "next/server"
import { mcpHealthCheck } from "@/lib/mcp/mcp-health-check"

export async function POST() {
  try {
    const testResults = await mcpHealthCheck.testAllTools()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      testResults,
      summary: {
        success: testResults.workingTools === testResults.totalTools,
        successRate: `${testResults.workingTools}/${testResults.totalTools}`,
        failedTools: testResults.failedTools,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Test failed",
        testResults: null,
      },
      { status: 500 },
    )
  }
}
