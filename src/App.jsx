// src/App.js
import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./helpers/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useIsAuthenticated } from "@azure/msal-react";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const {idTokenClaims} = useContext(AuthContext)
  
  if(idTokenClaims && !idTokenClaims.roles){
    return <div>LOGIN SUCCESS! BUT NO ROLE to ACCESS APP</div>
  }
  
  return <div className="App">{isAuthenticated ? <Dashboard /> : <Login />}</div>;
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProviders;
