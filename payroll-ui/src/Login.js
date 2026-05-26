import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://rk-payroll.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN SUCCESS:", res.data);

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // UPDATE APP STATE
      setToken(res.data.token);

      setMessage("✅ Login successful");
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      setMessage(
        err.response?.data?.message ||
          "❌ Invalid email or password"
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#001b6b",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "400px",
          padding: "40px",
          borderRadius: "20px",
          background: "#1d327a",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          RK Payroll Login
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            background: "#38bdf8",
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      </form>
    </div>
  );
}

export default Login;