"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sun, Moon, Monitor } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const themes = [
  { id: "light", label: "Sáng", icon: Sun },
  { id: "dark", label: "Tối", icon: Moon },
  { id: "system", label: "Hệ thống", icon: Monitor },
]

export function GeneralSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h4 className="font-medium mb-4">Giao diện</h4>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                theme === t.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <t.icon className={cn("h-6 w-6", theme === t.id && "text-primary")} />
              <span className="text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <h4 className="font-medium mb-4">Ngôn ngữ & Khu vực</h4>
        <Select defaultValue="vi">
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Chọn ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Tùy chọn ngôn ngữ của bạn sẽ được đồng bộ trên tất cả các thiết bị.
        </p>
      </div>

      <Button className="mt-6">Lưu thay đổi</Button>

      {/* Eye Care Tip */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-1">Mẹo bảo vệ mắt</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nghỉ giải lao thường xuyên trong các buổi học dài để giảm mỏi mắt. Hãy áp dụng quy tắc 20-20-20:
              cứ 20 phút, nhìn vào một vật cách 20 feet (6 mét) trong 20 giây.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
