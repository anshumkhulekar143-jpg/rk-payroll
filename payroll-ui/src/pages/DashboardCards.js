import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3003/api/dashboard/stats";

function DashboardCards() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    monthlyPayroll: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_URL);
      setStats(res.data);
    } catch (error) {
      console.log("Dashboard stats error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="cards-container">
      <div className="card">
        <h3>Total Employees</h3>
        <h1>{stats.totalEmployees}</h1>
      </div>

      <div className="card">
        <h3>Active Employees</h3>
        <h1>{stats.activeEmployees}</h1>
      </div>

      <div className="card">
        <h3>On Leave</h3>
        <h1>{stats.onLeaveEmployees}</h1>
      </div>

      <div className="card">
        <h3>Monthly Payroll</h3>
        <h1>₹{stats.monthlyPayroll}</h1>
      </div>
    </div>
  );
}

export default DashboardCards;