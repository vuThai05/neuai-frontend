import { create } from "zustand"
import { nanoid } from "nanoid"

import type { Decision, Source } from "@/lib/api-client"

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
}

export const useAppStore = create<AppState>((set) => ({
  chats: [],
  currentChatId: null,
  sidebarCollapsed: false,
  settingsOpen: false,
  settingsTab: "general",
  isLoading: false,
  lastError: null,

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
}))
