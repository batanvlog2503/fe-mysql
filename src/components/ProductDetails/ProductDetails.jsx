import React from "react"
import "./ProductDetails.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
const ProductDetails = ({ customer, service, session, computer }) => {
  const [orderedProducts, setOrderedProducts] = useState([]) // ĐỔI TỪ {} SANG []

  useEffect(() => {
    if (service?.serviceId) {
      loadOrderedProducts()
    }
  }, [service?.serviceId])

  const loadOrderedProducts = async () => {
    try {
      // Lấy danh sách sản phẩm đã đặt của service này
      const result = await axios.get(
        `http://localhost:8080/api/serviceproducts/service/${service.serviceId}`,
        {
          validateStatus: () => true,
        }
      )
      if (result.status === 200) {
        setOrderedProducts(result.data)
        console.log(result.data)
      } else if (result.status === 204) {
        // Không có sản phẩm nào
        setOrderedProducts([])
        console.log("No products found")
      } else {
        alert("Result product failed")
      }
    } catch (error) {
      console.error("Error loading products:", error)
      alert("API Products isn't loaded")
    }
  }

  const handleDeleteProduct = async (productId, sessionId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/serviceproducts?sessionId=${sessionId}&productId=${productId}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )
      console.log("Delete Product Successfully")
      loadOrderedProducts()
    } catch (error) {
      console.log(error)
      alert("Delete Product Failed")
    }
  }
  // Tính tổng tiền
  const totalPrice = Array.isArray(orderedProducts)
    ? orderedProducts.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      )
    : 0

  return (
    <div className="container product-details">
      <div className="inner-wrap-product-details">
        <div className="title text-center">
          <h2 style={{ color: "black" }}>Thông Tin Dịch Vụ</h2>
        </div>
        <div className="title-customer">
          <h4>Id Customer: {customer.id}</h4>
          <h4>Xin chào : {customer.username}</h4>
          <h4>Service : {service.serviceId}</h4>
          <h4>Session : {session.sessionId}</h4>
          <h4>Computer: {computer.computerId}</h4>
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
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(orderedProducts) && orderedProducts.length > 0 ? (
                orderedProducts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productId}</td>
                    <td>{item.productName}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()}₫</td>
                    <td>{(item.price * item.quantity).toLocaleString()}₫</td>
                    <td>
                      <button
                        className="btn btn-danger delete-product"
                        onClick={() =>
                          handleDeleteProduct(item.productId, session.sessionId)
                        }
                      >
                        <FaTrashAlt />
                      </button>
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

          <div className="payment"></div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
