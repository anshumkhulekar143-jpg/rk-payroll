import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3003/api/attendance";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    date: "",
    status: "Present",
    overtime: 0,
  });

  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAttendance(res.data);
    } catch (error) {
      console.log("Fetch attendance error:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        employeeId: "",
        name: "",
        date: "",
        status: "Present",
        overtime: 0,
      });

      fetchAttendance();

      alert("Attendance marked successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error marking attendance"
      );
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAttendance();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Attendance Management</h2>
          <p>Manage employee attendance</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Half Day</option>
          <option>Paid Leave</option>
        </select>

        <input
          type="number"
          name="overtime"
          placeholder="Overtime Hours"
          value={form.overtime}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">
            Mark Attendance
          </button>
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Overtime</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="6">
                No attendance found
              </td>
            </tr>
          ) : (
            attendance.map((item) => (
              <tr key={item._id}>
                <td>{item.employeeId}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
                <td>{item.overtime}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteAttendance(item._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendancePage;