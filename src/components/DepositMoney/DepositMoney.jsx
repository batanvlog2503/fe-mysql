import React, { useState } from "react"
import "./DepositMoney.css"
import axios from "axios"

const DepositMoney = () => {
  const [customer, setCustomer] = useState({
    username: "",
    balance: "",
  })
  const [currentBalance, setCurrentBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }

  // Tìm kiếm customer theo username
  const loadCustomer = async () => {
    if (!customer.username) {
      alert("Vui lòng nhập username")
      return
    }

    setIsLoading(true)
    try {
      const result = await axios.get(
        `http://localhost:8080/api/customers/name/${customer.username}`
      )

      if (result.status === 200) {
        setCurrentBalance(result.data.balance || 0)
        alert(`Tìm thấy tài khoản! Số dư hiện tại: ${result.data.balance} VNĐ`)
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 404) {
        alert("Không tìm thấy tài khoản với username này")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Nạp tiền vào tài khoản
  const depositMoney = async (e) => {
    e.preventDefault()

    if (!customer.username) {
      alert("Vui lòng nhập username")
      return
    }

    if (!customer.balance || parseInt(customer.balance) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ")
      return
    }

    setIsLoading(true)
    try {
      // Tính số dư mới = số dư hiện tại + số tiền nạp
      const depositAmount = parseInt(customer.balance)
      const newBalance = currentBalance + depositAmount

      // Gọi API update balance
      const result = await axios.put(
        `http://localhost:8080/api/customers/name/update/${customer.username}`,
        { balance: newBalance },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (result.status === 200) {
        alert(`Nạp tiền thành công! Số dư mới: ${newBalance} VNĐ`)
        setCurrentBalance(newBalance)
        setCustomer({
          username: customer.username, // Giữ lại username
          balance: "", // Clear số tiền nạp
        })
      }
    } catch (error) {
      console.log("Error:", error)
      if (error.response?.status === 404) {
        alert("Không tìm thấy tài khoản")
      } else {
        alert("Nạp tiền thất bại. Vui lòng thử lại!")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container create-account deposit-money">
      <div className="inner-wrap-create-account launch">
        <div className="form-login">
          <div className="title-login text-center">
            <h3
              style={{
                fontSize: "50px",
                color: "Black",
                fontWeight: "600",
                padding: "20px",
              }}
            >
              Nạp Tiền
            </h3>
          </div>

          {/* Hiển thị số dư hiện tại */}
          {currentBalance > 0 && (
            <div
              className="alert alert-info text-center"
              role="alert"
            >
              Số dư hiện tại:{" "}
              <strong>{currentBalance.toLocaleString("vi-VN")} VNĐ</strong>
            </div>
          )}

          <form
            className="input-group mb-5"
            autoComplete="off"
            onSubmit={(e) => depositMoney(e)}
          >
      
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
                placeholder="Nhập username"
                aria-label="username"
                value={customer.username}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="off"
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={loadCustomer}
                disabled={!customer.username}
              >
                <i className="fa-solid fa-search"></i> Tìm
              </button>
            </div>

            {/* Balance input */}
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
                placeholder="Số tiền nạp"
                aria-label="balance"
                value={customer.balance}
                onChange={(e) => handleInputChange(e)}
                step="1000"
                min="1000"
                required
              />
            </div>

            {/* Submit button */}
            <div className="button-submit deposit">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={!customer.username}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-money-bill-wave me-2"></i>
                    Nạp Tiền
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DepositMoney
