"use client"

import { useState, useEffect } from "react"
import { Search, Bell, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getPosts } from "../services/api" // API lấy danh sách bài viết

export default function Header({ user, setSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts()
        setPosts(data)
      } catch (e) {
        console.error("Error fetching posts:", e)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts([])
      setShowDropdown(false)
      return
    }
    const filtered = posts.filter((p) =>
      p.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredPosts(filtered)
    setShowDropdown(true)
  }, [searchQuery, posts])
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 relative z-20">
      <div className="flex items-center justify-between">
        {/* Menu toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} className="text-gray-700" />
        </motion.button>

        {/* Search input */}
        <div className="flex-1 max-w-md mx-8 relative">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dropdown kết quả search */}
          <AnimatePresence>
            {showDropdown && filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
              >
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // Xử lý khi chọn bài viết (ví dụ redirect hoặc mở modal)
                      console.log("Chọn bài viết:", post.content)
                      setSearchQuery("")
                      setShowDropdown(false)
                    }}
                  >
                    {post.content}
                  </div>
                ))}
              </motion.div>
            )}
            {showDropdown && filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-gray-500"
              >
                Không tìm thấy bài viết
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Icons và user */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=FF5733&color=fff`}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
