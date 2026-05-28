import React, { useState } from "react";
import Login from "./Login";
import DashboardPage from "./pages/DashboardPage.js";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <DashboardPage logout={logout} />;
}

export default App;