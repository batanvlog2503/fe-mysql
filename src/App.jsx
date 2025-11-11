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
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route
          index
          element={<ComputerLayout />}
        ></Route>
        <Route
          path="createaccount"
          element={<CreateAccount />}
        ></Route>
        <Route
          path="service"
          element={<Service />}
        ></Route>
        <Route
          path="list-computer"
          element={<ListComputer />}
        ></Route>
        <Route
          path="deposit-money"
          element={<DepositMoney />}
        ></Route>
        <Route
          path="list-customer"
          element={<ListCustomer />}
        ></Route>
      </Route>
    )
  )

  return <RouterProvider router={router}></RouterProvider>
}

export default App
