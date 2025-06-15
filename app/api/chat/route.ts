import { Configuration, OpenAIApi } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Optional, but recommended: run on the edge to support streaming
export const runtime = "edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const systemPrompt = `You are Suitpax AI, a professional business travel and expense management assistant.

RESPONSE STYLE:
- Be direct, concise, and professional
- Provide actionable information immediately
- Use bullet points for clarity when listing options
- Keep responses under 150 words unless detailed analysis is requested
- Focus on practical solutions over explanations

CAPABILITIES:
- Flight and hotel booking assistance
- Expense tracking and management
- Travel policy compliance
- Business travel optimization
- Real-time travel updates

RESPONSE FORMAT:
- Start with the direct answer
- Follow with 2-3 key action items if applicable
- End with a brief next step suggestion

Example: "I found 3 flights from Madrid to London for Dec 20th:
• BA 458: €245, departs 9:15 AM
• IB 3170: €189, departs 2:30 PM  
• VY 7822: €156, departs 6:45 PM

Would you like me to check availability or compare hotel options near your destination?"

Keep responses professional, efficient, and focused on business travel needs.`

export async function POST(req: Request): Promise<Response> {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json()

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
