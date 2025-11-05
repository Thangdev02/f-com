"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Calendar, Edit2 } from "lucide-react"

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: "Một lập trình viên đam mê công nghệ",
    phone: "+84 123 456 789",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save to backend
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-red-500 to-red-600"></div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=FF5733&color=fff&size=128`}
              alt={user?.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <Edit2 size={18} />
                <span>Chỉnh sửa</span>
              </motion.button>
            )}
          </div>

          {isEditing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSave}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                >
                  Lưu
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Hủy
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-600">{user.role}</p>
              </div>

              <p className="text-gray-700">{profileData.bio}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Tham gia</p>
                    <p className="text-sm font-medium text-gray-800">Nov 2024</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
