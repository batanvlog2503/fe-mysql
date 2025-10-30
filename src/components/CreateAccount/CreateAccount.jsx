import React, { useState } from "react"
import "./CreateAccount.css"
import axios from "axios"
const CreateAccount = () => {
  const [customers, setCustomers] = useState({
    username: "",
    password: "",

    type: "",
    balance: "",
  })

  const { username, password, type, balance } = customers
  const handleInputChange = (e) => {
    setCustomers({ ...customers, [e.target.name]: e.target.value })
  }

  const saveCustomers = async (e) => {
    e.preventDefault()

    try {
      const customerData = {
        username: customers.username,
        password: customers.password,
        type: customers.type || "Normal",
        balance: customers.balance ? parseInt(customers.balance) : 0,
      }
      await axios.post("http://localhost:8080/api/customers", customerData)

      setCustomers({
        username: "",
        password: "",

        type: "",
        balance: "",
      })

      console.log("Sign Up Successfully")
      alert("Sign UpSuccessfully")
    } catch (error) {
      console.log("message", error)
      alert("Post Customer Failed")
    }
  }
  return (
    <div className="container create-account">
      <div className="inner-wrap-create-account launch">
        <div className="form-login">
          <div className="title-login text-center">
            <h1
              style={{
                fontSize: "50px",
                color: "Orange",
                fontWeight: "600",
                padding: "20px",
              }}
            >
              Sign Up
            </h1>
          </div>

          <form
            action=""
            className="input-group mb-5"
            autoComplete="off"
            onSubmit={(e) => saveCustomers(e)}
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
                step="1000" // mỗi lần tăng giảm là 1000
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

export default CreateAccount
