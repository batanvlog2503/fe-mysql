import React, { useEffect, useState } from "react"
import "./User.css"
import axios from "axios"
import { Outlet, useNavigate, useParams } from "react-router-dom"
const User = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState({
    username: "",
    password: "",
  })
  const handleInputChange = (e) => {
    setUsers({ ...users, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    //  Chặn người dùng quay lại trang trước khi login
    window.history.pushState(null, "", window.location.href)
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href)
    }
    window.addEventListener("popstate", handleBack)

    return () => {
      window.removeEventListener("popstate", handleBack)
    }
  }, [])
  useEffect(() => {
    setUsers({ username: "", password: "" })
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const loginData = {
        username: users.username,
        password: users.password,
      }

      // Gọi API login tới backend
      const response = await axios.get("http://localhost:8080/api/admin/1", {
        validateStatus: () => {
          return true
        },
      })

      if (
        loginData.username === response.data.username &&
        loginData.password === response.data.password
      ) {
        alert("Login Successfully")
        navigate("/main")
      } else {
        alert("Wrong username or password")
      }
    } catch (error) {
      console.log(error)
      alert("Login Admin Failed")
    }
  }
  return (
    <div className="container-fluid login">
      {/* <NavbarLogin></NavbarLogin> */}

      <div className="wrapper launch">
        <div className="form-login py-2 px-5">
          <div
            className="title-login text-center"
            style={{ padding: "30px" }}
          >
            <h1 style={{ fontSize: "50px", color: "Black", fontWeight: "700" }}>
              Login
            </h1>
          </div>
          <form
            action=""
            className="input-group mb-5"
            onSubmit={(e) => handleSubmit(e)}
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
                placeholder="username"
                aria-label="username"
                aria-describedby="basic-addon1"
                value={users.username}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>

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
                placeholder="password"
                aria-label="password"
                aria-describedby="basic-addon3"
                value={users.password}
                onChange={(e) => handleInputChange(e)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="button-submit">
              <button
                type="submit"
                className="btn btn-outline-success w-100"
              >
                Login
              </button>
            </div>
            {/* <div className="register-link d-flex flex-row justify-content-between align-items-center w-100">
              <p className="mb-0">Don't have an account?</p>
              <button
                type="button"
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default User
