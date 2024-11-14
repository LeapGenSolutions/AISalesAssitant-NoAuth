// src/App.js
import React from "react";
import { AuthProvider } from "../src/helpers/AuthContext";
import Dashboard from "../src/pages/Dashboard";

function App() {
  // const isAuthenticated = useIsAuthenticated();
  return <Dashboard /> 
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProviders;
