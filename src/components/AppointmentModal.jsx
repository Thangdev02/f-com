"use client"

import { useState } from "react"
import { createAppointment } from "../services/api"
import { motion } from "framer-motion"

export default function AppointmentModal({ forumId, creatorId, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  })
  const [loading, setLoading] = useState(false)

  const handleCreateAppointment = async () => {
    if (!form.title || !form.date) return
    setLoading(true)
    try {
      await createAppointment({
        forumId: String(forumId),
        creatorId: String(creatorId),
        title: form.title,
        description: form.description,
        date: form.date, // YYYY-MM-DD
        time: form.time, // HH:mm (optional)
        participants: [], // sẽ thêm khi thành viên bấm Tham gia
        createdAt: new Date().toISOString(),
      })
      onCreated?.()
    } catch (err) {
      console.error("Error creating appointment:", err)
      alert("Tạo lịch hẹn thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tạo lịch hẹn</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <input
              className="w-full px-3 py-2 rounded-lg border"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Họp nhóm đồ án"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Nội dung cuộc hẹn..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
              <input
                type="time"
                className="w-full px-3 py-2 rounded-lg border"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            Hủy
          </button>
          <button
            onClick={handleCreateAppointment}
            disabled={loading || !form.title || !form.date}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Tạo lịch hẹn"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
