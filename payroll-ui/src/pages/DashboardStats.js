import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function DashboardStats() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    employeesByCompany: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.log("Dashboard error");
    }
  };

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard Overview</h2>

      {/* TOP CARDS */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Total Companies</h3>
          <p>{stats.totalCompanies}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>
      </div>

      {/* BAR CHART */}
      <h3 style={styles.subHeading}>Employees per Company</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.employeesByCompany}>
          <XAxis dataKey="companyName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>

      {/* PIE CHART */}
      <h3 style={styles.subHeading}>Salary Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stats.employeesByCompany}
            dataKey="totalSalary"
            nameKey="companyName"
            outerRadius={100}
            label
          >
            {stats.employeesByCompany.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  heading: {
    marginBottom: "20px",
    color: "#1e293b",
  },
  subHeading: {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#1e293b",
  },
  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    flex: 1,
    padding: "20px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
  },
};

export default DashboardStats;
