import React, { useContext } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
// import { UserContext } from "./UserContext";
import "./Sidebar.css"
import { MdDashboard } from "react-icons/md"
import { useEffect } from "react"
const Sidebar = () => {
  //const { user, setUser } = useContext(UserContext);
  
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate("/")
  }
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link
          to="/main/dashboard"
          className="logo"
        >
          <span className="tech">TANTAN</span>
          <span className="blog">NET</span>
        </Link>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/main/dashboard">
            <MdDashboard /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/main/computer">
            <i className="fa-solid fa-house"></i> Đặt máy
          </Link>
        </li>

        <li>
          <Link to="/main/list-computer">
            <i className="fa-solid fa-computer"></i> Máy trạm
          </Link>
        </li>

        <li>
          <Link to="/main/list-customer">
            <i className="fa-solid fa-circle-user"></i> Tài khoản
          </Link>
        </li>
        <li>
          <Link to="/main/deposit-money">
            <i className="fa-solid fa-newspaper"></i> Nạp Tiền
          </Link>
        </li>
        <li>
          <Link to="/main/create-account">
            <i className="fa-solid fa-pen"></i> Tạo
          </Link>
        </li>
        <li>
          <Link to="/main/audit-log">
            <i className="fa-solid fa-credit-card"></i> Lịch sử
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        {/* // <p>👋 Xin chào, {user?.displayName}</p>
        // <button onClick={handleLogout} className="logout-btn">Log Out</button> */}
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default Sidebar
