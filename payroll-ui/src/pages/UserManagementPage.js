import React, { useEffect, useState } from "react";
import axios from "axios";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "hradmin",
    employeeId: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://rk-payroll.onrender.com/api/users", {
        headers,
      });

      setUsers(res.data);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://rk-payroll.onrender.com/api/employees", {
        headers,
      });

      setEmployees(res.data);
    } catch (err) {
      console.log("FETCH EMPLOYEES ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://rk-payroll.onrender.com/api/users", form, {
        headers,
      });

      alert("User created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "hradmin",
        employeeId: "",
      });

      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.put(
        `https://rk-payroll.onrender.com/api/users/${id}/status`,
        { status },
        { headers }
      );

      fetchUsers();
    } catch (err) {
      alert("Error updating user status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`https://rk-payroll.onrender.com/api/users/${id}`, {
        headers,
      });

      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>User & Role Management</h2>

        <form onSubmit={createUser}>
          <div style={grid}>
            <input
              name="name"
              placeholder="User Name"
              value={form.name}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="User Email"
              value={form.email}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={input}
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={input}
            >
              <option value="hradmin">HR Admin</option>
              <option value="payrolladmin">Payroll Admin</option>
              <option value="employee">Employee</option>
            </select>

            {form.role === "employee" && (
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                style={input}
              >
                <option value="">Link Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button type="submit" style={button}>
            Create User
          </button>
        </form>
      </div>

      <div style={tableBox}>
        <h2>Users List</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Linked Employee</th>
              <th style={th}>Status</th>
              <th style={th}>Activate</th>
              <th style={th}>Deactivate</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={td}>{user.name}</td>
                <td style={td}>{user.email}</td>
                <td style={td}>{user.role}</td>
                <td style={td}>
                  {user.employeeId
                    ? `${user.employeeId.employeeId} - ${user.employeeId.name}`
                    : "-"}
                </td>
                <td style={td}>
                  <span style={statusStyle(user.status)}>{user.status}</span>
                </td>

                <td style={td}>
                  <button
                    onClick={() => updateUserStatus(user._id, "active")}
                    style={activeBtn}
                  >
                    Active
                  </button>
                </td>

                <td style={td}>
                  <button
                    onClick={() => updateUserStatus(user._id, "inactive")}
                    style={inactiveBtn}
                  >
                    Inactive
                  </button>
                </td>

                <td style={td}>
                  <button onClick={() => deleteUser(user._id)} style={deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="8" style={emptyTd}>
                  No users found
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

const statusStyle = (status) => ({
  padding: "6px 10px",
  borderRadius: "20px",
  color: "white",
  background: status === "active" ? "#16a34a" : "red",
});

const activeBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const inactiveBtn = {
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

export default UserManagementPage;