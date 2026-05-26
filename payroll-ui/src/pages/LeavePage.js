import React, { useEffect, useState } from "react";
import axios from "axios";

function LeavePage() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/employees", {
        headers,
      });

      setEmployees(res.data);
    } catch (err) {
      console.log("FETCH EMPLOYEES ERROR:", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/leaves", {
        headers,
      });

      setLeaves(res.data);
    } catch (err) {
      console.log("FETCH LEAVES ERROR:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const applyLeave = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3003/api/leaves", form, {
        headers,
      });

      alert("Leave Applied Successfully");

      setForm({
        employeeId: "",
        leaveType: "casual",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying leave");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:3003/api/leaves/${id}/status`,
        { status },
        { headers }
      );

      fetchLeaves();
    } catch (err) {
      alert("Error updating leave");
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave record?")) return;

    try {
      await axios.delete(`http://localhost:3003/api/leaves/${id}`, {
        headers,
      });

      fetchLeaves();
    } catch (err) {
      alert("Error deleting leave");
    }
  };

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>Leave Management</h2>

        <form onSubmit={applyLeave}>
          <div style={grid}>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              style={input}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId} - {emp.name}
                </option>
              ))}
            </select>

            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              style={input}
            >
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="paid">Paid Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>

            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              name="reason"
              placeholder="Reason"
              value={form.reason}
              onChange={handleChange}
              style={input}
            />
          </div>

          <button type="submit" style={button}>
            Apply Leave
          </button>
        </form>
      </div>

      <div style={tableBox}>
        <h2>Leave Records</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Employee ID</th>
              <th style={th}>Name</th>
              <th style={th}>Type</th>
              <th style={th}>From</th>
              <th style={th}>To</th>
              <th style={th}>Reason</th>
              <th style={th}>Status</th>
              <th style={th}>Approve</th>
              <th style={th}>Reject</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={td}>{leave.employeeId?.employeeId || "-"}</td>
                <td style={td}>{leave.employeeId?.name || "-"}</td>
                <td style={td}>{leave.leaveType}</td>
                <td style={td}>{leave.fromDate}</td>
                <td style={td}>{leave.toDate}</td>
                <td style={td}>{leave.reason || "-"}</td>
                <td style={td}>
                  <span style={statusStyle(leave.status)}>{leave.status}</span>
                </td>

                <td style={td}>
                  <button
                    onClick={() => updateStatus(leave._id, "approved")}
                    style={approveBtn}
                  >
                    Approve
                  </button>
                </td>

                <td style={td}>
                  <button
                    onClick={() => updateStatus(leave._id, "rejected")}
                    style={rejectBtn}
                  >
                    Reject
                  </button>
                </td>

                <td style={td}>
                  <button onClick={() => deleteLeave(leave._id)} style={deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {leaves.length === 0 && (
              <tr>
                <td colSpan="10" style={emptyTd}>
                  No leave records found
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
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  marginTop: "20px",
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
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
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const emptyTd = {
  textAlign: "center",
  padding: "20px",
};

const statusStyle = (status) => ({
  padding: "6px 10px",
  borderRadius: "20px",
  color: "white",
  background:
    status === "approved"
      ? "#16a34a"
      : status === "rejected"
      ? "red"
      : "#f59e0b",
});

const approveBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default LeavePage;