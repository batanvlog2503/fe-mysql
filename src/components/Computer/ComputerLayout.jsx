import React from "react"
import { useState } from "react";
import Computer from "./Computer"
import ComputerDetails from "../ComputerDetails/ComputerDetails";
 const ComputerLayout = () => {

  const [selectedComputer, setSelectedComputer] = useState(null);

  return (
    <div className="container-fluid computer-layout">
      <div className="row">
        <div className="col-xl-8 col-lg-8 col-sm-12 col-12 computer">
          <Computer onSelectComputer={setSelectedComputer}></Computer>
        </div>
        <div className="col-xl-4 col-lg-4 col-sm-12 col-12 computer-details">
          <ComputerDetails computer = {selectedComputer}></ComputerDetails>
        </div>
      </div>
    </div>
  )
}

export default ComputerLayout;
