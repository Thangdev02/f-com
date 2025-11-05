"use client"

import { useState, useEffect } from "react"
import ForumCard from "../components/ForumCard"
import { getForums, createForum, sendForumInvitation, createForumRequest, getUserForumRequests, updateForum } from "../services/api"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export default function Forums({ user }) {
  const [forums, setForums] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForum, setShowCreateForum] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [selectedForumId, setSelectedForumId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "public",
  })
  const [inviteData, setInviteData] = useState({
    studentEmail: "",
    message: "",
  })

  // store user requests to know which forums the user already requested to join
  const [userRequests, setUserRequests] = useState([]) // array of forumId strings

  useEffect(() => {
    fetchForums()
    fetchUserRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchForums = async () => {
    try {
      setIsLoading(true)
      const data = await getForums()
      setForums(data)
    } catch (error) {
      console.error("Error loading forums:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserRequests = async () => {
    try {
      if (!user?.id) return
      const requests = await getUserForumRequests(user.id)
      const pendingForumIds = requests.filter(r => r.status === "pending").map(r => String(r.forumId))
      setUserRequests(pendingForumIds)
    } catch (error) {
      console.error("Error loading user requests:", error)
    }
  }

  const handleCreateForum = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      const newForum = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        creator: user.name,
        creatorId: user.id,
        members: [String(user.id)],
        joinRequests: [],
        messageCount: 0,
        createdAt: new Date().toISOString(),
      }
      try {
        const savedForum = await createForum(newForum)
        setForums([savedForum, ...forums])
        setFormData({ name: "", description: "", type: "public" })
        setShowCreateForum(false)
      } catch (error) {
        console.error("Error creating forum:", error)
        alert("Lỗi khi tạo forum")
      }
    }
  }

  const handleSendInvitation = async () => {
    if (inviteData.studentEmail.trim()) {
      try {
        await sendForumInvitation(selectedForumId, inviteData.studentEmail, inviteData.message)
        setInviteData({ studentEmail: "", message: "" })
        setShowInvite(false)
        alert("Lời mời đã được gửi!")
      } catch (error) {
        console.error("Error sending invitation:", error)
        alert("Lỗi khi gửi lời mời")
      }
    }
  }

  // Called when student clicks "Tham gia" on a public forum
  const handleJoinPublicForum = async (forumId) => {
    try {
      const forum = forums.find(f => String(f.id) === String(forumId))
      if (!forum) return
      const currentMembers = Array.isArray(forum.members) ? forum.members.map(String) : []
      if (!currentMembers.includes(String(user.id))) {
        const updatedMembers = [...currentMembers, String(user.id)]
        // update backend
        await updateForum(forumId, { members: updatedMembers })
        // update UI
        setForums(forums.map(f => f.id === forumId ? { ...f, members: updatedMembers } : f))
      }
    } catch (error) {
      console.error("Error joining public forum:", error)
    }
  }

  // Called when student clicks "Tham gia" on a private forum -> send request
  const handleRequestToJoin = async (forumId) => {
    try {
      await createForumRequest(forumId, user.id, user.name, user.email)
      setUserRequests(prev => [...new Set([...prev, String(forumId)])])
      alert("Yêu cầu đã được gửi. Chờ giảng viên phê duyệt.")
    } catch (error) {
      console.error("Error requesting to join:", error)
      alert("Lỗi khi gửi yêu cầu")
    }
  }

  // Generic onJoin passed to ForumCard: decide based on forum.type
  const handleJoinAction = (forum) => {
    if (forum.type === "public") {
      handleJoinPublicForum(forum.id)
    } else {
      handleRequestToJoin(forum.id)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">F-Community</h1>
        {(user.role === "teacher" || user.role === "admin") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCreateForum(true)}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus size={20} />
            <span>Tạo Forum</span>
          </motion.button>
        )}
      </div>

      {/* Create Forum Modal */}
      {showCreateForum && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Tạo Forum Mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Forum</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập tên forum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows="3"
                placeholder="Nhập mô tả forum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại Forum</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleCreateForum}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
              >
                Tạo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowCreateForum(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Hủy
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Forums Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Đang tải forums...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forums.map((forum) => (
            <div key={forum.id}>
              <ForumCard
                forum={forum}
                onJoin={() => handleJoinAction(forum)}
                isCreator={String(forum.creatorId) === String(user.id)}
                onInviteClick={() => {
                  setSelectedForumId(forum.id)
                  setShowInvite(true)
                }}
                // pass whether current user has already requested
                hasRequested={userRequests.includes(String(forum.id))}
                onRefresh={() => { fetchForums(); fetchUserRequests() }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Invitation Modal */}
      {showInvite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Mời Sinh Viên</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Sinh Viên</label>
                <input
                  type="email"
                  value={inviteData.studentEmail}
                  onChange={(e) => setInviteData({ ...inviteData, studentEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="student@fpt.edu.vn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lời Nhắn (Tùy Chọn)</label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows="2"
                  placeholder="Nhập lời nhắn..."
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSendInvitation}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                >
                  Gửi Lời Mời
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowInvite(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Hủy
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!isLoading && forums.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có forum nào. Hãy tạo forum đầu tiên!</p>
        </div>
      )}
    </div>
  )
}
