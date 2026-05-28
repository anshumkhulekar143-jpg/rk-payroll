import React from "react";

function EmployeeTable() {
  const employees = [
    {
      id: "EMP001",
      name: "Rahul Sharma",
      department: "HR",
      salary: "₹35,000",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Priya Verma",
      department: "Accounts",
      salary: "₹42,000",
      status: "Active",
    },
    {
      id: "EMP003",
      name: "Amit Patil",
      department: "IT",
      salary: "₹50,000",
      status: "On Leave",
    },
  ];

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Employees</h2>

        <button>Add Employee</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, index) => (
            <tr key={index}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;