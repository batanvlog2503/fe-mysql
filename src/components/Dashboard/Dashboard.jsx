import React, { useEffect, useState } from "react"
import "./Dashboard.css"
import axios from "axios"
const Dashboard = () => {
  const [computers, setComputers] = useState([])
  const [computersUsing, setComputersUsing] = useState([])
  const [computersOffline, setComputersOffline] = useState([])
  const [computersMaintenance, setComputersMaintenance] = useState([])
  const [products, setProducts] = useState([])
  const [sessions, setSessions] = useState([])
  const [customers, setCustomers] = useState([])
  const [allOrderedProducts, setAllOrderedProducts] = useState([])
  useEffect(() => {
    loadComputers()
    loadCustomers()
    loadSessions()
    loadProducts()
    loadAllOrderedProducts()
  }, [])
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

  const loadComputers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/computers`, {
        validateStatus: () => {
          return true
        },
      })
      console.log(response.data)
      setComputers(response.data)
      const computerUsing = response.data.filter((el, index) => {
        return el.status === "Using"
      })

      setComputersUsing(computerUsing)
      const computerOffline = response.data.filter(
        (el) => el.status === "Offline"
      )
      setComputersOffline(computerOffline)
      const computerMaintenance = response.data.filter(
        (el) => el.status === "Maintenance"
      )
      setComputersMaintenance(computerMaintenance)
    } catch (error) {
      console.log(error)
      alert("Load Computers Failed")
    }
  }
  const loadSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/sessions`, {
        validateStatus: () => {
          return true
        },
      })

      console.log("Session Data: ", response.data)
      setSessions(response.data)
    } catch (error) {
      console.log(error)
      alert("Load Session Failed")
    }
  }
  const loadCustomers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/customers", {
        validateStatus: () => true,
      })

      console.log("Customer Data: ", result.data)
      setCustomers(result.data)
    } catch (error) {
      console.log(error)
      alert("Load Customer Failed")
    }
  }

  const calculateTotalRevenue = () => {
    return sessions.reduce((sum, session) => {
      return sum + (session.total || 0)
    }, 0)
  }
  const loadProducts = async () => {
    try {
      // Lấy danh sách tất cả products
      const result = await axios.get("http://localhost:8080/api/products", {
        validateStatus: () => true,
      })
      console.log("product data:", result.data)
      setProducts(result.data)
    } catch (error) {
      console.log(error)
      alert("Product Data Failed")
    }
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

  return (
    <div className="container-fluid dashboard-wrapper">
      <div className="container">
        <div className="inner-wrap-dashboard">
          {/* Top Stats Section */}
          <div className="row inner-wrap-info-up">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="stat-card dashboard-computer">
                <div className="stat-header">
                  <p className="stat-title">Lãi Dịch Vụ</p>
                  <div className="stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24"
                      height="24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-body">
                  <h4 className="stat-value">
                    {calculateTotalOrder().toLocaleString("vi-VN")}
                  </h4>
                  <p className="stat-description">VND</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="stat-card dashboard-profit">
                <div className="stat-header">
                  <p className="stat-title">Doanh Thu</p>
                  <div className="stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24"
                      height="24"
                    >
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-body">
                  <h4 className="stat-value">
                    {calculateTotalRevenue().toLocaleString("vi-VN")}
                  </h4>
                  <p className="stat-description">VNĐ</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="stat-card dashboard-customer">
                <div className="stat-header">
                  <p className="stat-title">Khách Hàng</p>
                  <div className="stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24"
                      height="24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-body">
                  <h4 className="stat-value">{customers.length}</h4>
                  <p className="stat-description">Đã Sử Dụng Dịch Vụ</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="stat-card dashboard-efficiency">
                <div className="stat-header">
                  <p className="stat-title">Đồ Ăn</p>
                  <div className="stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24"
                      height="24"
                    >
                      <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-body">
                  <h4 className="stat-value">{products.length}</h4>
                  <p className="stat-description">Mặt Hàng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="row inner-wrap-info-down">
            {/* <div className="col-lg-6 col-md-12 mb-4">
              <div className="info-card dashboard-audit-log">
                <h3 className="card-title">Lịch Sử Gần Đây</h3>
                <div className="card-content">
                  <div className="history-item">
                    <span className="history-time">10:30 AM</span>
                    <span className="history-text">
                      Máy #12 bắt đầu sử dụng
                    </span>
                  </div>
                  <div className="history-item">
                    <span className="history-time">10:15 AM</span>
                    <span className="history-text">
                      Thanh toán đơn hàng #4567
                    </span>
                  </div>
                  <div className="history-item">
                    <span className="history-time">09:45 AM</span>
                    <span className="history-text">
                      Máy #08 hoàn thành bảo trì
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="col-lg-12 col-md-12 mb-4">
              <div className="info-card dashboard-computer-status">
                <h3 className="card-title">Tổng Quan Máy Tính</h3>
                <div className="card-content">
                  <div className="status-item">
                    <div className="status-left">
                      <div className="status-icon computer-blank">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                          />
                        </svg>
                      </div>
                      <p className="status-label">Máy Trống</p>
                    </div>
                    <span className="status-count">
                      {computersOffline.length}
                    </span>
                  </div>

                  <div className="status-item">
                    <div className="status-left">
                      <div className="status-icon computer-using">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                          />
                        </svg>
                      </div>
                      <p className="status-label">Đang Sử Dụng</p>
                    </div>
                    <span className="status-count">
                      {computersUsing.length}
                    </span>
                  </div>

                  <div className="status-item">
                    <div className="status-left">
                      <div className="status-icon computer-maintenance">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                          />
                        </svg>
                      </div>
                      <p className="status-label">Bảo Trì</p>
                    </div>
                    <span className="status-count">
                      {computersMaintenance.length}
                    </span>
                  </div>
                  <div className="status-item">
                    <div className="status-left">
                      <div className="status-icon computer-number">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                          />
                        </svg>
                      </div>
                      <p className="status-label">Tổng Số Máy</p>
                    </div>
                    <span className="status-count">{computers.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
