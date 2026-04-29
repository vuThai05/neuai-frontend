import { create } from "zustand"
import { nanoid } from "nanoid"

import {
  getConversation,
  listConversations,
  type BackendMessage,
  type ConversationSummary,
  type Decision,
  type Source,
} from "@/lib/api-client"

export type { Decision, Source } from "@/lib/api-client"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
  error?: string
  retryCount?: number
  sources?: Source[]
  decision?: Decision
}

export interface Chat {
  id: string
  conversationId?: string
  title: string
  messages: Message[]
  messagesLoaded?: boolean
  createdAt: Date
  updatedAt: Date
  archived?: boolean
}

interface AppState {
  chats: Chat[]
  currentChatId: string | null
  sidebarCollapsed: boolean
  settingsOpen: boolean
  settingsTab: string
  isLoading: boolean
  lastError: string | null
  conversationsLoaded: boolean

  setCurrentChatId: (id: string | null) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSettingsOpen: (open: boolean) => void
  setSettingsTab: (tab: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  createNewChat: () => string
  setConversationId: (chatId: string, conversationId: string) => void
  addMessage: (chatId: string, message: Message) => void
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void
  deleteChat: (id: string) => void
  renameChat: (id: string, title: string) => void
  archiveChat: (id: string) => void
  deleteAllChats: () => void
  loadConversations: () => Promise<void>
  loadConversationDetail: (chatId: string) => Promise<void>
}

function summaryToChat(summary: ConversationSummary): Chat {
  return {
    id: summary.id,
    conversationId: summary.id,
    title: summary.title || "Cuộc trò chuyện",
    messages: [],
    messagesLoaded: summary.message_count === 0,
    createdAt: new Date(summary.created_at),
    updatedAt: new Date(summary.updated_at),
  }
}

function backendMessageToMessage(msg: BackendMessage): Message {
  const result: Message = {
    id: msg.id,
    role: msg.type,
    content: msg.content,
    timestamp: new Date(msg.timestamp),
  }
  if (msg.refs && msg.refs.length > 0) {
    result.sources = msg.refs.map((ref) => ({
      type: (ref.type as Source["type"]) || "internal",
      title: ref.title || "",
      url: ref.url ?? null,
      snippet: ref.snippet || "",
      score: ref.score ?? 0,
    }))
  }
  if (msg.decision) {
    result.decision = {
      route: msg.decision.route as Decision["route"],
      reason_code: msg.decision.reason_code as Decision["reason_code"],
      reason: msg.decision.reason,
      confidence: msg.decision.confidence,
    }
  }
  return result
}

export const useAppStore = create<AppState>((set, get) => ({
  chats: [],
  currentChatId: null,
  sidebarCollapsed: false,
  settingsOpen: false,
  settingsTab: "general",
  isLoading: false,
  lastError: null,
  conversationsLoaded: false,

  setCurrentChatId: (id) => set({ currentChatId: id }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ lastError: error }),

  createNewChat: () => {
    const newChat: Chat = {
      id: nanoid(),
      title: "Cuộc trò chuyện mới",
      messages: [],
      messagesLoaded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
    }))
    return newChat.id
  },

  setConversationId: (chatId, conversationId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, conversationId } : chat,
      ),
    })),

  addMessage: (chatId, message) => {
    const newMessage: Message = {
      ...message,
      id: message.id || nanoid(),
      timestamp: message.timestamp || new Date(),
    }
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              messagesLoaded: true,
              updatedAt: new Date(),
              title:
                chat.messages.length === 0 && message.role === "user"
                  ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                  : chat.title,
            }
          : chat,
      ),
    }))
  },

  updateMessage: (chatId, messageId, updates) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg,
              ),
              updatedAt: new Date(),
            }
          : chat,
      ),
    }))
  },

  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
      currentChatId: state.currentChatId === id ? null : state.currentChatId,
    })),

  renameChat: (id, title) =>
    set((state) => ({
      chats: state.chats.map((chat) => (chat.id === id ? { ...chat, title } : chat)),
    })),

  archiveChat: (id) =>
    set((state) => ({
      chats: state.chats.map((chat) => (chat.id === id ? { ...chat, archived: true } : chat)),
    })),

  deleteAllChats: () => set({ chats: [], currentChatId: null }),

  loadConversations: async () => {
    try {
      const summaries = await listConversations()
      const fetched = summaries.map(summaryToChat)
      set((state) => {
        // Preserve any locally-created chats that haven't been persisted yet
        // (e.g. brand-new chat the user is currently typing into).
        const localOnly = state.chats.filter(
          (chat) => !chat.conversationId && chat.messages.length > 0,
        )
        const fetchedIds = new Set(fetched.map((c) => c.id))
        const merged = [
          ...localOnly,
          ...fetched.filter((c) => !state.chats.some((existing) => existing.id === c.id && existing.messages.length > 0)),
        ]
        // Keep ordering by updatedAt desc.
        merged.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        return {
          chats: merged.length > 0 ? merged : fetched,
          conversationsLoaded: true,
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tải danh sách hội thoại"
      set({ lastError: errorMessage, conversationsLoaded: true })
    }
  },

  loadConversationDetail: async (chatId) => {
    const state = get()
    const chat = state.chats.find((c) => c.id === chatId)
    if (!chat || !chat.conversationId || chat.messagesLoaded) {
      return
    }
    try {
      const detail = await getConversation(chat.conversationId)
      const messages = detail.messages.map(backendMessageToMessage)
      set((current) => ({
        chats: current.chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                title: detail.title || c.title,
                messages,
                messagesLoaded: true,
                createdAt: new Date(detail.created_at),
                updatedAt: new Date(detail.updated_at),
              }
            : c,
        ),
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tải nội dung hội thoại"
      set({ lastError: errorMessage })
    }
  },
}))
