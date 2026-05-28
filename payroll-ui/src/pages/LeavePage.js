import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3003/api/leaves";

function LeavePage() {
  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaves(res.data);
    } catch (error) {
      console.log("Fetch leaves error:", error);
    }
  };

  useEffect(() => {
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
      await axios.post(API_URL, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        employeeId: "",
        name: "",
        leaveType: "Casual Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchLeaves();

      alert("Leave applied successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error applying leave"
      );
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLeave = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Leave Management</h2>
          <p>Manage employee leave requests</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={applyLeave}>
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

        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
        >
          <option>Casual Leave</option>
          <option>Sick Leave</option>
          <option>Paid Leave</option>
          <option>Unpaid Leave</option>
        </select>

        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="toDate"
          value={form.toDate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">
            Apply Leave
          </button>
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="8">
                No leave requests found
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employeeId}</td>
                <td>{leave.name}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.fromDate}</td>
                <td>{leave.toDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      updateLeaveStatus(
                        leave._id,
                        "Approved"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      updateLeaveStatus(
                        leave._id,
                        "Rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteLeave(leave._id)
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

export default LeavePage;