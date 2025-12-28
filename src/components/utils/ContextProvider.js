import React, { createContext, useState, useEffect, useCallback } from "react";
import { getPermissions, getToken, getUserInfo, clearAll } from "./DataStorage";

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = getToken();
    return token != null && token !== "undefined" && token !== "";
  });
  const [permissions, setPermissions] = useState(() => getPermissions());
  const [userInfo, setUserInfo] = useState(() => getUserInfo());

  const handleLogout = useCallback(() => {
    console.log("Logging out - clearing all data");
    clearAll();
    setAuthenticated(false);
    setPermissions({});
    setUserInfo(null);
  }, []);

  // Auto logout on token expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const storedUserInfo = getUserInfo();
      if (storedUserInfo && storedUserInfo.tokenExpiry) {
        const expiryDate = new Date(storedUserInfo.tokenExpiry);
        const now = new Date();

        if (now >= expiryDate) {
          console.log("Token expired, logging out...");
          handleLogout();
        }
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, handleLogout]);

  return (
    <MyContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        permissions,
        setPermissions,
        userInfo,
        setUserInfo,
        logout: handleLogout,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
