import React from "react"
import "./ListCustomer.css"
import axios from "axios"
import { useState, useEffect } from "react"
const ListCustomer = () => {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/customers", {
        validateStatus: () => {
          return true
        },
      })

      console.log(result.data)
      setCustomers(result.data)
    } catch (error) {
      console.log(error)
      alert("Get Customers Failed")
    }
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A"

    // Parse trực tiếp từ ISO string mà KHÔNG convert timezone
    // "2025-11-10T09:19:54.181" -> "10/11/2025 09:19:54"
    const [datePart, timePart] = isoString.split("T")
    const [year, month, day] = datePart.split("-")
    const [time] = timePart.split(".")
    const [hours, minutes, seconds] = time.split(":")

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }
  return (
    <div
      className="container display-customers"
      style={{ maxWidth: "1400px" }}
    >
      <h2>Danh sách Tài Khoản</h2>
      <div className="inner-wrap-display-customers">
        <table className="table table-bordered align-middle text-center">
          <thead>
            <tr className="table-primary">
              <th>Id</th>
              <th>Username</th>
              <th>Password</th>
              <th>Create At</th>
              <th>Type</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0
              ? customers.map((customer, index) => {
                  return (
                    <tr key={customer.id}>
                      <td>
                        <b>{customer.id}</b>
                      </td>
                      <td>{customer?.username}</td>
                      <td>{customer?.password}</td>
                      <td> {formatDateTime(customer?.createdAt)}</td>
                      <td>
                        <span
                          className={`badge ${
                            customer.type === "VIP"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          {customer.type}
                        </span>
                      </td>
                      <td>{customer.balance?.toLocaleString("vi-VN")} VND</td>
                    </tr>
                  )
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListCustomer
