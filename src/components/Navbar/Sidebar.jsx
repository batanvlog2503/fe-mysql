import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
// import { UserContext } from "./UserContext";
import "./Sidebar.css"

const Sidebar = () => {
  //const { user, setUser } = useContext(UserContext);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link
          to="/"
          className="logo"
        >
          <span className="tech">TANTAN</span>
          <span className="blog">NET</span>
        </Link>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <i className="fa-solid fa-house"></i> Đặt máy
          </Link>
        </li>
        <li>
          <Link to="/deposit-money">
            <i className="fa-solid fa-newspaper"></i> Nạp Tiền
          </Link>
        </li>
        <li>
          <Link to="/list-computer">
            <i className="fa-solid fa-computer"></i> Máy trạm
          </Link>
        </li>
        <li>
          <Link to="/write">
            <i className="fa-solid fa-credit-card"></i> Hóa đơn
          </Link>
        </li>
        <li>
          <Link to="/createaccount">
            <i className="fa-solid fa-pen"></i> Tạo
          </Link>
        </li>

        <li>
          <Link to="/list-customer">
            <i className  ="fa-solid fa-circle-user"></i> Tài khoản
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        {/* // <p>👋 Xin chào, {user?.displayName}</p>
        // <button onClick={handleLogout} className="logout-btn">Log Out</button> */}
        <p>HEllo PTIT</p>
      </div>
    </div>
  )
}

export default Sidebar
