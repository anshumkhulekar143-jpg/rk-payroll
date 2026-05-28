import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const API_URL = "http://localhost:3003/api/payrolls";

function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    month: "",
    basicSalary: "",
    bonus: "",
    deduction: "",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setPayrolls(res.data);
    } catch (error) {
      console.log("Fetch payroll error:", error);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, form, config);

      setForm({
        employeeId: "",
        name: "",
        month: "",
        basicSalary: "",
        bonus: "",
        deduction: "",
      });

      fetchPayrolls();
      alert("Payroll generated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error generating payroll"
      );
    }
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete this payroll?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, config);
      fetchPayrolls();
    } catch (error) {
      console.log(error);
    }
  };

  const downloadSalarySlip = (pay) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("RK Payroll - Salary Slip", 65, 15);

    doc.setFontSize(11);
    doc.text(`Employee ID: ${pay.employeeId}`, 14, 30);
    doc.text(`Employee Name: ${pay.name}`, 14, 38);
    doc.text(`Month: ${pay.month}`, 14, 46);

    autoTable(doc, {
      startY: 60,
      head: [["Earnings", "Amount"]],
      body: [
        ["Basic Salary", `Rs. ${pay.basicSalary}`],
        ["Bonus", `Rs. ${pay.bonus || 0}`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Deductions", "Amount"]],
      body: [
        ["PF", `Rs. ${pay.pf}`],
        ["ESI", `Rs. ${pay.esi}`],
        ["Other Deduction", `Rs. ${pay.deduction || 0}`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      body: [["Net Salary", `Rs. ${pay.netSalary}`]],
    });

    doc.save(`${pay.name}-salary-slip.pdf`);
  };

  const exportPayrollExcel = () => {
    if (payrolls.length === 0) {
      alert("No payroll records to export");
      return;
    }

    const data = payrolls.map((pay) => ({
      EmployeeID: pay.employeeId,
      Name: pay.name,
      Month: pay.month,
      BasicSalary: pay.basicSalary,
      Bonus: pay.bonus || 0,
      Deduction: pay.deduction || 0,
      PF: pay.pf,
      ESI: pay.esi,
      NetSalary: pay.netSalary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
    XLSX.writeFile(workbook, "payroll-report.xlsx");
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Payroll Management</h2>
          <p>Generate salary, download PDF and export Excel</p>
        </div>

        <button onClick={exportPayrollExcel}>
          Export Excel
        </button>
      </div>

      <form className="employee-form" onSubmit={generatePayroll}>
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
          type="month"
          name="month"
          value={form.month}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="basicSalary"
          placeholder="Basic Salary"
          value={form.basicSalary}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="bonus"
          placeholder="Bonus"
          value={form.bonus}
          onChange={handleChange}
        />

        <input
          type="number"
          name="deduction"
          placeholder="Deduction"
          value={form.deduction}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">Generate Payroll</button>
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deduction</th>
            <th>PF</th>
            <th>ESI</th>
            <th>Net Salary</th>
            <th>PDF</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="11">No payroll records found</td>
            </tr>
          ) : (
            payrolls.map((pay) => (
              <tr key={pay._id}>
                <td>{pay.employeeId}</td>
                <td>{pay.name}</td>
                <td>{pay.month}</td>
                <td>₹{pay.basicSalary}</td>
                <td>₹{pay.bonus || 0}</td>
                <td>₹{pay.deduction || 0}</td>
                <td>₹{pay.pf}</td>
                <td>₹{pay.esi}</td>
                <td>₹{pay.netSalary}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => downloadSalarySlip(pay)}
                  >
                    PDF
                  </button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deletePayroll(pay._id)}
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

export default PayrollPage;