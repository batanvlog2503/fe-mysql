import React from "react"
import { createContext, useState } from "react"

// tạo context lưu giá trị của user;

export const ComputerContext = createContext()

// UserProvider;

export const ComputerProvider = ({ children }) => {
  const [user, setUserState] = useState(() =>{
    const saveUser = localStorage.getItem("user");
    return saveUser ? JSON.parse(saveUser) : null
  })

  const setUser = (data) =>{
    setUserState(data);
    if(data){
        localStorage.setItem("user", JSON.stringify(data));
    }else{
        localStorage.removeItem("user");
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
// children tương ứng với App


