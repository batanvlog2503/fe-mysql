import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Navbar/Sidebar"
import "./MainLayout.css"
const MainLayout = () => {
  return (
    <div className="container-fluid main-layout">
      <div className="row">
        <div className="col-2">
          <Sidebar></Sidebar>
        </div>
        <div className="col-10 content-area">
          <Outlet />
        </div>
      </div>
    </div>
  ) 
}

export default MainLayout
