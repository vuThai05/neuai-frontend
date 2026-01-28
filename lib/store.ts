import { create } from "zustand"
import { nanoid } from "nanoid"

export interface Source {
  text: string
  score: number
  dense_score: number
  link: string | null
}

export interface Source {
  text: string
  score: number
  dense_score: number
  link: string | null
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
  error?: string
  retryCount?: number
  sources?: Source[]
}

export interface Chat {
  id: string
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

  // Actions
  setCurrentChatId: (id: string | null) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSettingsOpen: (open: boolean) => void
  setSettingsTab: (tab: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  createNewChat: () => void
  addMessage: (chatId: string, message: Message) => void
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void
  deleteChat: (id: string) => void
  renameChat: (id: string, title: string) => void
  archiveChat: (id: string) => void
  deleteAllChats: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  chats: [
    {
      id: "1",
      title: "Giới thiệu về Giải tích",
      messages: [
        { id: "1", role: "user", content: "Bạn có thể giải thích đạo hàm không?", timestamp: new Date() },
        {
          id: "2",
          role: "assistant",
          content: "Đạo hàm đo tốc độ thay đổi của một hàm số...",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Nghiên cứu về Đạo đức AI",
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      title: "Luyện tập Vật lý",
      messages: [],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
  ],
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
  },

  addMessage: (chatId, message, messageId?: string) => {
    const newMessage: Message = {
      ...message,
      id: (message as any).id || messageId || Date.now().toString(),
      timestamp: (message as any).timestamp || new Date(),
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
                ? message.content.slice(0, 30) + "..."
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
