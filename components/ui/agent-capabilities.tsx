import type { AIAgent } from "@/lib/ai-agents/agent-service"
import { Zap, Brain, Thermometer, Calendar, MessageSquare, CheckCircle2 } from "lucide-react"

interface AgentCapabilitiesProps {
  agent: AIAgent
}

export default function AgentCapabilities({ agent }: AgentCapabilitiesProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Capabilities</h3>
        <ul className="space-y-2">
          {agent.capabilities.map((capability, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-black mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600">{capability}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Technical Specifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Model</span>
            </div>
            <span className="text-xs font-medium text-black">{agent.model}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Temperature</span>
            </div>
            <span className="text-xs font-medium text-black">{agent.temperature}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Context Window</span>
            </div>
            <span className="text-xs font-medium text-black">{agent.contextWindow.toLocaleString()} tokens</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Knowledge Cutoff</span>
            </div>
            <span className="text-xs font-medium text-black">{agent.knowledgeCutoff}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Tokens Used</span>
            </div>
            <span className="text-xs font-medium text-black">{agent.tokensUsed.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">System Prompt</h3>
        <p className="text-xs text-gray-600 whitespace-pre-wrap">{agent.systemPrompt}</p>
      </div>
    </div>
  )
}
