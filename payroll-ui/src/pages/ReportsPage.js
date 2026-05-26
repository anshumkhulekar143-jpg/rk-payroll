import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchReportsData = async () => {
    try {
      const empRes = await axios.get("https://rk-payroll.onrender.com/api/employees", {
        headers,
      });

      const attRes = await axios.get("https://rk-payroll.onrender.com/api/attendance", {
        headers,
      });

      const leaveRes = await axios.get("https://rk-payroll.onrender.com/api/leaves", {
        headers,
      });

      const payrollRes = await axios.get("https://rk-payroll.onrender.com/api/payroll", {
        headers,
      });

      setEmployees(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setPayrolls(payrollRes.data);
    } catch (err) {
      console.log("REPORTS DATA ERROR:", err);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const exportToExcel = (data, fileName, sheetName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportEmployeeReport = () => {
    const data = employees.map((emp) => ({
      EmployeeID: emp.employeeId,
      Name: emp.name,
      Mobile: emp.mobileNo,
      Email: emp.email,
      Aadhar: emp.aadharNo,
      UAN: emp.uanNo,
      PFNo: emp.pfNo,
      ESINo: emp.esiNo,
      Bank: emp.bankName,
      AccountNo: emp.accountNo,
      IFSC: emp.ifscCode,
      GrossSalary: emp.grossSalary,
      NetSalary: emp.netSalary,
    }));

    exportToExcel(data, "employee-report", "Employees");
  };

  const exportAttendanceReport = () => {
    const data = attendance.map((att) => ({
      Date: att.date,
      EmployeeID: att.employeeId?.employeeId,
      Name: att.employeeId?.name,
      Status: att.status,
      OvertimeHours: att.overtimeHours,
      LateMark: att.lateMark ? "Yes" : "No",
    }));

    exportToExcel(data, "attendance-report", "Attendance");
  };

  const exportLeaveReport = () => {
    const data = leaves.map((leave) => ({
      EmployeeID: leave.employeeId?.employeeId,
      Name: leave.employeeId?.name,
      LeaveType: leave.leaveType,
      FromDate: leave.fromDate,
      ToDate: leave.toDate,
      Reason: leave.reason,
      Status: leave.status,
    }));

    exportToExcel(data, "leave-report", "Leaves");
  };

  const exportPayrollReport = () => {
    const data = payrolls.map((pay) => ({
      Month: pay.month,
      EmployeeID: pay.employeeId?.employeeId,
      Name: pay.employeeId?.name,
      TotalDays: pay.totalDays,
      PresentDays: pay.presentDays,
      AbsentDays: pay.absentDays,
      PayableDays: pay.payableDays,
      GrossSalary: pay.grossSalary,
      EarnedSalary: pay.earnedSalary,
      PF: pay.pf,
      ESI: pay.esi,
      PT: pay.pt,
      TDS: pay.tds,
      NetSalary: pay.netSalary,
    }));

    exportToExcel(data, "payroll-report", "Payroll");
  };

  const totalEmployees = employees.length;

  const totalNetPayroll = payrolls.reduce(
    (sum, pay) => sum + Number(pay.netSalary || 0),
    0
  );

  const totalPF = payrolls.reduce(
    (sum, pay) => sum + Number(pay.pf || 0),
    0
  );

  const totalESI = payrolls.reduce(
    (sum, pay) => sum + Number(pay.esi || 0),
    0
  );

  const totalTDS = payrolls.reduce(
    (sum, pay) => sum + Number(pay.tds || 0),
    0
  );

  return (
    <div style={container}>
      <h1>Reports</h1>

      <div style={cards}>
        <div style={card}>
          <h3>Total Employees</h3>
          <h2>{totalEmployees}</h2>
        </div>

        <div style={card}>
          <h3>Total Net Payroll</h3>
          <h2>₹{totalNetPayroll}</h2>
        </div>

        <div style={card}>
          <h3>Total PF</h3>
          <h2>₹{totalPF}</h2>
        </div>

        <div style={card}>
          <h3>Total ESI</h3>
          <h2>₹{totalESI}</h2>
        </div>

        <div style={card}>
          <h3>Total TDS</h3>
          <h2>₹{totalTDS}</h2>
        </div>
      </div>

      <div style={box}>
        <h2>Export Reports</h2>

        <div style={buttons}>
          <button onClick={exportEmployeeReport} style={btn}>
            Export Employee Report
          </button>

          <button onClick={exportAttendanceReport} style={btn}>
            Export Attendance Report
          </button>

          <button onClick={exportLeaveReport} style={btn}>
            Export Leave Report
          </button>

          <button onClick={exportPayrollReport} style={btn}>
            Export Payroll Report
          </button>
        </div>
      </div>
    </div>
  );
}

const container = {
  padding: "20px",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  background: "#0f1f4b",
  color: "white",
  padding: "25px",
  borderRadius: "15px",
};

const box = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
};

const buttons = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const btn = {
  padding: "14px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

export default ReportsPage;