// PostModal.jsx
"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function PostModal({ post, user, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState("")

  const handleComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText)
      setCommentText("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">{post.author}</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p>{post.content}</p>
          {post.image && <img src={post.image} alt="Post" className="w-full rounded-lg" />}
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>

        {/* Comments */}
        <div className="p-4 border-t border-gray-200 space-y-3 max-h-80 overflow-y-auto">
          {post.comments?.map((c) => (
            <div key={c.id} className="flex space-x-2">
              <img
                src={`https://ui-avatars.com/api/?name=${c.author}&background=FF5733&color=fff`}
                alt={c.author}
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-gray-100 p-2 rounded-lg flex-1">
                <p className="text-sm font-semibold">{c.author}</p>
                <p className="text-sm">{c.content}</p>
                <p className="text-xs text-gray-500">{c.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="p-4 border-t border-gray-200 flex space-x-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleComment} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
            Gửi
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
