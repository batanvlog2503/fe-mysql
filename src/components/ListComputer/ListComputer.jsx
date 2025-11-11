import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import "./ListComputer.css"
import { useNavigate } from "react-router-dom"

const ListComputer = () => {
  const [computers, setComputers] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedSession, setSelectedSession] = useState(null)
  const [serviceProducts, setServiceProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [rechargeInfo, setRechargeInfo] = useState(null)
  const [loadingServices, setLoadingServices] = useState(false)

  // Ref để theo dõi máy đã được xử lý (tránh xử lý nhiều lần)
  const processedComputers = useRef(new Set())
  const navigate = useNavigate()
  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    loadComputers()
  }, [])

  useEffect(() => {
    computers.forEach((comp) => {
      if (comp.status === "Using") {
        const sessionKey = `computer_${comp.computerId}_session`
        const sessionData = localStorage.getItem(sessionKey)
          ? JSON.parse(localStorage.getItem(sessionKey))
          : null

        if (sessionData) {
          const startTime = sessionData?.session?.startTime
          const elapsedSeconds = getElapsedSeconds(startTime)
          const total = calculateTotal(elapsedSeconds)
          const balance = sessionData?.loginInfo?.balance

          if (total && balance) {
            checkBalanceAndRecharge(comp, total, balance, sessionData) // kiểm tra balance từng giây
          }
        }
      }
    })
  }, [currentTime, computers]) // Chạy mỗi giây khi currentTime thay đổi

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

  // Load dịch vụ theo sessionId
  const loadServiceProducts = async (sessionId) => {
    if (!sessionId) {
      alert("Không có session ID!")
      return
    }

    setLoadingServices(true)
    try {
      const result = await axios.get(
        `http://localhost:8080/api/serviceproducts/session/${sessionId}`
      )
      if (result.status === 200) {
        setServiceProducts(result.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error("Lỗi load dịch vụ:", error)
      if (error.response?.status === 404) {
        alert("Không có dịch vụ nào cho session này!")
      } else {
        alert("Không thể tải dịch vụ!")
      }
    } finally {
      setLoadingServices(false)
    }
  }

  // Tính tổng tiền dịch vụ
  const calculateServiceTotal = () => {
    return serviceProducts.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    )
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
  const formatElapsedTime = (seconds) => {
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
    const total = Math.floor(hours * 5000)
    return total > 0 ? total.toLocaleString("vi-VN") + " ₫" : ""
  }

  const checkBalanceAndRecharge = (comp, total, balance, sessionData) => {
    const totalCost = parseInt(total) || 0
    const balances = parseInt(balance) || 0

    // Kiểm tra xem máy này đã được xử lý chưa
    const computerKey = `${comp.computerId}_${totalCost}`
    if (processedComputers.current.has(computerKey)) {
      return // Đã xử lý rồi, bỏ qua
    }

    if (totalCost >= balances) {
      // Đánh dấu đã xử lý
      processedComputers.current.add(computerKey)

      // Hiển thị thông tin yêu cầu nạp tiền
      setRechargeInfo({
        computerId: comp.computerId,
        username: sessionData?.loginInfo?.username,
        total: total,
        balance: balance,
      })

      // Chuyển máy sang Offline
      setComputerOffline(comp)

      // Hiển thị modal
      setShowRechargeModal(true)

      // Xóa session khỏi localStorage
      const sessionKey = `computer_${comp.computerId}_session`
      localStorage.removeItem(sessionKey)
    }
  }

  const setComputerOffline = async (comp) => {
    try {
      await axios.put(
        `http://localhost:8080/api/computers/update/${comp.computerId}`,
        {
          ...comp,
          status: "Offline",
        }
      )
      console.log(`Máy ${comp.computerId} đã chuyển sang Offline`)

      loadComputers()
    } catch (error) {
      console.log(error)
      alert("Update computer failed")
    }
  }

  return (
    <div
      className="container mt-4"
      style={{ maxWidth: "1400px" }}
    >
      <h2 className="mb-3">Danh sách máy tính</h2>
      <div>
        <table className="table table-bordered align-middle text-center">
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
              <th>Dịch Vụ</th>
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
                  comp.status === "Using" ? getElapsedSeconds(startTime) : 0
                const usageTime = formatElapsedTime(elapsedSeconds)
                const total = calculateTotal(elapsedSeconds)
                const sessionId = sessionData?.session?.sessionId

                return (
                  <tr
                    key={comp.computerId}
                    style={{
                      backgroundColor: "Grey",
                    }}
                  >
                    <td>{comp.computerId}</td>
                    <td>{`Máy ${comp.computerId}`}</td>
                    <td>
                      <span
                        className={`badge ${
                          comp.status === "Using"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {comp.status}
                      </span>
                    </td>
                    <td>{sessionData?.loginInfo?.username || "—"}</td>
                    <td>{sessionId || "—"}</td>
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
                        : ""}
                    </td>
                    <td>
                      {sessionId ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedSession(sessionId)
                            loadServiceProducts(sessionId)
                          }}
                          disabled={loadingServices}
                        >
                          {loadingServices && selectedSession === sessionId
                            ? "Đang tải..."
                            : "Xem dịch vụ"}
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center"
                >
                  Không có máy nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal yêu cầu nạp tiền */}
      {showRechargeModal && rechargeInfo && (
        <div className="show-modal">
          <div className="table-show-model">
            <div className="d-flex flex-column">
              <h3 className="text-danger text-center mb-3">
                ⚠️ YÊU CẦU NẠP TIỀN
              </h3>

              <div className="alert alert-warning">
                <p>
                  <strong>Máy:</strong> Máy {rechargeInfo.computerId}
                </p>
                <p>
                  <strong>Người dùng:</strong> {rechargeInfo.username}
                </p>
                <p>
                  <strong>Tổng phí:</strong>{" "}
                  <span className="text-danger">{rechargeInfo.total}</span>
                </p>
                <p>
                  <strong>Số dư:</strong>{" "}
                  <span className="text-warning">
                    {rechargeInfo.balance} VND
                  </span>
                </p>
              </div>

              <p className="text-center">
                Máy đã được chuyển sang trạng thái Offline.
                <br />
                Vui lòng nạp tiền để tiếp tục sử dụng.
              </p>

              <div className="d-flex gap-2 justify-content-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowRechargeModal(false)
                    setRechargeInfo(null)
                    navigate("/deposit-money")
                  }}
                >
                  Nạp tiền
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRechargeModal(false)
                    setRechargeInfo(null)
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị dịch vụ */}
      {showModal && (
        <div
          className="show-modal"
          onClick={() => setShowModal(false)}
        >
          <div
            className="table-show-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{ marginBottom: "20px" }}
              className="d-flex justify-content-between text-center"
            >
              <h4>Dịch vụ - Session #{selectedSession}</h4>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {serviceProducts.length > 0 ? (
              <>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Loại</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceProducts.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>
                          <span className="badge bg-info">{item.category}</span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString("vi-VN")} ₫</td>
                        <td style={{ fontWeight: "bold" }}>
                          {(item.quantity * item.price).toLocaleString("vi-VN")}{" "}
                          ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-warning">
                      <td
                        colSpan="4"
                        style={{ textAlign: "right" }}
                      >
                        <strong>Tổng cộng:</strong>
                      </td>
                      <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                        {calculateServiceTotal().toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </>
            ) : (
              <p className="text-center text-muted">
                Không có dịch vụ nào cho session này.
              </p>
            )}

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListComputer
