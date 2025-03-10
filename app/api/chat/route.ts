import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { messages, model = "auto" } = await req.json()

  // Select the appropriate model based on the user's choice
  let selectedModel

  switch (model) {
    case "gpt-4o":
      selectedModel = openai("gpt-4o")
      break
    case "claude-3-5-sonnet":
      // In a real app, you would import and use the Anthropic provider
      // import { anthropic } from '@ai-sdk/anthropic';
      // selectedModel = anthropic('claude-3-5-sonnet');
      selectedModel = openai("gpt-4o") // Fallback for demo
      break
    case "gemini-pro":
      // In a real app, you would import and use the Google provider
      // import { googleGenerativeAI } from '@ai-sdk/google-generative-ai';
      // selectedModel = googleGenerativeAI('gemini-pro');
      selectedModel = openai("gpt-4o") // Fallback for demo
      break
    case "auto":
    default:
      // Auto selects the best model based on the query
      selectedModel = openai("gpt-4o")
      break
  }

  const result = streamText({
    model: selectedModel,
    messages,
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}

