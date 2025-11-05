"use client"

import { useState, useEffect } from "react"
import { getPosts, createPost, getComments, createComment } from "../services/api"
import { motion } from "framer-motion"
import PostModal from "../components/PostModal"
import PostCard from "../components/PostCard"

export default function Home({ user }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostImage, setNewPostImage] = useState("")
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getPosts()
      const postsWithComments = await Promise.all(
        data.map(async (post) => {
          const comments = await getComments(post.id)
          return { ...post, comments }
        })
      )
      setPosts(postsWithComments)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    const newPost = {
      author: user.name,
      authorId: user.id,
      content: newPostContent,
      timestamp: new Date().toLocaleString("vi-VN"),
      likes: [],
      image: newPostImage || null,
    }

    try {
      const savedPost = await createPost(newPost)
      setPosts([{ ...savedPost, comments: [] }, ...posts])
      setNewPostContent("")
      setNewPostImage("")
      setShowCreatePost(false)
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Lỗi khi tạo bài đăng")
    }
  }

  const handleAddComment = async (postId, commentContent) => {
    if (!commentContent.trim()) return
    const newComment = {
      postId,
      author: user.name,
      authorId: user.id,
      content: commentContent,
      timestamp: new Date().toLocaleString("vi-VN"),
    }
    try {
      await createComment(newComment)
      fetchPosts()
    } catch (error) {
      console.error("Error creating comment:", error)
      alert("Lỗi khi bình luận")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Create Post Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=FF5733&color=fff`}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            onClick={() => setShowCreatePost(true)}
            placeholder="Bạn đang nghĩ gì?"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none cursor-pointer"
          />
        </div>

        {showCreatePost && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Chia sẻ ý tưởng của bạn..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
            />
            <input
              type="text"
              value={newPostImage}
              onChange={(e) => setNewPostImage(e.target.value)}
              placeholder="Link hình (tùy chọn)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex space-x-2">
              <motion.button whileHover={{ scale: 1.02 }} onClick={handleCreatePost} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Đăng
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowCreatePost(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Hủy
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Posts List */}
      <div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải bài đăng...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onAddComment={handleAddComment} onClick={() => setSelectedPost(post)} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">Chưa có bài đăng nào</div>
        )}
      </div>

      {/* Post Modal */}
      {selectedPost && (
  <PostModal
    post={selectedPost}
    user={user}
    onClose={() => setSelectedPost(null)}
    onAddComment={handleAddComment}
  />
)}


    </div>
  )
}
