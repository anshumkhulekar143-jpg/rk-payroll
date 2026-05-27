import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Dashboard logout={logout} />;
}

export default App;