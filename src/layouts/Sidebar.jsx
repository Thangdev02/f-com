"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, MessageSquare, Calendar, Users, Settings, LogOut, Newspaper } from "lucide-react"
import { motion } from "framer-motion"

export default function Sidebar({ user, handleLogout }) {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: "Trang chủ", path: "/home" },
    { icon: Newspaper, label: "Bài Đăng", path: "/" },
    { icon: MessageSquare, label: "F-community", path: "/forums" },
    { icon: Calendar, label: "Thống kê lịch trống", path: "/calendar" },
    { icon: Settings, label: "Hồ sơ", path: "/profile" },
    // { icon: Settings, label: "LH", path: "/appointments" },
  ]

  if (user?.role === "admin") {
    menuItems.push({ icon: Users, label: "Admin Panel", path: "/admin" })
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center justify-center mb-6">
          <img src="./finalLogo.jpeg" alt="logo" style={{ width: "100px", height: "50px" }} />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: 5 }}
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                location.pathname === item.path
                  ? "bg-red-100 text-red-500 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span>{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="border-t pt-4">
        <div className="text-xs text-gray-500 mb-3 px-4">
          <p>
            Vai trò: <span className="font-semibold">{user?.role}</span>
          </p>
          <p>
            Email: <span className="text-xs truncate">{user?.email}</span>
          </p>
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>Đăng xuất</span>
        </motion.button>
      </div>
    </div>
  )
}
