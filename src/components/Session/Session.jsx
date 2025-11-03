import React, { useEffect, useState } from "react"
import axios from "axios"

const Session = ({ computerSelected, customerSelected }) => {
  const [session, setSession] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState("00:00:00")

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Tính toán thời gian đã sử dụng
  useEffect(() => {
    /// setTime Ecalpes
    if (session?.startTime) {
      const start = new Date(session.startTime)
      const now = currentTime
      const diff = Math.floor((now - start) / 1000)

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      setElapsedTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      )
    }
  }, [currentTime, session?.startTime])

  // Load hoặc tạo session
  useEffect(() => {
    if (!computerSelected || !customerSelected) {
      setSession(null)
      return
    }

    const storageKey = `computer_${computerSelected.computerId}_session`

    // 1. Kiểm tra localStorage trước
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        // Kiểm tra xem có session không
        if (parsedData.session?.startTime) {
          setSession(parsedData.session)
          return // Dừng lại, không tạo session mới
        }
      } catch (error) {
        console.error("Error parsing localStorage:", error)
      }
    }

    // 2. Nếu không có session trong localStorage, tạo mới
    const createSession = async () => {
      try {
        const newSession = {
          customerId: customerSelected.id,
          computerId: computerSelected.computerId,
          startTime: new Date().toISOString(),
          endTime: null,
          total: 0,
        }

        console.log("Tạo session mới:", newSession)

        // Post lên server
        const response = await axios.post(
          "http://localhost:8080/api/sessions",
          newSession,
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        // Lấy session từ response (có thể có sessionId)
        const createdSession = response.data || newSession

        // Cập nhật state
        setSession(createdSession)

        // Lưu vào localStorage (cập nhật hoặc tạo mới)
        const existingData = savedData ? JSON.parse(savedData) : {}
        const updatedData = {
          ...existingData,
          session: createdSession, // Thêm/cập nhật session
        }
        // cập nhật localStorage

        localStorage.setItem(storageKey, JSON.stringify(updatedData))
        console.log("Đã lưu session vào localStorage:", updatedData)
      } catch (error) {
        console.error("Lỗi tạo session:", error)
      }
    }

    createSession()
  }, [computerSelected?.computerId, customerSelected?.id])

  // Format thời gian
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A"
    const local = new Date(dateTime)
    return local.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  }

  if (!computerSelected || !customerSelected) {
    return null
  }

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "black",
        marginTop: "15px",
      }}
    >
      <h4 style={{ marginBottom: "10px", color: "#333" }}>Thông tin Session</h4>

      <div style={{ marginBottom: "8px" }}>
        <b>Máy:</b> {computerSelected.computerId}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <b>Khách hàng:</b> {customerSelected.username} (ID:{" "}
        {customerSelected.id})
      </div>

      {session ? (
        <>
          {session.sessionId && (
            <div style={{ marginBottom: "8px" }}>
              <b>Session ID:</b> {session.sessionId}
            </div>
          )}

          <div style={{ marginBottom: "8px" }}>
            <b>Bắt đầu:</b> {formatDateTime(session.startTime)}
          </div>

          <div style={{ marginBottom: "8px" }}>
            <b>Thời gian hiện tại:</b> {currentTime.toLocaleString("vi-VN")}
          </div>

          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#e3f2fd",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b style={{ fontSize: "16px", color: "#1976d2" }}>
              Thời gian đã sử dụng: {elapsedTime}
            </b>
          </div>
        </>
      ) : (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          Đang tải thông tin session...
        </p>
      )}
    </div>
  )
}

export default Session
