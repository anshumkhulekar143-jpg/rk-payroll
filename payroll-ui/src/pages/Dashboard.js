import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const empRes = await axios.get(
        "http://localhost:3003/api/employees",
        { headers }
      );

      setEmployees(empRes.data);

      const compRes = await axios.get(
        "http://localhost:3003/api/company"
      );

      setCompanies(compRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalEmployees = employees.length;
  const totalCompanies = companies.length;

  const totalGross = employees.reduce(
    (sum, emp) => sum + Number(emp.grossSalary || 0),
    0
  );

  const totalNet = employees.reduce(
    (sum, emp) => sum + Number(emp.netSalary || 0),
    0
  );

  const chartData = employees.map((emp) => ({
    name: emp.name,
    gross: emp.grossSalary,
    net: emp.netSalary,
  }));

  return (
    <div style={page}>
      <h1>Dashboard</h1>

      <div style={cards}>
        <div style={card}>
          <h3>Total Companies</h3>
          <h2>{totalCompanies}</h2>
        </div>

        <div style={card}>
          <h3>Total Employees</h3>
          <h2>{totalEmployees}</h2>
        </div>

        <div style={card}>
          <h3>Total Gross Salary</h3>
          <h2>₹{totalGross}</h2>
        </div>

        <div style={card}>
          <h3>Total Net Salary</h3>
          <h2>₹{totalNet}</h2>
        </div>
      </div>

      <div style={chartBox}>
        <h2>Salary Chart</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="gross" />
            <Bar dataKey="net" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const page = {
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  background: "#10245c",
  color: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

const chartBox = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

export default Dashboard;