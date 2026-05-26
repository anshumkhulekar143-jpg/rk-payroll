import React, { useState } from "react";
import Login from "./Login";
import Layout from "./components/Layout";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  return (
    <>
      {token ? (
        <Layout setToken={setToken} />
      ) : (
        <Login setToken={setToken} />
      )}
    </>
  );
}

export default App;