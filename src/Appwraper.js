import React, { useState } from "react";
import App from "./App";

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("Secret-token")
  );

  const handleLoginSuccess = (token) => {
    localStorage.setItem("Secret-token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("Secret-token");
    setIsAuthenticated(false);
  };

  return (
    <App
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default AppWrapper;
