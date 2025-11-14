import React, { useEffect, useState } from "react"

const Session = ({ computerSelected, customerSelected, session }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState("00:00:00")
  const PRICE_PER_HOUR = 10000

  const [totalCost, setTotalCost] = useState(0)
  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Tính toán thời gian đã sử dụng
  useEffect(() => {
    if (session?.startTime) {
      // Parse startTime từ ISO string và TRỪ ĐI 7 giờ để đúng với thời gian thực
      // Vì new Date() sẽ tự động cộng 7h khi parse ISO string
      const startDate = new Date(session.startTime)

      // Tạo thời gian bắt đầu đúng bằng cách trừ đi offset timezone
      const timezoneOffset = 7 * 60 * 60 * 1000 // 7 giờ tính bằng milliseconds
      const adjustedStart = new Date(startDate.getTime() - timezoneOffset)

      const now = currentTime
      const diff = Math.floor((now - adjustedStart) / 1000)
      // trả về miliseconds

      // Xử lý trường hợp số âm
      if (diff < 0) {
        setElapsedTime("00:00:00")
        return
      }

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      setElapsedTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      )
      const cost = Math.ceil((diff / 3600) * PRICE_PER_HOUR)
      setTotalCost(cost)
    }
  }, [currentTime, session?.startTime])

  // Format thời gian - KHÔNG convert timezone, giữ nguyên giá trị
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A"

    // Parse trực tiếp từ ISO string mà KHÔNG convert timezone
    // "2025-11-10T09:19:54.181" -> "10/11/2025 09:19:54"
    const [datePart, timePart] = isoString.split("T")
    const [year, month, day] = datePart.split("-")
    const [time] = timePart.split(".")
    const [hours, minutes, seconds] = time.split(":")

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
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
        backgroundColor: "White",
        marginTop: "15px",
      }}
    >
      <h4 style={{ marginBottom: "10px", color: "Black" }}>
        Thông tin Session
      </h4>

      <div style={{ marginBottom: "8px", color: "Black" }}>
        <b>Máy:</b> {computerSelected.computerId}
      </div>

      <div style={{ marginBottom: "8px", color: "Black" }}>
        <b>Khách hàng:</b> {customerSelected.username} (ID:{" "}
        {customerSelected.id})
      </div>

      {session ? (
        <>
          {session.sessionId && (
            <div style={{ marginBottom: "8px", color: "Black" }}>
              <b>Session ID:</b> {session.sessionId}
            </div>
          )}

          <div style={{ marginBottom: "8px", color: "Black" }}>
            <b>Bắt đầu:</b> {formatDateTime(session.startTime)}
          </div>

          <div style={{ marginBottom: "8px", color: "Black" }}>
            <b>Thời gian hiện tại:</b> {currentTime.toLocaleString("vi-VN")}
          </div>
          <div style={{ marginBottom: "8px", color: "Black" }}>
            <b>Số tiền chơi: </b> {totalCost} VND
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
