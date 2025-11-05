"use client"

import { Users, MessageSquare, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function ForumCard({ forum, onJoin, isCreator, onInviteClick, hasRequested, onRefresh }) {
  const isPublic = forum.type === "public"
  const currentUserId = localStorage.getItem("userId")
  const isMember = (forum.members || []).map(String).includes(String(currentUserId))

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <MessageSquare size={24} className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{forum.name}</h3>
            <p className="text-xs text-gray-500">Tạo bởi: {forum.creator}</p>
          </div>
          {!isPublic && <Lock size={16} className="text-gray-400" />}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{forum.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Users size={14} />
            <span>{forum.members?.length || 0} thành viên</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageSquare size={14} />
            <span>{forum.messageCount || 0} tin nhắn</span>
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link to={`/forums/${forum.id}`} className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Xem chi tiết
          </motion.button>
        </Link>

        {/* If already member */}
        {isMember ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            onClick={() => onRefresh?.()}
          >
            Đã tham gia
          </motion.button>
        ) : (
          <>
            {/* If user already requested for private forum */}
            {!isPublic && hasRequested ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex-1 px-4 py-2 bg-yellow-400 text-white rounded-lg transition-colors text-sm font-medium"
                onClick={() => alert("Bạn đã gửi yêu cầu. Chờ giảng viên phê duyệt.")}
              >
                Đã gửi yêu cầu
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={onJoin}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Tham gia
              </motion.button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
