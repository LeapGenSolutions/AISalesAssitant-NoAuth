// src/App.js
import React from "react";
import { AuthProvider } from "./helpers/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useIsAuthenticated } from "@azure/msal-react";

function App() {
  const isAuthenticated = useIsAuthenticated();
  return <div className="App">{isAuthenticated ? <Dashboard /> : <Login />}</div>;
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProviders;
