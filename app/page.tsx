"use client"
import { Button } from "@/components/ui/button"
import { chat } from "@/lib/api-client"
import { nanoid } from "nanoid"

import { useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { UserMenu } from "@/components/user-menu"
import { ChatInput } from "@/components/chat-input"
import { ChatConversation } from "@/components/chat-conversation"
import { SettingsModal } from "@/components/settings-modal"
import { AskneuLogo } from "@/components/askneu-logo"

export default function HomePage() {
  const {
    chats,
    currentChatId,
    isLoading,
    addMessage,
    updateMessage,
    createNewChat,
    setCurrentChatId,
    setLoading,
    setError,
  } = useAppStore()

  const currentChat = chats.find((c) => c.id === currentChatId)

  const handleSend = async (message: string) => {
    try {
      setLoading(true)
      setError(null)

      if (!currentChatId) {
        createNewChat()
      }
      const chatId = currentChatId || chats[0]?.id
      if (!chatId) return

      // Add user message
      addMessage(chatId, { id: nanoid(), role: "user", content: message, timestamp: new Date() })

      // Create pending assistant message for loading state
      const assistantMessageId = nanoid()
      addMessage(
        chatId,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isLoading: true,
        },
      )

      // Make API call
      const response = await chat(message)
      if (
        response.answer.startsWith("Loi") ||
        response.answer.includes("Khong nhan duoc")
      ) {
        throw new Error(response.answer)
      }

      // Update assistant message with response
      updateMessage(chatId, assistantMessageId, {
        content: response.answer,
        sources: response.sources,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể nhận phản hồi từ AskNeu"
      setError(errorMessage)

      // Mark the last assistant message as errored
      const chatId = currentChatId || chats[0]?.id
      if (chatId) {
        const chat = chats.find((c) => c.id === chatId)
        const lastAssistantMessage = [...(chat?.messages || [])]
          .reverse()
          .find((m) => m.role === "assistant")
        if (lastAssistantMessage) {
          updateMessage(chatId, lastAssistantMessage.id, {
            isLoading: false,
            error: errorMessage,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async (messageId: string) => {
    const chatId = currentChatId
    if (!chatId) return

    const foundChat = chats.find((c) => c.id === chatId)
    if (!foundChat) return

    // Find the errored assistant message
    const erroredMessage = foundChat.messages.find((m) => m.id === messageId)
    if (!erroredMessage || erroredMessage.role !== "assistant" || !erroredMessage.error) return

    // Find the preceding user message
    const messageIndex = foundChat.messages.indexOf(erroredMessage)
    const userMessage = foundChat.messages
      .slice(0, messageIndex)
      .reverse()
      .find((m) => m.role === "user")

    if (!userMessage) return

    // Check retry count
    const retryCount = (erroredMessage.retryCount || 0) + 1
    if (retryCount > 3) {
      setError("Maximum retry attempts reached. Please try again later.")
      return
    }

    // Update the errored message to show loading state
    updateMessage(chatId, messageId, {
      error: undefined,
      isLoading: true,
      retryCount,
    })

    try {
      setLoading(true)
      setError(null)

      // Make API call
      const response = await chat(userMessage.content)

      updateMessage(chatId, messageId, {
        content: response.answer,
        sources: response.sources,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể nhận phản hồi"
      setError(errorMessage)
      updateMessage(chatId, messageId, {
        isLoading: false,
        error: errorMessage,
        retryCount,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-end gap-4 p-4">
          <UserMenu />
        </header>

        {/* Content */}
        {currentChat && currentChat.messages.length > 0 ? (
          // Conversation View
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <ChatConversation messages={currentChat.messages} onRetry={handleRetry} />
            </div>
            <div className="border-t bg-background p-4 space-y-2">
              <ChatInput onSend={handleSend} className="max-w-3xl mx-auto" isLoading={isLoading} />
              <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
                AskNeu có thể mắc lỗi, hãy kiểm tra kỹ các thông tin quan trọng.
              </p>
            </div>
          </div>
        ) : (
          // Initial Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-8 text-center">
              {/* Welcome Message */}
              <div className="flex items-center justify-center gap-3">
                <AskneuLogo size={40} />
                <h1 className="text-3xl font-semibold">
                  Bắt đầu với <span className="text-primary">AskNeu</span>
                </h1>
              </div>

              {/* Input Bar */}
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </div>
        )}
      </main>

      <SettingsModal />
    </div>
  )
}