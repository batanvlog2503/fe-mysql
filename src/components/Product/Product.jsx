import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import "./Product.css"

const Product = ({ customer, service }) => {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // Lấy danh sách tất cả products
      const result = await axios.get("http://localhost:8080/api/products", {
        validateStatus: () => true,
      })
      if (result.status === 200) {
        setProducts(result.data)
      } else {
        alert("Result product failed")
      }
    } catch (error) {
      alert("API Products isn't loaded")
    }
  }

  const handleInputChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(value) || 0,
    }))
  }

  const saveProducts = async (product) => {
    try {
      const quantity = quantities[product.productId] || 0

      if (quantity <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ")
        return
      }

     // Lưu vào bảng service_product
      await axios.post("http://localhost:8080/api/serviceproducts", {
        service: service,
        product: product,
        quantity: quantity,
      })

      // await axios.post("http://localhost:8080/api/serviceproducts/post", {
      //   service: service,
      //   productId: product,
      //   quantity: quantity,
      // })
      console.log("Service" + service)
      // Reset input
      setQuantities((prev) => ({
        ...prev,
        [product.productId]: 0,
      }))

      alert("Đặt hàng thành công!")
    } catch (error) {
      console.error("Save failed", error)
      alert("Failed to save Product. Please try again.")
    }
  }

  return (
    <div className="container computer-product">
      <div className="inner-wrap-computer-product">
        <div className="row">
          <div className="product-update">
            <button className="btn btn-danger update">Update</button>
          </div>
          {products.map((product, index) => (
            <div
              className="col-xl-6 col-lg-6 col-sm-12 col-12 product-details"
              key={index}
            >
              <h4>
                {product?.productId}. Tên : {product?.productName}
              </h4>
              <div className="product-img">
                <img
                  src={`/ImgProduct/img${product.productId}.jpg`}
                  alt={product.productName}
                />
              </div>
              <h4>Loại : {product.category}</h4>
              <h4>Giá : {product.price.toLocaleString()} VND</h4>

              <div className="order-product">
                <form
                  action=""
                  className="input-group"
                  onSubmit={(e) => {
                    e.preventDefault()
                    saveProducts(product)
                  }}
                >
                  <label
                    htmlFor={`quantity-${product.productId}`}
                    className="input-group-text"
                  ></label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    id={`quantity-${product.productId}`}
                    placeholder="Số lượng"
                    value={quantities[product.productId] || 0}
                    onChange={(e) =>
                      handleInputChange(product.productId, e.target.value)
                    }
                    required
                    min="1"
                  />
                  <button
                    type="submit"
                    className="btn btn-outline-success"
                  >
                    Đặt
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Product
