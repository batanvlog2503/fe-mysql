import React from "react"
import "./ListCustomer.css"
import axios from "axios"
import { useState, useEffect } from "react"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Search from "../Search/Search"
const ListCustomer = () => {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState("") //
  const [filteredCustomer, setFilteredCustomer] = useState([])
  useEffect(() => {
    loadCustomers()
  }, [])

  const navigate = useNavigate()
  const loadCustomers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/customers", {
        validateStatus: () => {
          return true
        },
      })

      console.log(result.data)
      setCustomers(result.data)
      setFilteredCustomer(result.data)
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

  const handleDeleteCustomer = async (customer) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/customers/delete/${customer.id}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )
      loadCustomers()

      console.log("Delete Customer Successfully")
    } catch (error) {
      console.log(error)
      alert("Delete Customer Failed")
    }
  }
  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredCustomer(customers)
      return
    }

    try {
      const result = await axios.get(
        `http://localhost:8080/api/customers/name/${searchTerm}`,
        {
          validateStatus: () => {
            return true
          },
        }
      )

      console.log("Customer Found", result.data)
      setFilteredCustomer([result.data])
    } catch (error) {
      console.log(error)
      alert("Customer Not Found")
    }
  }
  return (
    <div
      className="container display-customers"
      style={{ maxWidth: "1400px" }}
    >
      <h2>Danh sách Tài Khoản ({customers.length})</h2>
      <Search
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      ></Search>
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
              <th colSpan={2}>Fixed</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomer.length > 0
              ? filteredCustomer.map((customer, index) => {
                  return (
                    <tr key={customer.id}>
                      <td>
                        <b>{index + 1}</b>
                      </td>
                      <td>{customer?.username}</td>
                      <td>{customer?.password}</td>
                      <td> {formatDateTime(customer?.createdAt)}</td>
                      <td>
                        <span
                          className={`badge ${
                            customer.type === "Vip" ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {customer.type}
                        </span>
                      </td>
                      <td>{customer.balance?.toLocaleString("vi-VN")} VND</td>

                      <td>
                        <button
                          className="btn btn-primary delete-customer"
                          onClick={() =>
                            navigate(`/main/update-customer/${customer.id}`)
                          }
                        >
                          <FaEdit></FaEdit>
                        </button>
                      </td>
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
