"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { Decision, Message } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AskneuLogo } from "./askneu-logo"
import { AlertCircle, Globe, RotateCcw, ShieldCheck } from "lucide-react"

interface ChatConversationProps {
  messages: Message[]
  onRetry?: (messageId: string) => void
}

export function ChatConversation({ messages, onRetry }: ChatConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="p-6 space-y-6">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}>
          {message.role === "assistant" && (
            <div className="shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <AskneuLogo size={20} />
              </div>
            </div>
          )}
          <div
            className={cn(
              "max-w-[70%] rounded-2xl px-4 py-3",
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
              message.error && "border border-destructive",
            )}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner className="h-4 w-4" />
                <span className="text-xs">Đang suy nghĩ...</span>
              </div>
            ) : message.error ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lỗi</p>
                    <p className="text-xs mt-1 opacity-90">{message.error}</p>
                  </div>
                </div>
                {onRetry && (message.retryCount || 0) < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(message.id)}
                    className="mt-2 h-7 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    Thử lại
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content || ""}</p>
            )}

            {message.role === "assistant" && message.decision && !message.isLoading && !message.error && (
              <DecisionBlock decision={message.decision} />
            )}

            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary-foreground/20">
                <p className="text-xs font-semibold mb-2 opacity-70">Nguồn tham khảo</p>
                <div className="space-y-2">
                  {message.sources.map((source, idx) => (
                    <div key={idx} className="text-xs bg-background/50 p-2 rounded border border-border/50">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium truncate">{source.title || "Internal source"}</p>
                        <span className="text-[10px] uppercase tracking-wide opacity-60">
                          {source.type}
                        </span>
                      </div>
                      <p className="opacity-90 line-clamp-2 italic">"{source.snippet}"</p>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mt-1 block"
                        >
                          Xem nguồn &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {message.role === "user" && (
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

function DecisionBlock({ decision }: { decision: Decision }) {
  const isInternal = decision.route === "RAG_ONLY"
  const Icon = isInternal ? ShieldCheck : Globe
  const label = isInternal ? "Nội bộ" : "Cần web (P0 chưa kích hoạt)"
  const variant = isInternal ? "secondary" : "outline"

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center gap-2">
        <Badge variant={variant} className="gap-1">
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
        <span className="text-[10px] opacity-60">
          confidence {(decision.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-[11px] opacity-70 leading-snug">{decision.reason}</p>
      {!isInternal && (
        <p className="text-[11px] opacity-80 leading-snug">
          Hệ thống đề xuất tra cứu thêm nguồn web cho câu hỏi này. Tính năng tìm kiếm web sẽ được kích hoạt ở giai đoạn tiếp theo.
        </p>
      )}
    </div>
  )
}
