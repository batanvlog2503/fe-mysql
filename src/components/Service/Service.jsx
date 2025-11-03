import React from "react"
import { useLocation } from "react-router-dom"
import Product from "../Product/Product"
import ProductDetails from "../ProductDetails/ProductDetails"
const Service = () => {
  const location = useLocation()
  const { loginInfo } = location.state || {}
 

  return(
    <div className="container computer-service">
        <div className="inner-wrap-computer-service">
            <div className="row">
                <div className="col-12 text-center" style={{height:"10vh"}}><h1>Menu</h1></div>
                <div className="col-xl-8 col-lg-8 col-sm-12 col-12 product">
                    <Product customer = {loginInfo}></Product>
                </div>
                <div className="col-xl-4 col-lg-4 col-sm-12 col-12 product-details">
                    <ProductDetails customer = {loginInfo}></ProductDetails>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Service
