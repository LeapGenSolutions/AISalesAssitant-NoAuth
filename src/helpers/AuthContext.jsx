// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Update login state based on MSAL's isAuthenticated state
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const login = () => {
    // If needed, add additional login logic here.
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
