import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    status: "present",
    overtimeHours: "",
    lateMark: false,
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:3003/api/employees", {
      headers,
    });
    setEmployees(res.data);
  };

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:3003/api/attendance", {
      headers,
    });
    setAttendance(res.data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const markAttendance = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3003/api/attendance", form, {
        headers,
      });

      alert("Attendance Saved");

      setForm({
        employeeId: "",
        date: "",
        status: "present",
        overtimeHours: "",
        lateMark: false,
      });

      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving attendance");
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete attendance?")) return;

    await axios.delete(`http://localhost:3003/api/attendance/${id}`, {
      headers,
    });

    fetchAttendance();
  };

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>Mark Attendance</h2>

        <form onSubmit={markAttendance}>
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

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={input}
              required
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={input}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
              <option value="paid-leave">Paid Leave</option>
            </select>

            <input
              type="number"
              name="overtimeHours"
              placeholder="Overtime Hours"
              value={form.overtimeHours}
              onChange={handleChange}
              style={input}
            />

            <label style={checkBox}>
              <input
                type="checkbox"
                name="lateMark"
                checked={form.lateMark}
                onChange={handleChange}
              />
              Late Mark
            </label>
          </div>

          <button type="submit" style={button}>
            Save Attendance
          </button>
        </form>
      </div>

      <div style={tableBox}>
        <h2>Attendance List</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Employee ID</th>
              <th style={th}>Name</th>
              <th style={th}>Status</th>
              <th style={th}>Overtime</th>
              <th style={th}>Late</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((att) => (
              <tr key={att._id}>
                <td style={td}>{att.date}</td>
                <td style={td}>{att.employeeId?.employeeId}</td>
                <td style={td}>{att.employeeId?.name}</td>
                <td style={td}>{att.status}</td>
                <td style={td}>{att.overtimeHours}</td>
                <td style={td}>{att.lateMark ? "Yes" : "No"}</td>
                <td style={td}>
                  <button
                    onClick={() => deleteAttendance(att._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {attendance.length === 0 && (
              <tr>
                <td colSpan="7" style={emptyTd}>
                  No attendance found
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

const checkBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
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

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AttendancePage;