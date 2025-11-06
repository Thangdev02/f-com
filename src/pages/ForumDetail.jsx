"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import {
  getForumById,
  getMessages,
  createMessage,
  getForumRequests,
  approveForumRequest,
  rejectForumRequest,
  getAppointments,
  setAppointmentParticipation,
  deleteMessage,
} from "../services/api"
import { Send, CalendarDays, Check, X, Trash2 } from "lucide-react"
import AppointmentModal from "../components/AppointmentModal"

export default function ForumDetail({ user }) {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
  const [messages, setMessages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch forum & appointments once
  useEffect(() => {
    fetchForumAndAppointments()
  }, [id])

  // Fetch messages separately every 2s
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [id])

  const fetchForumAndAppointments = async () => {
    try {
      setIsLoading(true)
      const forumData = await getForumById(id)
      setForum(forumData)

      const appts = await getAppointments(id)
      setAppointments(appts.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || "")))

      if (String(forumData?.creatorId) === String(user.id)) {
        await fetchRequests()
      }
    } catch (e) {
      console.error("Error loading forum:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const msgs = await getMessages(id)
      setMessages(msgs)
    } catch (e) {
      console.error("Error loading messages:", e)
    }
  }

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true)
      const reqs = await getForumRequests(id)
      setRequests(reqs.filter((r) => r.status === "pending"))
    } catch (e) {
      console.error("Error loading requests:", e)
    } finally {
      setLoadingRequests(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return
    setSending(true)
    const message = {
      forumId: String(id),
      author: user.name,
      authorId: String(user.id),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("vi-VN"),
    }
    try {
      const created = await createMessage(message)
      setMessages((prev) => [...prev, created]) // append message mới
      setNewMessage("")
    } catch (e) {
      console.error("Error creating message:", e)
      alert("Lỗi khi gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Bạn có chắc muốn xóa tin nhắn này?")) return
    try {
      await deleteMessage(messageId)
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    } catch (e) {
      console.error("Error deleting message:", e)
      alert("Lỗi khi xóa tin nhắn")
    }
  }

  const handleApproveRequest = async (request) => {
    try {
      await approveForumRequest(request.id, request.forumId, request.userId)
      await fetchRequests()
    } catch (e) {
      console.error("approve error:", e)
      alert("Lỗi khi chấp nhận yêu cầu")
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectForumRequest(requestId)
      await fetchRequests()
    } catch (e) {
      console.error("reject error:", e)
      alert("Lỗi khi từ chối yêu cầu")
    }
  }

  const isMember = (forum?.members || []).map(String).includes(String(user.id))
  const isCreator = String(forum?.creatorId) === String(user.id)

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (isLoading && !forum)
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>
  if (!forum)
    return <div className="flex items-center justify-center h-screen">Forum không tìm thấy</div>

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Thành viên ({forum.members?.length || 0})</h3>
        <div className="space-y-2 mb-6">
          {forum.members?.map((memberId, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded transition"
            >
              <img
                src={`https://ui-avatars.com/api/?name=Member${idx}&background=FF5733&color=fff`}
                alt="Member"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">Thành viên {idx + 1}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
          ))}
        </div>

        {isCreator && (
          <>
            <h4 className="font-semibold text-gray-800 mb-2">Yêu cầu tham gia</h4>
            {loadingRequests ? (
              <p className="text-sm text-gray-500">Đang tải yêu cầu...</p>
            ) : (
              <div className="space-y-2">
                {requests.length === 0 && <p className="text-sm text-gray-500">Chưa có yêu cầu nào</p>}
                {requests.map((req) => (
                  <div key={req.id} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{req.userName}</p>
                        <p className="text-xs text-gray-500">{req.userEmail}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(req)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                        >
                          Chấp nhận
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Chat + Appointments */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{forum.name}</h2>
            <p className="text-sm text-gray-600">{forum.description}</p>
            <p className="text-xs text-gray-500 mt-1">{forum.type === "public" ? "Công khai" : "Riêng tư"}</p>
          </div>
          {isMember && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <CalendarDays size={18} />
              <span>Tạo lịch hẹn</span>
            </button>
          )}
        </div>

        {/* Appointments */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {appointments.map((a) => {
            const my = String(a.creatorId) === String(user.id)
            const joined =
              Array.isArray(a.participants) &&
              a.participants.some((p) => String(p.userId) === String(user.id) && p.status === "accepted")
            return (
              <div
                key={a.id}
                className={`flex ${my ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-xl w-full rounded-lg border bg-white p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="text-blue-600" size={18} />
                    <p className="text-sm font-semibold text-gray-800">
                      {a.title}{" "}
                      <span className="text-xs text-gray-500">
                        ({a.date}{a.time ? ` • ${a.time}` : ""})
                      </span>
                    </p>
                  </div>
                  {a.description && <p className="text-sm text-gray-700 mb-3">{a.description}</p>}
                  <div className="flex items-center gap-2">
                    {!joined ? (
                      <>
                        <button
                          onClick={() => setAppointmentParticipation(a.id, user.id, "accepted").then(fetchForumAndAppointments)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition"
                        >
                          <Check size={14} /> Tham gia
                        </button>
                        <button
                          onClick={() => setAppointmentParticipation(a.id, user.id, "rejected").then(fetchForumAndAppointments)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
                        >
                          <X size={14} /> Không tham gia
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-700 text-sm">
                        <Check size={14} /> Bạn đã tham gia
                      </span>
                    )}
                    <span className="ml-auto text-xs text-gray-500">
                      Tạo bởi #{a.creatorId} • {(a.participants || []).filter((p) => p.status === "accepted").length} người tham gia
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Messages */}
          {messages.map((message) => {
            const myMessage = String(message.authorId) === String(user.id)
            return (
              <div
                key={message.id}
                className={`flex ${myMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                    myMessage ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {!myMessage && <p className="text-xs font-semibold mb-1">{message.author}</p>}
                  <p className="text-sm break-words">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>

                  {myMessage && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="absolute top-1 right-1 p-1 bg-white bg-opacity-20 rounded-full text-gray-100 hover:bg-opacity-40 transition"
                      title="Thu hồi tin nhắn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {isMember ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending}
                className={`bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors ${
                  sending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              {forum.type === "public"
                ? `Bạn chưa là thành viên. Nhấn "Tham gia" ở trang danh sách forum để vào chat.`
                : `Bạn chưa được chấp nhận vào forum. Gửi yêu cầu tại trang danh sách forum.`}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          forumId={String(id)}
          creatorId={String(user.id)}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false)
            fetchForumAndAppointments()
          }}
        />
      )}
    </div>
  )
}
