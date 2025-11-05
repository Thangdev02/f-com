"use client"

import { Heart, MessageCircle, Share, MoreVertical } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function PostCard({ post, onLike, onAddComment, onClick }) {
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleLike = (e) => {
    e.stopPropagation() // Ngăn click lan ra card
    setIsLiked(!isLiked)
    onLike?.(post.id)
  }

  const handleCommentSubmit = (e) => {
    e.stopPropagation()
    if (newComment.trim()) {
      onAddComment?.(post.id, newComment)
      setNewComment("")
      setShowComments(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick} // click vào card mở modal
      className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={`https://ui-avatars.com/api/?name=${post.author}&background=FF5733&color=fff`}
            alt={post.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.author}</h3>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-1 hover:bg-gray-100 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} className="text-gray-500" />
        </motion.button>
      </div>

      <p className="text-gray-700 mb-3">{post.content}</p>

      {post.image && (
        <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-64 object-cover rounded-lg mb-3" />
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{post.likes?.length || 0} lượt thích</span>
        <span>{post.comments?.length || 0} bình luận</span>
      </div>

      <div className="flex items-center justify-around border-t pt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleLike}
          className={`flex items-center space-x-1 flex-1 py-2 rounded hover:bg-gray-100 transition-colors ${
            isLiked ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>Thích</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments) }}
          className="flex items-center space-x-1 flex-1 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <MessageCircle size={18} />
          <span>Bình luận</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1 flex-1 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Share size={18} />
          <span>Chia sẻ</span>
        </motion.button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="mt-4 pt-4 border-t space-y-3">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${comment.author}&background=FF5733&color=fff`}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                  <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">Chưa có bình luận nào</p>
          )}

          <div className="flex space-x-2 mt-3 pt-3 border-t">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(e)}
              placeholder="Viết bình luận..."
              className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCommentSubmit}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
            >
              Gửi
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
