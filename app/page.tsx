"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowUp, Clock, Info, Menu, MessageSquare, Settings, Sparkles } from "lucide-react"
import { ModelSelector, models, type Model } from "./components/model-selector"

export default function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "http://localhost:8000/chat",
    body: {
      model: selectedModel.id,
    },
    headers: {
      "Content-Type": "application/json",
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const chatHistory = [
    { id: 1, title: "Travel recommendations for Japan", time: "2 hours ago" },
    { id: 2, title: "How to learn programming", time: "Yesterday" },
    { id: 3, title: "Recipe for chocolate cake", time: "3 days ago" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button - only visible on small screens */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent chatHistory={chatHistory} />
        </SheetContent>
      </Sheet>

      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-72 md:flex-col border-r">
        <SidebarContent chatHistory={chatHistory} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Model selector - centered and improved */}
        <div className="border-b p-4">
          <div className="max-w-3xl mx-auto flex justify-center items-center">
            <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <Sparkles className="h-12 w-12 mx-auto text-primary/50" />
                  <h2 className="text-2xl font-bold">Welcome to MuxChat</h2>
                  <p className="text-muted-foreground">
                    Chat with multiple AI models in one place. Select a model and start chatting!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="resize-none pr-12 min-h-[60px] max-h-[200px]"
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2"
                disabled={isLoading || !input.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex justify-center mt-2">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground flex gap-1">
                <Info className="h-3 w-3" />
                <span>Responses may not always be accurate</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ chatHistory }: { chatHistory: any[] }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          MuxChat
        </h1>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <h2 className="px-2 text-sm font-semibold mb-2">History</h2>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <Button key={chat.id} variant="ghost" className="w-full justify-start text-left px-2 py-1.5 h-auto">
                <div className="truncate flex-1">
                  <div className="truncate">{chat.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {chat.time}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">User</div>
              <div className="text-xs text-muted-foreground">user@example.com</div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

