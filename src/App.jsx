import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import DepositMoney from "./components/DepositMoney/DepositMoney"
import {
  Route,
  Router,
  RouterProvider,
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import ComputerLayout from "./components/Computer/ComputerLayout"
import CreateAccount from "./components/CreateAccount/CreateAccount"
import Service from "./components/Service/Service"
import ListComputer from "./components/ListComputer/ListComputer"
import ListCustomer from "./components/ListCustomer/ListCustomer"
import UpdateCustomer from "./components/UpdateCustomer/UpdateCustomer"
import Payment from "./components/Payment/Payment"
import AuditLog from "./components/AuditLog/AuditLog"
import Dashboard from "./components/Dashboard/Dashboard"

import User from "./components/User/User"
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {" "}
        <>
          {/* Route mặc định là trang đăng nhập */}
          <Route
            path="/"
            element={<User />}
          />
          <Route
            path="/login"
            element={<User />}
          />

          {/* Routes chính - trong MainLayout (yêu cầu đăng nhập) */}
          <Route
            path="/main"
            element={<MainLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
            <Route
              path="computer"
              element={<ComputerLayout />}
            />
            <Route
              path="deposit-money"
              element={<DepositMoney />}
            />
            <Route
              path="create-account"
              element={<CreateAccount />}
            />
            <Route
              path="service"
              element={<Service />}
            />
            <Route
              path="list-computer"
              element={<ListComputer />}
            />
            <Route
              path="list-customer"
              element={<ListCustomer />}
            />
            <Route
              path="update-customer/:id"
              element={<UpdateCustomer />}
            />
            <Route
              path="payment"
              element={<Payment />}
            />
            <Route
              path="audit-log"
              element={<AuditLog />}
            />
          </Route>
        </>
      </>
    )
  )

  return <RouterProvider router={router}></RouterProvider>
}

export default App
