import React from "react"
import "./ProductDetails.css"
import { useState, useEffect } from "react"
import axios from "axios"

const ProductDetails = ({ customer }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/products", {
        validateStatus: () => true,
      })
      if (result.status === 200) {
        setProducts(result.data)
        console.log(result.data)
      } else {
        alert("Result product failed")
      }
    } catch (error) {
      alert("API Products isn't loaded")
    }
  }

  // 👉 Tính tổng tiền tất cả sản phẩm có quantity > 0
  const totalPrice = products
    .filter((p) => p?.quantity > 0)
    .reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <div className="container product-details">
      <div className="inner-wrap-product-details">
        <div className="title text-center">
          <h2 style={{ color: "white" }}>Thông Tin</h2>
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
              </tr>
            </thead>
            <tbody className="text-center">
              {products
                .filter((p) => p?.quantity > 0)
                .map((product, index) => (
                  <tr key={index}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price.toLocaleString()}₫</td>
                  </tr>
                ))}
              {/* 👉 Thêm dòng tổng tiền ở cuối bảng */}
              <tr className="fw-bold">
                <td
                  colSpan="4"
                  className="text-end"
                >
                  Tổng giá:
                </td>
                <td>{totalPrice.toLocaleString()}₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
