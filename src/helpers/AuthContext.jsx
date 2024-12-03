// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { CosmosClient } from "@azure/cosmos";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance, accounts } = useMsal();
  const [idTokenClaims, setIdTokenClaims] = useState(null)

  const client = new CosmosClient({
    endpoint: process.env.REACT_APP_COSMOS_DB_URI,
    key: process.env.REACT_APP_COSMOS_DB_PRIMARY_KEY,
  });
  const database = client.database('cosmosdb-db-gy4phravzt2ak');
  const container = database.container('VersionsContainer');

  const fetchIdClaimToken = async () => {
    const response = await msalInstance.acquireTokenSilent({
      scopes: process.env.REACT_APP_SCOPES.split(","),
      // scopes: ["User.read"],
      account: accounts[0],
    })
    if (response.idTokenClaims) {
      const { resources } = await container.items.readAll().fetchAll();
      const activeModel = resources.find((model) => model.active === 1);
      setIdTokenClaims({
        ...response.idTokenClaims,
        multiTenant: activeModel?.multiTurn
      })
    }
    return response.idTokenClaims;
  }


  useEffect(() => {
    // Update login state based on MSAL's isAuthenticated state
    if (isAuthenticated) {
      fetchIdClaimToken()
    }
    setIsLoggedIn(isAuthenticated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout, idTokenClaims, setIdTokenClaims }}>
      {children}
    </AuthContext.Provider>
  );
};
