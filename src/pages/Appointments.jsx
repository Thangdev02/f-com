"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { getAppointments } from "../services/api"

export default function Appointments({ user }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments()
        // lọc ra lịch hẹn mà user có tham gia
        const userAppointments = data.filter(
          (a) =>
            a.creatorId === user.id ||
            a.participants?.some((p) => p.userId === user.id)
        )
        setAppointments(userAppointments)
      } catch (err) {
        console.error("Error fetching appointments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user.id])

  if (loading) return <div className="p-4 text-gray-500">Đang tải...</div>

  if (appointments.length === 0)
    return <div className="p-4 text-gray-500">Chưa có lịch hẹn nào.</div>

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="text-red-500" /> Lịch hẹn của bạn
      </h2>

      <div className="grid gap-4">
        {appointments.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
          >
            <h3 className="font-semibold text-gray-800 text-lg">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {new Date(item.date).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {item.participants?.length || 0} người tham gia
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
