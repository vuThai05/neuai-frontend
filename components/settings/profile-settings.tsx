"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="name" className="shrink-0 w-32">
            Họ và tên
          </Label>
          <Input id="name" defaultValue="Nguyễn Tiến Sơn" className="flex-1" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="studentId" className="shrink-0 w-32">
            Mã sinh viên
          </Label>
          <Input id="studentId" defaultValue="11231234" className="flex-1" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="university" className="shrink-0 w-32">
            Trường
          </Label>
          <Input id="university" defaultValue="Đại học Kinh tế Quốc dân" className="flex-1" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="phone" className="shrink-0 w-32">
            Điện thoại
          </Label>
          <Input id="phone" defaultValue="+84 912 345 678" className="flex-1" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">Lưu thay đổi</Button>
      </div>

      <div className="pt-6 border-t border-border space-y-4">
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Đăng xuất
          </Button>
        </div>

        <div className="space-y-3 pt-4">
          <h4 className="font-medium text-destructive">Xóa tài khoản</h4>
          <p className="text-sm text-muted-foreground">
            Xóa tài khoản sẽ xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
          </p>
          <Button className="bg-[#B90E0A] hover:bg-[#680C07] text-white">Xóa tài khoản</Button>
        </div>
      </div>
    </div>
  )
}
