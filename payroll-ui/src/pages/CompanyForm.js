import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeForm() {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    dob: "",
    mobileNo: "",
    email: "",
    aadharNo: "",
    uanNo: "",
    pfNo: "",
    esiNo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    basicSalary: "",
    hra: "",
    allowance: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3003/api/employees",
        { headers }
      );

      setEmployees(res.data);
    } catch (err) {
      console.log(err);
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

  const createEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3003/api/employees",
        form,
        { headers }
      );

      alert("Employee Added");

      setForm({
        employeeId: "",
        name: "",
        dob: "",
        mobileNo: "",
        email: "",
        aadharNo: "",
        uanNo: "",
        pfNo: "",
        esiNo: "",
        bankName: "",
        accountNo: "",
        ifscCode: "",
        basicSalary: "",
        hra: "",
        allowance: "",
      });

      fetchEmployees();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error adding employee"
      );
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3003/api/employees/${id}`,
        { headers }
      );

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>Add Employee</h2>

        <form onSubmit={createEmployee}>
          <div style={grid}>
            <input
              name="employeeId"
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              name="name"
              placeholder="Employee Name"
              value={form.name}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              style={input}
            />

            <input
              name="mobileNo"
              placeholder="Mobile Number"
              value={form.mobileNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={input}
            />

            <input
              name="aadharNo"
              placeholder="Aadhar Number"
              value={form.aadharNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="uanNo"
              placeholder="UAN Number"
              value={form.uanNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="pfNo"
              placeholder="PF Number"
              value={form.pfNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="esiNo"
              placeholder="ESI Number"
              value={form.esiNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="bankName"
              placeholder="Bank Name"
              value={form.bankName}
              onChange={handleChange}
              style={input}
            />

            <input
              name="accountNo"
              placeholder="Account Number"
              value={form.accountNo}
              onChange={handleChange}
              style={input}
            />

            <input
              name="ifscCode"
              placeholder="IFSC Code"
              value={form.ifscCode}
              onChange={handleChange}
              style={input}
            />

            <input
              name="basicSalary"
              placeholder="Basic Salary"
              value={form.basicSalary}
              onChange={handleChange}
              style={input}
            />

            <input
              name="hra"
              placeholder="HRA"
              value={form.hra}
              onChange={handleChange}
              style={input}
            />

            <input
              name="allowance"
              placeholder="Allowance"
              value={form.allowance}
              onChange={handleChange}
              style={input}
            />
          </div>

          <button style={button}>
            Add Employee
          </button>
        </form>
      </div>

      <div style={tableBox}>
        <h2>Employee List</h2>

        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Gross</th>
              <th>PF</th>
              <th>ESI</th>
              <th>TDS</th>
              <th>Net Salary</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.mobileNo}</td>
                <td>{emp.grossSalary}</td>
                <td>{emp.pf}</td>
                <td>{emp.esi}</td>
                <td>{emp.tds}</td>
                <td>{emp.netSalary}</td>

                <td>
                  <button
                    onClick={() =>
                      deleteEmployee(emp._id)
                    }
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default EmployeeForm;