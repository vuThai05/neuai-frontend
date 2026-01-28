"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Download, Eye, Trash2 } from "lucide-react"

export function DataManagementSettings() {
  const { chats, deleteAllChats } = useAppStore()
  const archivedChats = chats.filter((c) => c.archived)

  return (
    <div className="space-y-6">
      {/* Privacy Banner */}
      <div className="bg-primary/10 rounded-xl p-4">
        <p className="text-sm">
          Dữ liệu của bạn được bảo mật và an toàn. Bạn có toàn quyền kiểm soát lịch sử trò chuyện và có thể xuất hoặc xóa
          bất cứ lúc nào.
        </p>
      </div>

      {/* Archived Chats */}
      <div className="space-y-3">
        <h4 className="font-medium">Cuộc trò chuyện đã lưu trữ</h4>
        {archivedChats.length > 0 ? (
          <div className="space-y-2">
            {archivedChats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {chat.messages.length} messages · {chat.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Không có cuộc trò chuyện đã lưu trữ</p>
        )}
      </div>

      {/* Export Data */}
      <div className="space-y-3">
        <h4 className="font-medium">Xuất dữ liệu</h4>
        <p className="text-sm text-muted-foreground">
          Tải xuống tất cả dữ liệu trò chuyện của bạn để sử dụng cá nhân hoặc học thuật.
        </p>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất tất cả dữ liệu
        </Button>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h4 className="font-medium">Xóa dữ liệu trò chuyện</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Xóa vĩnh viễn lịch sử trò chuyện của bạn. Hành động này không thể hoàn tác.
        </p>

        {/* Warning box matching reference image style */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium text-destructive">Cảnh báo:</span>{" "}
            <span className="text-muted-foreground">
              Xóa dữ liệu của bạn là vĩnh viễn và không thể hoàn tác. Tất cả các cuộc trò chuyện, tệp đã tải lên và 
              tùy chọn của bạn sẽ bị xóa vĩnh viễn.
            </span>
          </p>
        </div>

        <Button
          onClick={() => {
            if (confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu trò chuyện? Hành động này không thể hoàn tác.")) {
              deleteAllChats()
            }
          }}
          className="bg-[#B90E0A] hover:bg-[#680C07] text-white"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tất cả dữ liệu trò chuyện
        </Button>
      </div>
    </div>
  )
}
