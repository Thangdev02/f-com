"use client"

import { useState, useEffect } from "react"
import ReactCalendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { getSchedules, createSchedule, deleteSchedule } from "../services/api"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"

export default function Calendar({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [schedules, setSchedules] = useState([])
  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    title: "",
    description: "",
    time: "09:00",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setIsLoading(true)
      const data = await getSchedules()
      setSchedules(data)
    } catch (error) {
      console.error("Error loading schedules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSchedule = async () => {
    if (scheduleData.title.trim()) {
      const newSchedule = {
        title: scheduleData.title,
        description: scheduleData.description,
        time: scheduleData.time,
        date: selectedDate.toISOString().split("T")[0],
        userId: user.id,
        userName: user.name,
        createdAt: new Date().toISOString(),
      }
      try {
        const savedSchedule = await createSchedule(newSchedule)
        setSchedules([...schedules, savedSchedule])
        setScheduleData({ title: "", description: "", time: "09:00" })
        setShowCreateSchedule(false)
      } catch (error) {
        console.error("Error creating schedule:", error)
        alert("Lỗi khi tạo lịch")
      }
    }
  }

  const selectedDateSchedules = schedules.filter((s) => new Date(s.date).toDateString() === selectedDate.toDateString())

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id)
      setSchedules(schedules.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting schedule:", error)
      alert("Lỗi khi xóa lịch")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lịch Trống & Deadline</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 bg-white rounded-lg shadow-md p-4"
        >
          <ReactCalendar value={selectedDate} onChange={setSelectedDate} className="w-full" />
        </motion.div>

        {/* Schedule Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{selectedDate.toLocaleDateString("vi-VN")}</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCreateSchedule(true)}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <Plus size={20} />
              <span>Thêm Lịch</span>
            </motion.button>
          </div>

          {/* Create Schedule Form */}
          {showCreateSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-blue-50 rounded-lg p-4 border border-blue-200"
            >
              <h3 className="font-bold mb-3">Tạo Lịch Mới</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={scheduleData.title}
                  onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                  placeholder="Tiêu đề"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  value={scheduleData.description}
                  onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                  placeholder="Mô tả"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows="2"
                />
                <input
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCreateSchedule}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                  >
                    Tạo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowCreateSchedule(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Hủy
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Schedules List */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Đang tải lịch...</div>
            ) : selectedDateSchedules.length > 0 ? (
              selectedDateSchedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{schedule.title}</h3>
                      <p className="text-sm text-gray-600">{schedule.description}</p>
                      <p className="text-xs text-gray-500 mt-1">⏰ {schedule.time}</p>
                      <p className="text-xs text-gray-400 mt-1">Tạo bởi: {schedule.userName}</p>
                    </div>
                    {schedule.userId === user.id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">Không có lịch nào cho ngày này</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
