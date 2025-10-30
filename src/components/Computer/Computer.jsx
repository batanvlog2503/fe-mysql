import React, { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import "./Computer.css"
const Computer = ({onSelectComputer}) => {
  const [computers, setComputers] = useState([])
  const [selectedComputer, setSelectedComputer] = useState(null)

  // chón máy được chọn
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
                  className="computer-title col-xl-3 col-lg-3 col-sm-12 col-12 d-flex flex-column text-center"
                  onClick={() => onSelectComputer(computer)}
                >
                  <span>Máy : {computer?.computerId}</span>
                  <span>{computer?.status}</span>
                </button>
              ))}
            </div>
          </div>
          {/* <div className="col-12 computer-details">
            {selectedComputer ? (
              <div className="computer-info card p-3">
                <h3>Thông tin chi tiết máy {selectedComputer.infoComputer.computerId}</h3>
                <p>
                  <b>Màn hình:</b> {selectedComputer.infoComputer.screen}
                </p>
                <p>
                  <b>Chip:</b> {selectedComputer.infoComputer.chip}
                </p>
                <p>
                  <b>GPU:</b> {selectedComputer.infoComputer.gpu}
                </p>
                <p>
                  <b>Chuột:</b> {selectedComputer.infoComputer.mouse}
                </p>
                <p>
                  <b>Bàn phím:</b> {selectedComputer.infoComputer.keyboard}
                </p>
              </div>
            ) : (
              <p> Hãy chọn một máy để xem thông tin chi tiết.</p>
            )}
          </div> */}
        </div>
      </div>
    
      
    </div>
  )
}

export default Computer
