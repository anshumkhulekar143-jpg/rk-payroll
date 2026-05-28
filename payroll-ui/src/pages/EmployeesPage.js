import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3003/api/employees";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    salary: "",
    status: "Active",
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL, getAuthConfig());
      setEmployees(res.data);
    } catch (error) {
      console.log("Fetch employees error:", error);
      alert(error.response?.data?.message || "Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, getAuthConfig());
      } else {
        await axios.post(API_URL, form, getAuthConfig());
      }

      fetchEmployees();

      setForm({
        employeeId: "",
        name: "",
        department: "",
        salary: "",
        status: "Active",
      });

      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.log("Save employee error:", error);
      alert(error.response?.data?.message || "Error saving employee");
    }
  };

  const editEmployee = (emp) => {
    setForm({
      employeeId: emp.employeeId || "",
      name: emp.name || "",
      department: emp.department || "",
      salary: emp.salary || "",
      status: emp.status || "Active",
    });

    setEditId(emp._id);
    setShowForm(true);
  };

  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm("Delete this employee?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      fetchEmployees();
    } catch (error) {
      console.log("Delete employee error:", error);
      alert(error.response?.data?.message || "Error deleting employee");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p>Manage employee records</p>
        </div>

        <button onClick={() => setShowForm(true)}>Add Employee</button>
      </div>

      {showForm && (
        <form className="employee-form" onSubmit={saveEmployee}>
          <input
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>

          <div className="form-buttons">
            <button type="submit">
              {editId ? "Update Employee" : "Save Employee"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <input
        className="search-input"
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="6">No employees found</td>
            </tr>
          ) : (
            filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.employeeId || "-"}</td>
                <td>{emp.name || "-"}</td>
                <td>{emp.department || "-"}</td>
                <td>₹{emp.salary || 0}</td>
                <td>{emp.status || "Active"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editEmployee(emp)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteEmployee(emp._id)}
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

export default EmployeesPage;