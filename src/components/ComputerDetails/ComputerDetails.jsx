import React from "react"
import "./ComputerDetails.css"
import { useState, useEffect } from "react"
import axios from "axios"
import Session from "../Session/Session"
import { useNavigate } from "react-router-dom"
const ComputerDetails = ({ computer }) => {
  const navigate = useNavigate()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [computerStatus, setComputerStatus] = useState(
    computer?.status || "Offline"
  )
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    type: "",
    balance: "",
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  })
  const [session, setSession] = useState(false)
  // Load thông tin từ localStorage khi component mount hoặc computer thay đổi
  useEffect(() => {
    const loadComputerData = async () => {
      // Reset tất cả state khi không có computer
      if (!computer?.computerId) {
        setComputerStatus("Offline")
        setIsLoggedIn(false)
        setLoginInfo({
          username: "",
          password: "",
          type: "",
          balance: "",
        })
        return
      }

      // QUAN TRỌNG: Reset state trước khi load dữ liệu mới
      setIsLoggedIn(false)
      setLoginInfo({
        username: "",
        password: "",
        type: "",
        balance: "",
      })
      setComputerStatus(computer?.status || "Offline")

      // Kiểm tra localStorage cho máy CỤ THỂ này
      const savedSession = localStorage.getItem(
        `computer_${computer.computerId}_session`
      )

      if (savedSession) {
        try {
          const sessionData = JSON.parse(savedSession)

          // Kiểm tra xem dữ liệu có hợp lệ không
          if (sessionData.loginInfo && sessionData.isLoggedIn) {
            setLoginInfo(sessionData.loginInfo)
            setIsLoggedIn(true)
            setComputerStatus(sessionData.computerStatus || computer.status)
            setSession(sessionData.session)
          }
        } catch (error) {
          console.error("Error parsing saved session:", error)
          localStorage.removeItem(`computer_${computer.computerId}_session`)
        }
      }
    }

    loadComputerData()
  }, [computer?.computerId])

  const handleOpenLogin = () => {
    if (computerStatus === "Using" && isLoggedIn) {
      alert("Máy đang được sử dụng")
      return
    }
    setShowLoginForm(true)
  }

  const handleCloseLogin = () => {
    setShowLoginForm(false)
    setLoginFormData({
      username: "",
      password: "",
    })
  }

  const handleChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!computer || !computer.computerId) {
      alert("Không tìm thấy thông tin máy tính")
      return
    }

    try {
      const result = await axios.get("http://localhost:8080/api/customers", {
        validateStatus: () => true,
      })

      const data = result.data
      const { username, password } = loginFormData
      const foundUser = data.find(
        (u) => u.username === username && u.password === password
      )

      if (foundUser) {
        const computerId = computer.computerId

        // Cập nhật trạng thái máy
        await axios.put(
          `http://localhost:8080/api/computers/update/${computerId}`,
          {
            ...computer,
            status: "Using",
          }
        )
        const startTime = new Date().toISOString()

        // TẠO SESSION NGAY TẠI ĐÂY
        const sessionResponse = await axios.post(
          "http://localhost:8080/api/sessions",
          {
            computerId: computerId,
            customerId: foundUser.id,
            startTime: startTime,
            endTime: null,
            total: 0,
          }
        )

        const newSession = sessionResponse.data // có sessionId

        // Lưu vào localStorage
        localStorage.setItem(
          `computer_${computerId}_session`,
          JSON.stringify({
            loginInfo: foundUser,
            isLoggedIn: true,
            computerStatus: "Using",
            session: {
              sessionId: newSession.id,
              startTime: startTime,
              computerId: computerId,
              customerId: foundUser.id,
            },
          })
        )

        // Cập nhật state
        setLoginInfo(foundUser)
        setIsLoggedIn(true)
        setComputerStatus("Using")
        setSession({
          sessionId: newSession.id,
          startTime: startTime,
          computerId: computerId,
          customerId: foundUser.id,
        })
        alert("Đăng nhập thành công")
        handleCloseLogin()
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu")
      }
    } catch (error) {
      console.error("Error during login:", error)
      alert("Lỗi khi đăng nhập: " + error.message)
    }
  }

  const handleShutDownChange = async () => {
    if (!computer) return

    if (!isLoggedIn) {
      alert("Máy chưa được bật")
      return
    }

    try {
      const endTime = new Date().toISOString()
      const storageKey = `computer_${computer.computerId}_session`
      const savedData = localStorage.getItem(storageKey)

      let currentSession = null

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          if (parsedData.session && parsedData.session.startTime) {
            currentSession = parsedData.session
            console.log("Session từ localStorage:", currentSession)
          }
        } catch (error) {
          console.error("Error parsing localStorage:", error)
        }
      }

      if (!currentSession || !currentSession.startTime) {
        alert("Không tìm thấy session để tính tiền!")
        return
      }

      // Tính thời gian & tiền
      const start = new Date(currentSession.startTime)
      const end = new Date(endTime)
      const diffInHours = (end - start) / (1000 * 60 * 60)
      const totalCost = Math.ceil(diffInHours * 5000)

      const confirmShutdown = window.confirm(
        `Thời gian sử dụng: ${diffInHours.toFixed(2)} giờ\n` +
          `Tổng tiền: ${totalCost.toLocaleString("vi-VN")} VND\n\n` +
          `Bạn có chắc muốn tắt máy?`
      )

      if (!confirmShutdown) return

      const newBalance = parseInt(loginInfo.balance) - totalCost

      // Cập nhật balance
      await axios.put(
        `http://localhost:8080/api/customers/update/${loginInfo.id}`,
        {
          ...loginInfo,
          balance: newBalance.toString(),
        }
      )

      // Cập nhật session với endTime và total
      if (currentSession.sessionId) {
        console.log("Updating session:", currentSession.sessionId)
        try {
          await axios.put(
            `http://localhost:8080/api/sessions/update/${currentSession.sessionId}`,
            {
              ...currentSession,
              endTime: endTime,
              total: totalCost,
            }
          )
          console.log("Session updated successfully")
        } catch (error) {
          console.error("Error updating session:", error)
          alert("Lỗi cập nhật session: " + error.message)
        }
      } else {
        console.warn("Không có sessionId, bỏ qua cập nhật session")
        console.log("Current session data:", session)
      }

      // Cập nhật trạng thái máy
      await axios.put(
        `http://localhost:8080/api/computers/update/${computer.computerId}`,
        {
          ...computer,
          status: "Offline",
        }
      )

      // Xóa localStorage và reset state
      localStorage.removeItem(storageKey)
      setComputerStatus("Offline")
      setIsLoggedIn(false)
      setLoginInfo({
        username: "",
        password: "",
        type: "",
        balance: "",
      })

      alert(
        `Tắt máy thành công!\n` +
          `Thời gian: ${diffInHours.toFixed(2)} giờ\n` +
          `Tiền: ${totalCost.toLocaleString("vi-VN")} VND\n` +
          `Số dư còn lại: ${newBalance.toLocaleString("vi-VN")} VND`
      )
    } catch (error) {
      console.error("Error shutting down computer:", error)
      alert("Có lỗi khi tắt máy: " + error.message)
    }
  }

  return (
    <div className="container computer-service">
      <div className="inner-wrap-computer-service">
        {computer ? (
          <>
            <h1>Máy: {computer.computerId}</h1>

            <div className="row">
              <div className="info-computer col-xl-8 col-lg-8 col-sm-12 col-12">
                <div className="status-computer mb-3">
                  <b>Tình trạng:</b> {computerStatus}
                </div>

                {isLoggedIn && loginInfo && loginInfo.username ? (
                  <div className="time-info">
                    <p>
                      <b>Username: </b>
                      {loginInfo.username}
                    </p>
                    <p>
                      <b>Type: </b>
                      {loginInfo.type}
                    </p>
                    <p>
                      <b>Balance: </b>
                      {loginInfo.balance} VND
                    </p>

                    <Session
                      computerSelected={computer}
                      customerSelected={loginInfo}
                    />
                  </div>
                ) : null}

                <div className="actions mt-3">
                  {!isLoggedIn && (
                    <button
                      className="btn btn-success me-2"
                      onClick={handleOpenLogin}
                    >
                      Bật máy
                    </button>
                  )}
                  {isLoggedIn && (
                    <div>
                      <button
                        className="btn btn-danger"
                        onClick={handleShutDownChange}
                      >
                        Tắt máy
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate("/service", { state: { loginInfo } })
                        }
                      >
                        Dịch Vụ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Hãy chọn một máy để xem thông tin chi tiết.</p>
        )}
      </div>

      <div className="inner-wrap-computer-login">
        {showLoginForm && (
          <div className="login-modal">
            <div className="login-content">
              <h3>Đăng nhập để bật máy</h3>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    name="username"
                    value={loginFormData.username}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCloseLogin}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComputerDetails
