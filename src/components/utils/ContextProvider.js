import React, { createContext, useState } from "react";
import { getPermissions, getToken } from "./DataStorage";

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const token = getToken();
  const [isAuthenticated, setAuthenticated] = useState(
    token != null && token !== "undefined"
  );
  const [permissions, setPermissions] = useState(getPermissions());

  return (
    <MyContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
