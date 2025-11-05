// services/api.js
import axios from "axios"

const API_BASE_URL = "http://localhost:3001"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Posts
export const getPosts = async () => {
  try {
    const response = await apiClient.get("/posts")
    return response.data
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export const createPost = async (post) => {
  try {
    const response = await apiClient.post("/posts", post)
    return response.data
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export const updatePost = async (postId, updates) => {
  try {
    const response = await apiClient.patch(`/posts/${postId}`, updates)
    return response.data
  } catch (error) {
    console.error("Error updating post:", error)
    throw error
  }
}

export const likePost = async (postId, userId) => {
  try {
    const response = await apiClient.patch(`/posts/${postId}`, {
      likes: userId,
    })
    return response.data
  } catch (error) {
    console.error("Error liking post:", error)
    throw error
  }
}

// Forums
export const getForums = async () => {
  try {
    const response = await apiClient.get("/forums")
    return response.data
  } catch (error) {
    console.error("Error fetching forums:", error)
    throw error
  }
}

export const createForum = async (forum) => {
  try {
    const response = await apiClient.post("/forums", forum)
    return response.data
  } catch (error) {
    console.error("Error creating forum:", error)
    throw error
  }
}

export const getForumById = async (id) => {
  try {
    const response = await apiClient.get(`/forums/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching forum:", error)
    throw error
  }
}

export const updateForum = async (forumId, updates) => {
  try {
    const response = await apiClient.patch(`/forums/${forumId}`, updates)
    return response.data
  } catch (error) {
    console.error("Error updating forum:", error)
    throw error
  }
}

// create a join request
export const createForumRequest = async (forumId, userId, userName, userEmail) => {
  try {
    const response = await apiClient.post("/forumRequests", {
      forumId,
      userId,
      userName,
      userEmail,
      status: "pending",
      createdAt: new Date().toISOString(),
    })
    return response.data
  } catch (error) {
    console.error("Error creating forum request:", error)
    throw error
  }
}

// get all requests for a forum
export const getForumRequests = async (forumId) => {
  try {
    const response = await apiClient.get(`/forumRequests?forumId=${forumId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching forum requests:", error)
    return []
  }
}

// get all requests made by a user
export const getUserForumRequests = async (userId) => {
  try {
    const response = await apiClient.get(`/forumRequests?userId=${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user forum requests:", error)
    return []
  }
}

/**
 * Approve a forum request AND add the user to forum.members.
 * - requestId: id of the forumRequests entry
 * - forumId: id of the forum to update
 * - userId: id of the user to add to members
 */
export const approveForumRequest = async (requestId, forumId, userId) => {
  try {
    // 1) update request status
    await apiClient.patch(`/forumRequests/${requestId}`, {
      status: "approved",
    })

    // 2) fetch forum
    const forumResp = await apiClient.get(`/forums/${forumId}`)
    const forum = forumResp.data

    // ensure members is an array of strings
    const currentMembers = Array.isArray(forum.members) ? forum.members.map(String) : []

    const userIdStr = String(userId)
    if (!currentMembers.includes(userIdStr)) {
      const updatedMembers = [...currentMembers, userIdStr]
      // patch forum members
      await apiClient.patch(`/forums/${forumId}`, { members: updatedMembers })
    }

    return { success: true }
  } catch (error) {
    console.error("Error approving request:", error)
    throw error
  }
}

export const rejectForumRequest = async (requestId) => {
  try {
    const response = await apiClient.patch(`/forumRequests/${requestId}`, {
      status: "rejected",
    })
    return response.data
  } catch (error) {
    console.error("Error rejecting request:", error)
    throw error
  }
}

export const sendForumInvitation = async (forumId, studentEmail, message) => {
  try {
    const response = await apiClient.post("/forumInvitations", {
      forumId,
      studentEmail,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
    })
    return response.data
  } catch (error) {
    console.error("Error sending invitation:", error)
    throw error
  }
}

export const getForumInvitations = async (userEmail) => {
  try {
    const response = await apiClient.get(`/forumInvitations?studentEmail=${userEmail}`)
    return response.data
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return []
  }
}

export const acceptForumInvitation = async (invitationId, forumId, userId) => {
  try {
    await apiClient.patch(`/forumInvitations/${invitationId}`, {
      status: "accepted",
    })
    const forum = await getForumById(forumId)
    const updatedMembers = [...(forum.members || []), userId]
    await updateForum(forumId, { members: updatedMembers })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    throw error
  }
}

export const rejectForumInvitation = async (invitationId) => {
  try {
    await apiClient.patch(`/forumInvitations/${invitationId}`, {
      status: "rejected",
    })
  } catch (error) {
    console.error("Error rejecting invitation:", error)
  }
}

// Comments
export const getComments = async (postId) => {
  try {
    const response = await apiClient.get(`/comments?postId=${postId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export const createComment = async (comment) => {
  try {
    const response = await apiClient.post("/comments", comment)
    return response.data
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

// Messages
export const getMessages = async (forumId) => {
  try {
    const response = await apiClient.get(`/messages?forumId=${forumId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export const createMessage = async (message) => {
  try {
    const response = await apiClient.post("/messages", message)
    return response.data
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

// Schedules
export const getSchedules = async () => {
  try {
    const response = await apiClient.get("/schedules")
    return response.data
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return []
  }
}

export const createSchedule = async (schedule) => {
  try {
    const response = await apiClient.post("/schedules", schedule)
    return response.data
  } catch (error) {
    console.error("Error creating schedule:", error)
    throw error
  }
}

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await apiClient.delete(`/schedules/${scheduleId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting schedule:", error)
    throw error
  }
}

// Users
export const getUsers = async () => {
  try {
    const response = await apiClient.get("/users")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", {
      ...userData,
      role: "student",
      createdAt: new Date().toISOString(),
    })
    return response.data
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// Login
export const login = async (email, password) => {
  try {
    const users = await getUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      return user
    }
    throw new Error("Invalid credentials")
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export const getAppointments = async (forumId) =>
  (await apiClient.get(`/appointments?forumId=${forumId}`)).data

// Create appointment
export const createAppointment = async (payload) =>
  (await apiClient.post("/appointments", payload)).data

// Upsert participant status for an appointment
export const setAppointmentParticipation = async (appointmentId, userId, status) => {
  const appt = (await apiClient.get(`/appointments/${appointmentId}`)).data
  const participants = Array.isArray(appt.participants) ? [...appt.participants] : []
  const idx = participants.findIndex((p) => String(p.userId) === String(userId))
  const next =
    idx === -1
      ? [...participants, { userId: String(userId), status }]
      : participants.map((p, i) => (i === idx ? { ...p, status } : p))
  return (await apiClient.patch(`/appointments/${appointmentId}`, { participants: next })).data
}
// Xóa tin nhắn
export const deleteMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(`/messages/${messageId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting message:", error)
    throw error
  }
}

export default apiClient

