"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import "./App.css"
import Layout from "./layouts/Layout"
import Home from "./pages/Home"
import Forums from "./pages/Forums"
import ForumDetail from "./pages/ForumDetail"
import Calendar from "./pages/Calendar"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import Login from "./pages/Login"
import Appointments from "./pages/Appointments"
import Intro from "./pages/Intro"

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Login setUser={setUser} />
  }

  return (
    
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/home" element={<Intro user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/forums" element={<Forums user={user} />} />
          <Route path="/forums/:id" element={<ForumDetail user={user} />} />
          <Route path="/calendar" element={<Calendar user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          {user.role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}
          <Route path="/appointments" element={<Appointments user={user} />} />

        </Routes>
      </Layout>
  )
}

export default App
