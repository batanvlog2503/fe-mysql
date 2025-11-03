import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import "./Product.css"
const Product = ({ customer }) => {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})
  const [orderedItems, setOrderedItems] = useState([])
  useEffect(() => {
    loadProducts()
  }, [])
  const loadProducts = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/products", {
        validateStatus: () => {
          return true
        },
      })
      if (result.status === 200) {
        setProducts(result.data)
        console.log(products)
      } else {
        alert("Result product failed")
      }
    } catch (error) {
      alert("API Products isn's loaded")
    }
  }
  const handleInputChange = (productId, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, quantity: parseInt(value) } : p
      )
    )
  }
  const saveProducts = async (product) => {
    //Ngăn trình duyệt reload lại trang khi form được submit
    try {
      await axios.put(
        `http://localhost:8080/api/products/update/${product.productId}`,
        product
      )
      // Option 1: Reset form
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === product.productId ? { ...p, quantity: 0 } : p
        )
      )

      // navigate("/view-student")  // nếu dùng useNavigate()
      alert("Successfully!!!")
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
                  alt={`/ImgProduct/img${product.productId}.jpg`}
                />
              </div>
              <h4>Loại : {product.category}</h4>
              <h4>Giá : {product.price} VND</h4>

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
                    htmlFor="quantity"
                    className="input-group-text"
                  ></label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    id="quantity"
                    placeholder="Số lượng"
                    aria-label="quantity"
                    aria-describedby="basic-addon2"
                    value={product?.quantity}
                    onChange={(e) =>
                      handleInputChange(product.productId, e.target.value)
                    }
                    required
                    min="0"
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
