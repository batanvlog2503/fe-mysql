import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { FaCircleInfo } from "react-icons/fa6"
import { IoMdMenu } from "react-icons/io"
const AuditLog = () => {
  const [sessions, setSessions] = useState([])
  const [infoCustomer, setInfoCustomer] = useState({})
  const [showModel, setShowModel] = useState(false)
  const [showService, setShowService] = useState(false)
  const [orderedProducts, setOrderedProducts] = useState([])
  const [allOrderedProducts, setAllOrderedProducts] = useState([])
  useEffect(() => {
    loadSessions()
    loadAllOrderedProducts()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sessions", {
        validateStatus: () => {
          return true
        },
      })

      const completedSessions = response.data.filter(
        (session) => session.endTime && session.total
      )

      console.log("data Session : ", completedSessions)
      setSessions(completedSessions)
    } catch (error) {
      console.log(error)
      alert("get Sessions Failed")
    }
  }

  const handleClickModel = async (customerId) => {
    setShowModel(true)

    if (!customerId) {
      return
    }
    try {
      const result = await axios.get(
        `http://localhost:8080/api/customers/${customerId}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )

      console.log("Customer id", result.data)
      setInfoCustomer(result.data)
    } catch (error) {
      console.log(error)
      alert("Get Info Customer Failed")
    }
  }
  const loadAllOrderedProducts = async () => {
    try {
      // Load tất cả service products từ tất cả sessions
      const response = await axios.get(
        "http://localhost:8080/api/serviceproducts",
        {
          validateStatus: () => true,
        }
      )
      setAllOrderedProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleClickService = async (sessionId) => {
    setShowService(true)
    if (!sessionId) {
      return
    }
    try {
      const result = await axios.get(
        `http://localhost:8080/api/serviceproducts/session/${sessionId}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )

      console.log("serviceProduct data", result.data)
      setOrderedProducts(result.data)
    } catch (error) {
      console.log(error)
      alert("Get Service Failed")
    }
  }
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A"

    const [datePart, timePart] = isoString.split("T")
    const [year, month, day] = datePart.split("-")
    const [time] = timePart.split(".")
    const [hours, minutes, seconds] = time.split(":")

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  // Tính tổng doanh thu
  const calculateTotalRevenue = () => {
    return sessions.reduce((sum, session) => {
      return sum + (session.total || 0)
    }, 0)
  }

  const calculateTotalOrder = () => {
    if (!Array.isArray(allOrderedProducts) || allOrderedProducts.length === 0) {
      return 0
    }

    const totalQuantity = allOrderedProducts.reduce((sum, item) => {
      return sum + (item.quantity || 0)
    }, 0)

    return totalQuantity * 5000
  }
  const calculateTimeUse = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A"

    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    return `${hours}h ${minutes}m ${seconds}s`
  }
  const totalPrice = Array.isArray(orderedProducts)
    ? orderedProducts.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      )
    : 0
  return (
    <div className="container audit-log">
      <h2>Danh Sách Session</h2>
      <div className="search-computer search-customer"></div>

      {/* Hiển thị Tổng Doanh Thu */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#d4edda",
          borderRadius: "5px",
          textAlign: "right",
        }}
      >
        <h4 style={{ margin: 0, color: "#155724" }}>
          Tổng Doanh Thu:{" "}
          <span style={{ fontWeight: "bold" }}>
            {calculateTotalRevenue().toLocaleString("vi-VN")} VND
          </span>
        </h4>
      </div>
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#d5d6d9ff",
          borderRadius: "5px",
          textAlign: "right",
        }}
      >
        <h4 style={{ margin: 0, color: "#b92020ff" }}>
          Tổng Lãi Mặt Hàng:{" "}
          <span style={{ fontWeight: "bold" }}>
            {calculateTotalOrder().toLocaleString("vi-VN")} VND
          </span>
        </h4>
      </div>

      <div className="inner-wrap-audit-log">
        <table className="table table-bordered align-middle text-center">
          <thead>
            <tr className="table-success">
              <th>Audit Log</th>
              <th>Customer ID</th>
              <th>Username</th>
              <th>Computer ID</th>
              <th>Session ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Time Use</th>
              <th>Total</th>
              <th>Info </th>
              <th>Dịch Vụ</th>
            </tr>
          </thead>
          <tbody>
            {sessions && sessions.length > 0 ? (
              sessions.map((session, index) => (
                <tr key={index}>
                  <td>
                    <b>{index + 1}</b>
                  </td>
                  <td>{session.customerId}</td>
                  <td>
                    <b>
                      {session.services?.length > 0
                        ? session.services[0].customer.username
                          : "No user"}
                    </b>
                  </td>
                  <td>{session.computerId}</td>
                  <td>{session.sessionId}</td>
                  <td style={{ fontWeight: "bold", color: "#31bf52ff" }}>
                    {formatDateTime(session.startTime)}
                  </td>
                  <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {formatDateTime(session.endTime)}
                  </td>
                  <td>
                    {calculateTimeUse(session.startTime, session.endTime)}
                  </td>
                  <td style={{ fontWeight: "700" }}>
                    {session?.total >= 0 ? `${session.total} VND` : ""}
                  </td>

                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleClickModel(session.customerId)}
                    >
                      <FaCircleInfo />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleClickService(session.sessionId)}
                    >
                      <IoMdMenu />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <h1>NOT FOUND SESSION</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModel && (
        <div
          className="show-modal"
          onClick={() => setShowModel(false)}
        >
          <div
            className="table-show-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{ marginBottom: "20px" }}
              className="d-flex justify-content-between text-center"
            >
              <h4>Customer </h4>
            </div>
            <div>
              <h3>Username: {infoCustomer?.username}</h3>

              <h3>Type: {infoCustomer?.type}</h3>
              <h3>Created At: {formatDateTime(infoCustomer?.createdAt)}</h3>

              <h3>Balance: {infoCustomer?.balance} VND</h3>
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModel(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {showService && (
        <div
          className="show-modal"
          onClick={() => setShowService(false)}
        >
          <div className="table-show-modal">
            <div
              style={{ marginBottom: "20px" }}
              className="d-flex justify-content-between text-center"
            >
              <h4>Dịch vụ</h4>
              <button
                onClick={() => setShowService(false)}
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

            {orderedProducts.length > 0 ? (
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
                    {orderedProducts.map((item, index) => (
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
                        {totalPrice.toLocaleString("vi-VN")} ₫
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
                onClick={() => setShowService(false)}
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

export default AuditLog
