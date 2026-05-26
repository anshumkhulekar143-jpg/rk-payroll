import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EmployeePortal() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [form, setForm] = useState({
    leaveType: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    try {
      const attRes = await axios.get("http://localhost:3003/api/attendance", {
        headers,
      });

      const leaveRes = await axios.get("http://localhost:3003/api/leaves", {
        headers,
      });

      const payRes = await axios.get("http://localhost:3003/api/payroll", {
        headers,
      });

      setAttendance(
        attRes.data.filter(
          (a) => a.employeeId?._id === user.employeeId
        )
      );

      setLeaves(
        leaveRes.data.filter(
          (l) => l.employeeId?._id === user.employeeId
        )
      );

      setPayrolls(
        payRes.data.filter(
          (p) => p.employeeId?._id === user.employeeId
        )
      );
    } catch (err) {
      console.log("EMPLOYEE PORTAL ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
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
      await axios.post(
        "http://localhost:3003/api/leaves",
        {
          ...form,
          employeeId: user.employeeId,
        },
        { headers }
      );

      alert("Leave Applied Successfully");

      setForm({
        leaveType: "casual",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying leave");
    }
  };

  const downloadPayslip = (pay) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("RK Payroll - Employee Payslip", 55, 15);

    doc.setFontSize(11);
    doc.text(`Employee Name: ${pay.employeeId?.name || "-"}`, 14, 30);
    doc.text(`Employee ID: ${pay.employeeId?.employeeId || "-"}`, 14, 38);
    doc.text(`Month: ${pay.month}`, 14, 46);

    autoTable(doc, {
      startY: 60,
      head: [["Salary Details", "Amount"]],
      body: [
        ["Gross Salary", `Rs. ${pay.grossSalary || 0}`],
        ["Earned Salary", `Rs. ${pay.earnedSalary || 0}`],
        ["PF", `Rs. ${pay.pf || 0}`],
        ["ESI", `Rs. ${pay.esi || 0}`],
        ["PT", `Rs. ${pay.pt || 0}`],
        ["TDS", `Rs. ${pay.tds || 0}`],
        ["Net Salary", `Rs. ${pay.netSalary || 0}`],
      ],
    });

    doc.save(`${pay.month}-payslip.pdf`);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>My Profile</h2>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>

      <div style={card}>
        <h2>Apply Leave</h2>

        <form onSubmit={applyLeave}>
          <div style={grid}>
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

          <button style={button}>Apply Leave</button>
        </form>
      </div>

      <div style={card}>
        <h2>My Attendance</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
              <th style={th}>Overtime</th>
              <th style={th}>Late</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((att) => (
              <tr key={att._id}>
                <td style={td}>{att.date}</td>
                <td style={td}>{att.status}</td>
                <td style={td}>{att.overtimeHours}</td>
                <td style={td}>{att.lateMark ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={card}>
        <h2>My Leaves</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Type</th>
              <th style={th}>From</th>
              <th style={th}>To</th>
              <th style={th}>Reason</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={td}>{leave.leaveType}</td>
                <td style={td}>{leave.fromDate}</td>
                <td style={td}>{leave.toDate}</td>
                <td style={td}>{leave.reason || "-"}</td>
                <td style={td}>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={card}>
        <h2>My Payslips</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Month</th>
              <th style={th}>Gross</th>
              <th style={th}>Earned</th>
              <th style={th}>Net</th>
              <th style={th}>PDF</th>
            </tr>
          </thead>

          <tbody>
            {payrolls.map((pay) => (
              <tr key={pay._id}>
                <td style={td}>{pay.month}</td>
                <td style={td}>₹{pay.grossSalary}</td>
                <td style={td}>₹{pay.earnedSalary}</td>
                <td style={td}>₹{pay.netSalary}</td>
                <td style={td}>
                  <button
                    onClick={() => downloadPayslip(pay)}
                    style={pdfBtn}
                  >
                    PDF
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

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "25px",
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
  padding: "14px",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#0f1f4b",
  color: "white",
  padding: "12px",
  textAlign: "left",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const pdfBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default EmployeePortal;