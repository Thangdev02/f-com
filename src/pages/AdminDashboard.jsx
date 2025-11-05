"use client"

import { useState, useEffect } from "react"
import { getForums, getUsers } from "../services/api"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

 function AdminDashboard() {
  const [forums, setForums] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalForums: 0,
    totalUsers: 0,
    activeForums: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const forumsData = await getForums()
      const usersData = await getUsers()
      setForums(forumsData)
      setUsers(usersData)
      setStats({
        totalForums: forumsData.length,
        totalUsers: usersData.length,
        activeForums: forumsData.filter((f) => f.messageCount > 0).length,
      })
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const chartData = [
    { name: "Forums", value: stats.totalForums },
    { name: "Users", value: stats.totalUsers },
    { name: "Active Forums", value: stats.activeForums },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Tổng Forums", value: stats.totalForums, icon: "📊" },
          { label: "Tổng Users", value: stats.totalUsers, icon: "👥" },
          { label: "Forums Hoạt Động", value: stats.activeForums, icon: "🔥" },
        ].map((stat, idx) => (
          <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-red-500">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thống kê</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#FF5733" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Forums Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Danh sách Forums</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Người tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Thành viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Loại</th>
              </tr>
            </thead>
            <tbody>
              {forums.map((forum) => (
                <tr key={forum.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{forum.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{forum.creator}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{forum.members?.length || 0}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        forum.type === "public" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {forum.type === "public" ? "Công khai" : "Riêng tư"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
export default AdminDashboard
