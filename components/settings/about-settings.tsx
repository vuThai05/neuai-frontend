"use client"

import { PegasusLogo } from "../pegasus-logo"
import { GraduationCap, BookOpen, FileQuestion, Upload } from "lucide-react"

const features = [
  { icon: GraduationCap, label: "Hỗ trợ học tập" },
  { icon: BookOpen, label: "Hỗ trợ nghiên cứu" },
  { icon: FileQuestion, label: "Trả lời câu hỏi" },
  { icon: Upload, label: "Tải lên tệp & hình ảnh" },
]

export function AboutSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <PegasusLogo size={48} />
        <div>
          <h3 className="font-semibold text-lg">PegaSus</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        PegaSus là trợ lý học tập được hỗ trợ bởi AI, được thiết kế dành riêng cho sinh viên. 
        PegaSus giúp bạn hiểu các khái niệm phức tạp, tiến hành nghiên cứu hiệu quả và chuẩn bị cho kỳ thi.
      </p>

      {/* Features */}
      <div>
        <h4 className="font-medium mb-3">Tính năng</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <feature.icon className="h-4 w-4 text-primary" />
              {feature.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Quản trị hệ thống</h4>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Tổ chức:</span> Đại học Kinh tế Quốc dân
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> 12345678@st.neu.edu.vn
          </p>
          <p>
            <span className="text-muted-foreground">Hỗ trợ:</span> supports.neu.edu.vn
          </p>
        </div>
      </div>
    </div>
  )
}
