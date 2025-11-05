"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, registerUser } from "../services/api"
import { motion } from "framer-motion"

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await login(email, password)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userId", user.id)
      setUser(user)
      navigate("/") // 👉 Điều hướng sau khi đăng nhập
    } catch (err) {
      setError("Email hoặc mật khẩu không chính xác")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu không khớp")
      return
    }

    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setIsLoading(true)

    try {
      const newUser = await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      })
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("userId", newUser.id)
      setUser(newUser)
      navigate("/") // 👉 Điều hướng sau khi đăng ký
    } catch (err) {
      setError("Email đã được đăng ký hoặc lỗi trong quá trình đăng ký")
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { email: "teacher@fpt.edu.vn", password: "teacher123" },
    { email: "student@fpt.edu.vn", password: "student123" },
    { email: "admin@fpt.edu.vn", password: "admin123" },
  ]

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">FPT Community</h1>
            <p className="text-gray-600">{isRegistering ? "Đăng ký tài khoản" : "Đăng nhập để tiếp tục"}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4"
            >
              {error}
            </motion.div>
          )}

          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận Mật khẩu</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Tạo tài khoản mới
                </button>
              </div>
            </form>
          )}

          {!isRegistering && (
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600 mb-3 text-center font-semibold">Tài khoản Demo</p>
              <div className="space-y-2">
                {demoAccounts.map((account, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => fillDemo(account.email, account.password)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800">{account.email.split("@")[0]}</div>
                    <div className="text-xs text-gray-500">{account.email}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
