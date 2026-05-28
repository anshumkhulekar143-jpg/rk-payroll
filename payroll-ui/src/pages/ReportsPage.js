import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const EMPLOYEE_API = "http://localhost:3003/api/employees";
const ATTENDANCE_API = "http://localhost:3003/api/attendance";
const LEAVE_API = "http://localhost:3003/api/leaves";
const PAYROLL_API = "http://localhost:3003/api/payrolls";

function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchReports = async () => {
    try {
      const empRes = await axios.get(EMPLOYEE_API, config);
      const attRes = await axios.get(ATTENDANCE_API, config);
      const leaveRes = await axios.get(LEAVE_API, config);
      const payrollRes = await axios.get(PAYROLL_API, config);

      setEmployees(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setPayrolls(payrollRes.data);
    } catch (error) {
      console.log("Reports error:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalPayroll = payrolls.reduce(
    (sum, item) => sum + Number(item.netSalary || 0),
    0
  );

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const presentToday = attendance.filter(
    (att) => att.status === "Present"
  ).length;

  const exportReportsExcel = () => {
    const data = payrolls.map((pay) => ({
      EmployeeID: pay.employeeId,
      Name: pay.name,
      Month: pay.month,
      BasicSalary: pay.basicSalary,
      PF: pay.pf,
      ESI: pay.esi,
      NetSalary: pay.netSalary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Report");
    XLSX.writeFile(workbook, "complete-payroll-report.xlsx");
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>Complete payroll, attendance and leave reports</p>
        </div>

        <button onClick={exportReportsExcel}>
          Export Payroll Report
        </button>
      </div>

      <div className="cards-container">
        <div className="card">
          <h3>Total Employees</h3>
          <h1>{employees.length}</h1>
        </div>

        <div className="card">
          <h3>Present Records</h3>
          <h1>{presentToday}</h1>
        </div>

        <div className="card">
          <h3>Approved Leaves</h3>
          <h1>{approvedLeaves}</h1>
        </div>

        <div className="card">
          <h3>Total Payroll</h3>
          <h1>₹{totalPayroll}</h1>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>PF</th>
            <th>ESI</th>
            <th>Net Salary</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="7">No payroll reports found</td>
            </tr>
          ) : (
            payrolls.map((pay) => (
              <tr key={pay._id}>
                <td>{pay.employeeId}</td>
                <td>{pay.name}</td>
                <td>{pay.month}</td>
                <td>₹{pay.basicSalary}</td>
                <td>₹{pay.pf}</td>
                <td>₹{pay.esi}</td>
                <td>₹{pay.netSalary}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsPage;