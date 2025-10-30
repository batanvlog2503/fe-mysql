import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';	

import {Route, Router, RouterProvider, BrowserRouter, createBrowserRouter, createRoutesFromElements} from "react-router-dom"
import MainLayout from './components/MainLayout';
import  ComputerLayout  from './components/Computer/ComputerLayout';
import CreateAccount from './components/CreateAccount/CreateAccount';
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(

      <Route path = "/" element = {<MainLayout/>}>
        <Route index element = {<ComputerLayout/>}></Route>
        <Route path = "createaccount" element = {<CreateAccount/>}></Route>
        
      </Route>
    )
  )

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
