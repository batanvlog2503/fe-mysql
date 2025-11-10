import React, { useEffect, useState } from "react"
import axios from "axios"
import "./ListComputer.css"

const ListComputer = () => {
  const [computers, setComputers] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Gọi API lấy danh sách máy
  useEffect(() => {
    loadComputers()
  }, [])

  const loadComputers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/computers")
      if (result.status === 200) {
        setComputers(result.data)
      } else {
        alert("Không tải được danh sách máy!")
      }
    } catch (error) {
      console.error("Lỗi load API:", error)
      alert("Không kết nối được tới server!")
    }
  }

  //  Hàm định dạng startTime
  const formatDateTime = (isoString) => {
    if (!isoString) return ""
    const [datePart, timePart] = isoString.split("T")
    const [year, month, day] = datePart.split("-")
    const [time] = timePart.split(".")
    const [hours, minutes, seconds] = time.split(":")
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  //  Tính thời gian đã sử dụng (theo giây)
  const getElapsedSeconds = (startTime) => {
    if (!startTime) return 0

    const startDate = new Date(startTime)
    const adjustedStart = new Date(startDate.getTime() - 7 * 60 * 60 * 1000)
    const diff = Math.floor((currentTime - adjustedStart) / 1000)
    return diff > 0 ? diff : 0
  }

  //  Định dạng thời gian chạy hh:mm:ss
  const formatElapsedTime = (seconds) => { // lấy thời gian chạy      seconds lấy từ getElapsedSeconds
    if (seconds <= 0) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`
  }

  // 💰 Tính tổng tiền từ số giây
  const calculateTotal = (elapsedSeconds) => {
    const hours = elapsedSeconds / 3600
    const total = Math.floor(hours * 5000) // làm tròn xuống đến hàng đơn vị
    return total > 0 ? total.toLocaleString("vi-VN") + " ₫" : ""
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách máy tính</h2>
      <table className="table table-bordered table-striped align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Mã máy</th>
            <th>Tên máy</th>
            <th>Trạng thái</th>
            <th>Người dùng hiện tại</th>
            <th>Session ID</th>
            <th>Bắt đầu</th>
            <th>Thời gian đang chạy</th>
            <th>Total (VNĐ)</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {computers.length > 0 ? (
            computers.map((comp) => {
              const sessionKey = `computer_${comp.computerId}_session`
              const sessionData = localStorage.getItem(sessionKey)
                ? JSON.parse(localStorage.getItem(sessionKey))
                : null

              const startTime = sessionData?.session?.startTime
              const elapsedSeconds =
                comp.status === "Using" ? getElapsedSeconds(startTime) : 0 // lấy giây
                // lấy cái  ở trên là cái thời gian cập nhật thời gian sau trừ thời gian StartTime
              const usageTime = formatElapsedTime(elapsedSeconds) 
              const total = calculateTotal(elapsedSeconds)

              return (
                <tr
                  key={comp.computerId}
                  style={{
                   backgroundColor:"grey"
                  }}
                >
                  <td>{comp.computerId}</td>
                  <td>{`Máy ${comp.computerId}`}</td>
                  <td>
                    <span
                      className={`badge ${
                        comp.status === "Using" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td>{sessionData?.loginInfo?.username}</td>
                  <td>{sessionData?.session?.sessionId}</td>
                  <td>{formatDateTime(startTime)}</td>
                  <td style={{ fontWeight: "bold", color: "#1976d2" }}>
                    {usageTime}
                  </td>

                  <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {total}
                  </td>
                  <td>
                    {sessionData?.loginInfo?.balance
                      ? `${sessionData.loginInfo.balance} VND`
                      : "—"}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center"
              >
                Không có máy nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ListComputer
