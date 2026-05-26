import React, { useEffect, useState } from "react";
import axios from "axios";

function PayrollPage() {
  const [month, setMonth] = useState("");
  const [payrolls, setPayrolls] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get("https://rk-payroll.onrender.com/api/payroll", {
        headers,
        params: month ? { month } : {},
      });

      setPayrolls(res.data);
    } catch (err) {
      console.log("FETCH PAYROLL ERROR:", err);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const generatePayroll = async () => {
    if (!month) {
      alert("Please select month");
      return;
    }

    try {
      await axios.post(
        "https://rk-payroll.onrender.com/api/payroll/generate",
        { month },
        { headers }
      );

      alert("Payroll Generated Successfully");
      fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || "Error generating payroll");
    }
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;

    try {
      await axios.delete(`https://rk-payroll.onrender.com/api/payroll/${id}`, {
        headers,
      });

      fetchPayrolls();
    } catch (err) {
      alert("Error deleting payroll");
    }
  };

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>Monthly Payroll Processing</h2>

        <div style={grid}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={input}
          />

          <button onClick={generatePayroll} style={button}>
            Generate Payroll
          </button>

          <button onClick={fetchPayrolls} style={filterBtn}>
            Filter
          </button>
        </div>
      </div>

      <div style={tableBox}>
        <h2>Payroll Records</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Month</th>
              <th style={th}>Emp ID</th>
              <th style={th}>Name</th>
              <th style={th}>Total Days</th>
              <th style={th}>Present</th>
              <th style={th}>Absent</th>
              <th style={th}>Half Days</th>
              <th style={th}>Paid Leaves</th>
              <th style={th}>Payable</th>
              <th style={th}>Gross</th>
              <th style={th}>Earned</th>
              <th style={th}>PF</th>
              <th style={th}>ESI</th>
              <th style={th}>PT</th>
              <th style={th}>TDS</th>
              <th style={th}>Net</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {payrolls.map((pay) => (
              <tr key={pay._id}>
                <td style={td}>{pay.month}</td>
                <td style={td}>{pay.employeeId?.employeeId || "-"}</td>
                <td style={td}>{pay.employeeId?.name || "-"}</td>
                <td style={td}>{pay.totalDays}</td>
                <td style={td}>{pay.presentDays}</td>
                <td style={td}>{pay.absentDays}</td>
                <td style={td}>{pay.halfDays}</td>
                <td style={td}>{pay.paidLeaves}</td>
                <td style={td}>{pay.payableDays}</td>
                <td style={td}>₹{pay.grossSalary || 0}</td>
                <td style={td}>₹{pay.earnedSalary || 0}</td>
                <td style={td}>₹{pay.pf || 0}</td>
                <td style={td}>₹{pay.esi || 0}</td>
                <td style={td}>₹{pay.pt || 0}</td>
                <td style={td}>₹{pay.tds || 0}</td>
                <td style={td}>₹{pay.netSalary || 0}</td>
                <td style={td}>
                  <button
                    onClick={() => deletePayroll(pay._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {payrolls.length === 0 && (
              <tr>
                <td colSpan="17" style={emptyTd}>
                  No payroll records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const container = {
  padding: "20px",
};

const formBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
};

const tableBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  overflowX: "auto",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "220px 220px 140px",
  gap: "15px",
  alignItems: "center",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const filterBtn = {
  ...button,
  background: "#16a34a",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "12px",
  background: "#0f1f4b",
  color: "white",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const emptyTd = {
  textAlign: "center",
  padding: "20px",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default PayrollPage;