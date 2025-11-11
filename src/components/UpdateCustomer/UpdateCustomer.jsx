import axios from "axios"
import React, { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useEffect } from "react"
const UpdateCustomer = () => {
  const { id } = useParams()

  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    type: "",
    balance: "",
  })

  const { username, password, type, balance } = customer

  useEffect(() => {
    loadCustomer()
  }, [])

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }
  const loadCustomer = async () => {
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
      alert("Get Customer By Id Failed")
    }
  }

  const saveCustomer = async (e) => {
    e.preventDefault()

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
      console.log("Update Customer By Id Successfully")
      alert("Update Customer By Id Successfully")
    } catch (error) {
      console.log(error)
      alert("Update Customer By Id Failed")
    }
  }

  return (
    <div className="container create-account">
      <div className="inner-wrap-create-account launch">
        <div className="form-login">
          <div className="title-login text-center">
            <h4
              style={{
                fontSize: "40px",
                color: "Black",
                fontWeight: "600",
                padding: "20px",
              }}
            >
              Tạo Tài Khoản
            </h4>
          </div>

          <form
            action=""
            className="input-group mb-5"
            autoComplete="off"
            onSubmit={(e) => saveCustomer(e)}
          >
            <div className="input-group">
              <label
                htmlFor="username"
                className="input-group-text"
              >
                <i
                  className="fa-solid fa-user"
                  style={{ marginLeft: "0px" }}
                ></i>
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="username"
                aria-label="username"
                aria-describedby="basic-addon1"
                value={username}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="input-group">
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
                placeholder="password"
                aria-label="password"
                aria-describedby="basic-addon1"
                value={password}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="input-group ">
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
                aria-describedby="basic-addon1"
                value={balance}
                onChange={(e) => handleInputChange(e)}
                step="1" // mỗi lần tăng giảm là 1000
                min="0" // không cho nhập số âm
              />
            </div>

            <div className="input-group ">
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

            <div className="button-submit sign-up">
              <button
                type="submit"
                className="btn btn-outline-success w-100"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateCustomer
