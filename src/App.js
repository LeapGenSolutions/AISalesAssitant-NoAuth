// src/App.js
import React from "react";
import { AuthProvider } from "../src/helpers/AuthContext";
// import { AuthProvider, AuthContext } from "../src/helpers/AuthContext";
import Dashboard from "../src/pages/Dashboard";
import Login from "../src/pages/Login";
// import { loginRequest } from "./authConfig";
// import { callMsGraph } from "./graph";
// import { ProfileData } from "./components/ProfileData";
import { useIsAuthenticated } from "@azure/msal-react";

// import {
//   // AuthenticatedTemplate,
//   // UnauthenticatedTemplate,
//   useMsal,
// } from "@azure/msal-react";
// import Button from "react-bootstrap/Button";

// const ProfileContent = () => {
//   const { instance, accounts } = useMsal();
//   const [graphData, setGraphData] = useState(null);

//   function RequestProfileData() {
//     // Silently acquires an access token which is then attached to a request for MS Graph data
//     instance
//       .acquireTokenSilent({
//         ...loginRequest,
//         account: accounts[0],
//       })
//       .then((response) => {
//         callMsGraph(response.accessToken).then((response) =>
//           setGraphData(response)
//         );
//       });
//   }

//   return (
//     <>
//       <h5 className="card-title">Welcome {accounts[0].name}</h5>
//       <br />
//       {graphData ? (
//         <ProfileData graphData={graphData} />
//       ) : (
//         <Button variant="secondary" onClick={RequestProfileData}>
//           Request Profile Information
//         </Button>
//       )}
//     </>
//   );
// };

function App() {
  const isAuthenticated = useIsAuthenticated();
  return <Dashboard /> 
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProviders;
