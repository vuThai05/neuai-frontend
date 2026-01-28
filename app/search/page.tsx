"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { UserMenu } from "@/components/user-menu"
import { SettingsModal } from "@/components/settings-modal"
import { useAppStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, MoreHorizontal, Pencil, Trash2, Share2, Archive } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const { chats, setCurrentChatId, deleteChat, renameChat, archiveChat } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const activeChats = chats.filter((c) => !c.archived)

  const filteredChats = useMemo(() => {
    return activeChats.filter((chat) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = chat.title.toLowerCase().includes(query)
        const matchesContent = chat.messages.some((m) => m.content.toLowerCase().includes(query))
        if (!matchesTitle && !matchesContent) return false
      }

      // Filter by time
      const now = new Date()
      const chatDate = new Date(chat.createdAt)
      if (timeFilter === "today") {
        const isToday = chatDate.toDateString() === now.toDateString()
        if (!isToday) return false
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (chatDate < weekAgo) return false
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        if (chatDate < monthAgo) return false
      }

      return true
    })
  }, [activeChats, searchQuery, timeFilter])

  // Group chats by date
  const groupedChats = useMemo(() => {
    const groups: { [key: string]: typeof filteredChats } = {}
    const now = new Date()

    filteredChats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt)
      const isToday = chatDate.toDateString() === now.toDateString()
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const isYesterday = chatDate.toDateString() === yesterday.toDateString()

      let key = "Earlier"
      if (isToday) key = "Today"
      else if (isYesterday) key = "Yesterday"

      if (!groups[key]) groups[key] = []
      groups[key].push(chat)
    })

    return groups
  }, [filteredChats])

  const handleRename = (id: string) => {
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim())
    }
    setEditingChat(null)
    setEditTitle("")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-end p-4">
          <UserMenu />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-semibold">Lịch sử tìm kiếm</h1>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm lịch sử trò chuyện của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-xl bg-secondary border-transparent focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-36 h-11 text-base bg-secondary border-transparent hover:bg-sidebar-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chat History List */}
            <div className="space-y-6">
              {Object.entries(groupedChats).map(([group, groupChats]) => (
                <div key={group}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{group}</h3>
                  <div className="space-y-2">
                    {groupChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredChat(chat.id)}
                        onMouseLeave={() => setHoveredChat(null)}
                      >
                        {editingChat === chat.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleRename(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(chat.id)
                              if (e.key === "Escape") {
                                setEditingChat(null)
                                setEditTitle("")
                              }
                            }}
                            className="w-full p-4 rounded-xl bg-sidebar-accent text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-sidebar-accent transition-colors">
                            <button
                              onClick={() => {
                                setCurrentChatId(chat.id)
                                window.location.href = "/"
                              }}
                              className="flex-1 min-w-0 text-left"
                            >
                              <p className="font-medium truncate">{chat.title}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {chat.messages[0]?.content || "Không có tin nhắn"}
                              </p>
                            </button>
                            <span className="shrink-0 text-sm text-muted-foreground">
                              {new Date(chat.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-8 w-8 shrink-0 hover:bg-sidebar-accent transition-opacity",
                                    hoveredChat === chat.id ? "opacity-100" : "opacity-0",
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditTitle(chat.title)
                                    setEditingChat(chat.id)
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Đổi tên
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    archiveChat(chat.id)
                                  }}
                                >
                                  <Archive className="h-4 w-4 mr-2" />
                                  Lưu trữ
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Share functionality
                                  }}
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Chia sẻ
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteChat(chat.id)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredChats.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không tìm thấy cuộc trò chuyện nào phù hợp với tiêu chí của bạn</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SettingsModal />
    </div>
  )
}
