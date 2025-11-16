import axios from "axios"
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./UpdateCustomer.css"

const UpdateCustomer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    type: "",
    balance: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const { username, password, type, balance } = customer

  useEffect(() => {
    loadCustomer()
  }, [])

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }

  const loadCustomer = async () => {
    setIsLoading(true)
    try {
      const result = await axios.get(
        `http://localhost:8080/api/customers/${id}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )

      console.log("Customer id data", result.data)
      setCustomer(result.data)
    } catch (error) {
      console.log(error)
      alert("Không thể tải thông tin khách hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const saveCustomer = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.put(
        `http://localhost:8080/api/customers/update/${id}`,
        customer,
        {
          validateStatus: () => {
            return true
          },
        }
      )
      console.log("Update Customer Successfully")
      alert("Cập nhật thông tin khách hàng thành công!")
      // Có thể navigate về trang danh sách customer
      // navigate("/main/list-customer")
    } catch (error) {
      console.log(error)
      alert("Cập nhật thông tin khách hàng thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !username) {
    return (
      <div className="container update-customer">
        <div className="text-center mt-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container update-customer">
      <div className="inner-wrap-update">
        <div className="form-update">
          <div className="title-update text-center">
            <h4
              style={{
                fontSize: "40px",
                color: "Black",
                fontWeight: "600",
                padding: "20px",
              }}
            >
              Cập Nhật Tài Khoản
            </h4>
          </div>

          <form
            autoComplete="off"
            onSubmit={(e) => saveCustomer(e)}
          >
            {/* Username */}
            <div className="input-group mb-3">
              <label
                htmlFor="username"
                className="input-group-text"
              >
                <i className="fa-solid fa-user"></i>
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="Username"
                aria-label="username"
                value={username}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Password */}
            <div className="input-group mb-3">
              <label
                htmlFor="password"
                className="input-group-text"
              >
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Password"
                aria-label="password"
                value={password}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Balance */}
            <div className="input-group mb-3">
              <label
                htmlFor="balance"
                className="input-group-text"
              >
                <i className="fa-solid fa-coins"></i>
              </label>
              <input
                type="number"
                className="form-control"
                name="balance"
                id="balance"
                placeholder="Số dư tài khoản"
                aria-label="balance"
                value={balance}
                onChange={(e) => handleInputChange(e)}
                step="1"
                min="0"
              />
            </div>

            {/* Type */}
            <div className="input-group mb-3">
              <label
                htmlFor="type"
                className="input-group-text"
              >
                <i className="fa-solid fa-user-tag"></i>
              </label>
              <select
                className="form-select"
                name="type"
                id="type"
                value={type}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="Normal">Normal</option>
                <option value="Vip">Vip</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="button-group mt-4">
              <button
                type="submit"
                className="btn btn-success w-100 mb-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save me-2"></i>
                    Cập Nhật
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Quay Lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateCustomer
