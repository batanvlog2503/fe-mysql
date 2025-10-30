import React from "react"
import "./ComputerDetails.css"
const ComputerDetails = ({ computer }) => {
  return (
    <div className="container computer-service">
      <div className="inner-wrap-computer-service">
        {computer ? (
          <>
            <h1>Máy: {computer.computerId}</h1>

            <div className="row">
              <div className="info-computer col-xl-8 col-lg-8 col-sm-12 col-12">
                <div className="status-computer mb-3">
                  <b>Tình trạng:</b> {computer?.status}
                </div>

                <div className="time-info">
                  <p>
                    <b>Thời gian bắt đầu:</b> {computer.startTime || "Chưa bật"}
                  </p>
                  <p>
                    <b>Thời gian sử dụng:</b> {computer.usageTime || "0 phút"}
                  </p>
                  <p>
                    <b>Tạm tính:</b> {computer.estimatedCost || "0đ"}
                  </p>
                </div>

                <div className="actions mt-3">
                  <button className="btn btn-success me-2">Bật máy</button>
                  <button className="btn btn-danger">Tắt máy</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Hãy chọn một máy để xem thông tin chi tiết.</p>
        )}
      </div>
    </div>
  )
}

export default ComputerDetails
