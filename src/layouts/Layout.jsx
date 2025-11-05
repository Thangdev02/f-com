"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { motion } from "framer-motion"

export default function Layout({ children, user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white shadow-lg"
      >
        <Sidebar user={user} handleLogout={handleLogout} />
      </motion.div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} setSidebarOpen={setSidebarOpen} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
