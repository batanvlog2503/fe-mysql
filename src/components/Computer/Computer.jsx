import React, { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import "./Computer.css"
const Computer = ({ onSelectComputer, computerSelected }) => {
  const [computers, setComputers] = useState([])

  useEffect(() => {
    loadComputers()
  }, [])
  const loadComputers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/computers", {
        validateStatus: () => {
          return true
        },
      })
      if (result.status === 200) {
        setComputers(result.data)
        console.log(computers)
      } else {
        alert("Result failed")
      }
    } catch (error) {
      alert("API computer isn's loaded")
    }
  }

  return (
    <div className="container-fluid display-computer">
      <div className="inner-wrap-computer">
        <div className="row">
          <div className="col-12 manager-computer">
            <h1>Quản Lý Máy Tính</h1>
          </div>

          <div className="col-12 table-computer">
            <div className="row computer-grid">
              {computers.map((computer, index) => (
                <button
                  key={index}
                  className={`computer-title col-xl-3 col-lg-3 col-sm-12 col-12 d-flex flex-column text-center ${
                    computer?.status === "Using" ? "Using" : "Offline"
                  }`}
                  onClick={() => onSelectComputer(computer)}
                >
                  <span>Máy : {computer?.computerId}</span>
                  <span>{computer?.status}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="col-12 computer-details">
            {computerSelected ? (
              <div className="computer-info card p-3">
                <h3>
                  Thông tin chi tiết máy{" "}
                  {computerSelected.infoComputer.computerId}
                </h3>
                <p>
                  <b>Màn hình:</b> {computerSelected.infoComputer.screen}
                </p>
                <p>
                  <b>Chip:</b> {computerSelected.infoComputer.chip}
                </p>
                <p>
                  <b>GPU:</b> {computerSelected.infoComputer.gpu}
                </p>
                <p>
                  <b>Chuột:</b> {computerSelected.infoComputer.mouse}
                </p>
                <p>
                  <b>Bàn phím:</b> {computerSelected.infoComputer.keyboard}
                </p>
              </div>
            ) : (
              <p> Hãy chọn một máy để xem thông tin chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Computer
