import React, { useState, useEffect } from "react"
import axios from "axios"

const ServiceProduct = ({
  computerSelected,
  customerSelected,
  session,
  service,
}) => {
  const [orderedProducts, setOrderedProducts] = useState([])

  useEffect(() => {
    if (session?.sessionId) {
      loadOrderedProducts()
    }
  }, [session?.sessionId])

  const loadOrderedProducts = async () => {
    try {
      // Lấy danh sách sản phẩm đã đặt của service này
      const result = await axios.get(
        `http://localhost:8080/api/serviceproducts/session/${session.sessionId}`,
        {
          validateStatus: () => true,
        }
      )

      if (result.status === 200) {
        setOrderedProducts(result.data)
        console.log("Products loaded:", result.data)
      } else if (result.status === 204) {
        // Không có sản phẩm nào
        setOrderedProducts([])
        console.log("No products found")
      } else {
        console.error("Failed to load products:", result.status)
        setOrderedProducts([])
      }
    } catch (error) {
      console.error("Error loading products:", error)
      setOrderedProducts([])
    }
  }

  // Tính tổng tiền
  const totalPrice = Array.isArray(orderedProducts)
    ? orderedProducts.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      )
    : 0

  // Kiểm tra props có hợp lệ không
  if (!customerSelected || !session) {
    return (
      <div className="container product-details">
        <div className="inner-wrap-product-details">
          <div className="title text-center">
            <h2 style={{ color: "white" }}>Vui lòng chọn máy và đăng nhập</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container product-details">
      <div className="inner-wrap-product-details">
        <div className="title text-center">
          <h2 style={{ color: "white" }}>Thông Tin Đơn Hàng</h2>
        </div>

        <div className="title-customer">
          <h4>ID Customer: {customerSelected.id}</h4>
          <h4>Xin chào: {customerSelected.username}</h4>
          {service?.serviceId && <h4>Service: {service.serviceId}</h4>}
          <h4>Session: {session.sessionId}</h4>
          <h4>Computer: {computerSelected.computerId}</h4>
        </div>

        <div className="row text-center">
          <table className="table table-bordered table-hover">
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(orderedProducts) && orderedProducts.length > 0 ? (
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

              {/* Dòng tổng tiền - chỉ hiện khi có sản phẩm */}
              {Array.isArray(orderedProducts) && orderedProducts.length > 0 && (
                <tr className="fw-bold">
                  <td
                    colSpan="5"
                    className="text-end"
                  >
                    Tổng giá:
                  </td>
                  <td>{totalPrice.toLocaleString()}₫</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="payment">
            {/* Có thể thêm nút thanh toán ở đây */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceProduct
