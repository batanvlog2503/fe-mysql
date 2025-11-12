import React, { useState, useEffect } from "react"
import axios from "axios"
import qr from "./ImgQr/qr.png"
import { useLocation } from "react-router-dom"
import "./Payment.css"

const Payment = () => {
  const location = useLocation()
  const { loginInfo, services, session, computer } = location.state || {}
  const [orderedProducts, setOrderedProducts] = useState([])

  useEffect(() => {
    if (session?.sessionId) loadOrderedProducts()
  }, [session?.sessionId])

  const loadOrderedProducts = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/serviceproducts/session/${session.sessionId}`,
        { validateStatus: () => true }
      )
      if (result.status === 200) setOrderedProducts(result.data)
      else setOrderedProducts([])
    } catch (error) {
      console.error("Error loading products:", error)
      setOrderedProducts([])
    }
  }

  const totalPrice = Array.isArray(orderedProducts)
    ? orderedProducts.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      )
    : 0

  return (
    <div className="payment-container">
      <div className="payment-content">
        <h1 className="payment-title">Hóa Đơn Thanh Toán Dịch Vụ</h1>

        {/* Thông tin chung */}
        <div className="payment-info">
          <div className="info-card">
            <h4>Máy tính</h4>
            <p>{computer?.computerId || "N/A"}</p>
          </div>
          <div className="info-card">
            <h4>Phiên làm việc</h4>
            <p>{session?.sessionId || "N/A"}</p>
          </div>
          <div className="info-card">
            <h4>Người dùng</h4>
            <p>{loginInfo?.username || "N/A"}</p>
          </div>
        </div>

        {/* Khu vực chính: Bảng + QR */}
        <div className="payment-main">
          {/* Bên trái: bảng */}
          <div className="payment-table">
            <div className="table-wrapper">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr className="text-center">
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {Array.isArray(orderedProducts) &&
                  orderedProducts.length > 0 ? (
                    orderedProducts.map((item, index) => (
                      <tr key={item.productId || index}>
                        <td>{item.productId}</td>
                        <td>{item.productName}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{(item.price || 0).toLocaleString()}₫</td>
                        <td>
                          {(
                            (item.price || 0) * (item.quantity || 0)
                          ).toLocaleString()}
                          ₫
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center"
                      >
                        Chưa có sản phẩm nào
                      </td>
                    </tr>
                  )}

                  {orderedProducts.length > 0 && (
                    <tr className="fw-bold">
                      <td
                        colSpan="5"
                        className="text-end"
                      >
                        Tổng cộng:
                      </td>
                      <td>{totalPrice.toLocaleString()}₫</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bên phải: QR */}
          <div className="payment-qr">
            <img
              src={qr}
              alt="QR Code"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
