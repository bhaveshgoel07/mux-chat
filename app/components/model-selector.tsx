import type React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MessageSquare, Sparkles, Star, Zap } from "lucide-react"

export type Model = {
  id: string
  name: string
  provider: string
  icon: React.ReactNode
  description?: string
}

interface ModelSelectorProps {
  selectedModel: Model
  onSelectModel: (model: Model) => void
}

export const models: Model[] = [
  {
    id: "auto",
    name: "Auto",
    provider: "Smart Select",
    icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
    description: "Automatically selects the best model for your query",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    icon: <Zap className="h-5 w-5 text-green-500" />,
    description: "Advanced reasoning and understanding",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5",
    provider: "Anthropic",
    icon: <Star className="h-5 w-5 text-purple-500" />,
    description: "Excellent for creative and nuanced responses",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    description: "Strong knowledge and reasoning capabilities",
  },
]

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-6 rounded-full border-2 min-w-[220px] bg-background shadow-sm hover:shadow-md transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">{selectedModel.icon}</div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-base">{selectedModel.name}</span>
              <span className="text-xs text-muted-foreground">{selectedModel.provider}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[280px]">
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onSelectModel(model)}
              className="flex items-center gap-3 cursor-pointer p-3 hover:bg-muted"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">{model.icon}</div>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
              {selectedModel.id === model.id && <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

