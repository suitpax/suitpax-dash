import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Enhanced AI Agents System
const AI_AGENTS = {
  "travel-expert": {
    id: "travel-expert",
    name: "Travel Expert",
    specialty: "Flight & Hotel Booking",
    avatar: "/images/ai-agents/agent-1.jpg",
    systemPrompt: `You are the Travel Expert AI, specialized in flight and hotel bookings. You excel at:
- Finding the best flight deals and routes
- Recommending hotels based on business needs
- Optimizing travel itineraries
- Managing booking changes and cancellations
- Providing real-time travel updates

Always be proactive in suggesting alternatives and optimizations.`,
  },
  "expense-manager": {
    id: "expense-manager",
    name: "Expense Manager",
    specialty: "Financial Operations",
    avatar: "/images/ai-agents/agent-2.jpg",
    systemPrompt: `You are the Expense Manager AI, expert in financial operations. You specialize in:
- Tracking and categorizing expenses
- Processing receipts and invoices
- Budget analysis and reporting
- Cost optimization recommendations
- Compliance with expense policies

Focus on accuracy and cost-saving opportunities.`,
  },
  "policy-advisor": {
    id: "policy-advisor",
    name: "Policy Advisor",
    specialty: "Compliance & Guidelines",
    avatar: "/images/ai-agents/agent-3.jpg",
    systemPrompt: `You are the Policy Advisor AI, ensuring compliance and guidelines. You handle:
- Company travel policy compliance
- Approval workflow management
- Risk assessment and mitigation
- Regulatory compliance
- Policy recommendations

Always prioritize compliance and risk management.`,
  },
  "data-analyst": {
    id: "data-analyst",
    name: "Data Analyst",
    specialty: "Travel Intelligence",
    avatar: "/images/ai-agents/agent-4.jpg",
    systemPrompt: `You are the Data Analyst AI, providing travel intelligence. You excel at:
- Travel pattern analysis
- Cost trend reporting
- Performance metrics
- Predictive insights
- Data visualization recommendations

Focus on actionable insights and data-driven recommendations.`,
  },
}

const SUITPAX_MASTER_PROMPT = `You are part of Suitpax AI, the world's most advanced business travel intelligence platform created by Alberto (Founder & CEO).

🏢 SUITPAX COMPANY:
- Founded by: Alberto (Founder & CEO)
- Mission: AI-powered business travel revolution
- Domain: app.suitpax.com (authenticated users)
- Status: Leading global business travel platform

💰 SUITPAX PRICING (3 PLANS):
✅ Free: €0/month - Basic features, limited queries
✅ Pro: €74/month (€51/month annually with 20% discount) - Advanced features
✅ Enterprise: Custom pricing - Unlimited everything, dedicated support

🎯 CORE CAPABILITIES:
- Intelligent flight booking and management
- Smart hotel reservations with business preferences
- Automated expense tracking and reporting
- Real-time travel policy compliance
- Predictive travel insights and analytics
- Multi-agent AI collaboration
- Proactive travel optimization

🤖 AI AGENT COLLABORATION:
- Work seamlessly with other specialized AI agents
- Share context and insights across the platform
- Provide comprehensive solutions using collective intelligence
- Escalate complex queries to appropriate specialists

🎯 RESPONSE PROTOCOL:
1. **Understand Intent**: Analyze user needs deeply
2. **Provide Solutions**: Offer specific, actionable recommendations
3. **Guide Actions**: Direct users to relevant dashboard sections
4. **Be Proactive**: Suggest optimizations and improvements
5. **Collaborate**: Reference other agents when beneficial

RESPONSE STYLE:
- Professional yet conversational
- Specific and actionable advice
- Include relevant metrics when possible
- Provide clear next steps
- Reference dashboard navigation when helpful

PERSONALITY:
- Start responses naturally (Hey, Sure, Absolutely, etc.)
- Confident about platform capabilities
- Proactive with intelligent suggestions
- Solution-oriented approach
- Business-focused mindset

Remember: You're part of an intelligent multi-agent system helping users optimize their business travel experience on app.suitpax.com.`

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      conversationId,
      userProfile,
      plan = "pro",
      thinkingMode = false,
      selectedAgent,
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Select appropriate agent based on message content or user selection
    let activeAgent = AI_AGENTS["travel-expert"] // default

    if (selectedAgent && AI_AGENTS[selectedAgent]) {
      activeAgent = AI_AGENTS[selectedAgent]
    } else {
      // Auto-select agent based on message content
      const messageContent = message.toLowerCase()

      if (
        messageContent.includes("expense") ||
        messageContent.includes("cost") ||
        messageContent.includes("budget") ||
        messageContent.includes("receipt")
      ) {
        activeAgent = AI_AGENTS["expense-manager"]
      } else if (
        messageContent.includes("policy") ||
        messageContent.includes("compliance") ||
        messageContent.includes("approval") ||
        messageContent.includes("rule")
      ) {
        activeAgent = AI_AGENTS["policy-advisor"]
      } else if (
        messageContent.includes("data") ||
        messageContent.includes("report") ||
        messageContent.includes("analytics") ||
        messageContent.includes("trend")
      ) {
        activeAgent = AI_AGENTS["data-analyst"]
      }
    }

    // Enhanced prompt with agent specialization
    const enhancedPrompt = `${message}

USER CONTEXT:
- Plan: ${plan}
- Domain: app.suitpax.com
- Thinking Mode: ${thinkingMode ? "ON - Provide detailed analysis" : "OFF - Be concise"}
- Active Agent: ${activeAgent.name} (${activeAgent.specialty})

${userProfile?.name ? `Name: ${userProfile.name}` : ""}
${userProfile?.company ? `Company: ${userProfile.company}` : ""}

As the ${activeAgent.name}, provide specialized assistance based on your expertise. Be specific, actionable, and reference relevant dashboard features when helpful.`

    // Generate response with agent-specific system prompt
    const { text, usage } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: `${SUITPAX_MASTER_PROMPT}\n\n${activeAgent.systemPrompt}`,
      prompt: enhancedPrompt,
      temperature: thinkingMode ? 0.7 : 0.9,
      maxTokens: thinkingMode ? 1200 : 600,
    })

    // Simulate action execution for certain requests
    let actionExecuted = false
    let actionResult = null

    if (
      message.toLowerCase().includes("create") ||
      message.toLowerCase().includes("book") ||
      message.toLowerCase().includes("add")
    ) {
      actionExecuted = true
      actionResult = {
        type: "task_created",
        message: "Task created successfully",
        details: "Added to your dashboard",
      }
    }

    return NextResponse.json({
      response: text,
      selectedAgent: activeAgent,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      tokens: usage?.totalTokens || 0,
      cost: usage?.totalTokens ? (usage.totalTokens * 0.000015).toFixed(4) : "0.0001",
      plan,
      thinkingMode,
      actionExecuted,
      actionResult,
      capabilities: [
        "intelligent_booking",
        "expense_automation",
        "policy_compliance",
        "travel_analytics",
        "multi_agent_collaboration",
        "predictive_insights",
      ],
    })
  } catch (error) {
    console.error("Suitpax AI Error:", error)
    return NextResponse.json(
      {
        response: "I'm experiencing technical difficulties. Please try again in a moment!",
        selectedAgent: AI_AGENTS["travel-expert"],
        error: "Technical issue",
      },
      { status: 500 },
    )
  }
}
