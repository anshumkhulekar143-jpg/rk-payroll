import React from "react";

function Dashboard({ logout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>RK Payroll</h2>

        <button>Dashboard</button>
        <button>Companies</button>
        <button>Employees</button>
        <button>Attendance</button>
        <button>Leave</button>
        <button>Payroll</button>
        <button>Reports</button>
        <button>Settings</button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.name || "Admin"}</p>
          </div>

          <button onClick={logout}>Logout</button>
        </div>

        <div className="cards">
          <div className="dash-card">
            <h3>Total Companies</h3>
            <h2>0</h2>
          </div>

          <div className="dash-card">
            <h3>Total Employees</h3>
            <h2>0</h2>
          </div>

          <div className="dash-card">
            <h3>Present Today</h3>
            <h2>0</h2>
          </div>

          <div className="dash-card">
            <h3>Payroll Generated</h3>
            <h2>0</h2>
          </div>
        </div>

        <div className="panel">
          <h2>RK Payroll SaaS</h2>
          <p>Your login, backend and MongoDB Atlas are working successfully.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;