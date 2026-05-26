import React from "react";
import EmployeeForm from "./EmployeeForm";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>RK Payroll Dashboard</h1>
        <p>Welcome, {user?.name || "User"} 👋</p>
        <p>Email: {user?.email}</p>

        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>

        <EmployeeForm />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#02133b",
    padding: "40px 20px",
  },
  card: {
    background: "#1f2d46",
    color: "white",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    width: "1100px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#38bdf8",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Dashboard;