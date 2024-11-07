// src/components/Login.js
import React, { useContext } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { AuthContext } from "../helpers/AuthContext";
import GHEALogo from "../assets/Full-Logo.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e);
      });
      login();
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e);
      });
      login();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-dark text-primaryText bg-[#00172F]">
      <img className="h-24" src={GHEALogo} alt="" />

      <form className="bg-card p-6 rounded-lg shadow-lg w-80 bg-white">
        <button
          onClick={() => handleLogin("redirect")}
          className="w-full p-2 bg-blue-500 rounded text-white"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
