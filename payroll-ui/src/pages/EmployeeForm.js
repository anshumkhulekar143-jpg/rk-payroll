import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function EmployeeForm() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const emptyForm = {
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
  };

  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/employees", {
        headers,
      });

      setEmployees(res.data);
    } catch (err) {
      console.log("FETCH EMPLOYEES ERROR:", err);
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:3003/api/employees/${editId}`, form, {
          headers,
        });

        alert("Employee Updated Successfully");
      } else {
        await axios.post("http://localhost:3003/api/employees", form, {
          headers,
        });

        alert("Employee Added Successfully");
      }

      resetForm();
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving employee");
    }
  };

  const editEmployee = (emp) => {
    setEditId(emp._id);

    setForm({
      employeeId: emp.employeeId || "",
      name: emp.name || "",
      dob: emp.dob || "",
      mobileNo: emp.mobileNo || "",
      email: emp.email || "",
      aadharNo: emp.aadharNo || "",
      uanNo: emp.uanNo || "",
      pfNo: emp.pfNo || "",
      esiNo: emp.esiNo || "",
      bankName: emp.bankName || "",
      accountNo: emp.accountNo || "",
      ifscCode: emp.ifscCode || "",
      basicSalary: emp.basicSalary || "",
      hra: emp.hra || "",
      allowance: emp.allowance || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await axios.delete(`http://localhost:3003/api/employees/${id}`, {
        headers,
      });

      fetchEmployees();
    } catch (err) {
      alert("Error deleting employee");
    }
  };

  const downloadSalarySlip = (emp) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("RK Payroll - Salary Slip", 65, 15);

    doc.setFontSize(11);
    doc.text(`Employee Name: ${emp.name || "-"}`, 14, 30);
    doc.text(`Employee ID: ${emp.employeeId || "-"}`, 14, 38);
    doc.text(`Mobile: ${emp.mobileNo || "-"}`, 14, 46);
    doc.text(`Email: ${emp.email || "-"}`, 14, 54);

    doc.text(`UAN No: ${emp.uanNo || "-"}`, 110, 30);
    doc.text(`PF No: ${emp.pfNo || "-"}`, 110, 38);
    doc.text(`ESI No: ${emp.esiNo || "-"}`, 110, 46);
    doc.text(`Aadhar No: ${emp.aadharNo || "-"}`, 110, 54);

    doc.text(`Bank: ${emp.bankName || "-"}`, 14, 68);
    doc.text(`Account No: ${emp.accountNo || "-"}`, 14, 76);
    doc.text(`IFSC Code: ${emp.ifscCode || "-"}`, 14, 84);

    autoTable(doc, {
      startY: 96,
      head: [["Earnings", "Amount"]],
      body: [
        ["Basic Salary", `Rs. ${emp.basicSalary || 0}`],
        ["HRA", `Rs. ${emp.hra || 0}`],
        ["Allowance", `Rs. ${emp.allowance || 0}`],
        ["Gross Salary", `Rs. ${emp.grossSalary || 0}`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Deductions", "Amount"]],
      body: [
        ["PF", `Rs. ${emp.pf || 0}`],
        ["ESI", `Rs. ${emp.esi || 0}`],
        ["PT", `Rs. ${emp.pt || 0}`],
        ["TDS", `Rs. ${emp.tds || 0}`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      body: [["Net Salary", `Rs. ${emp.netSalary || 0}`]],
    });

    doc.save(`${emp.name || "employee"}-salary-slip.pdf`);
  };

  const exportEmployeesToExcel = () => {
    const exportData = employees.map((emp) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      dob: emp.dob,
      mobileNo: emp.mobileNo,
      email: emp.email,
      aadharNo: emp.aadharNo,
      uanNo: emp.uanNo,
      pfNo: emp.pfNo,
      esiNo: emp.esiNo,
      bankName: emp.bankName,
      accountNo: emp.accountNo,
      ifscCode: emp.ifscCode,
      basicSalary: emp.basicSalary,
      hra: emp.hra,
      allowance: emp.allowance,
      grossSalary: emp.grossSalary,
      pf: emp.pf,
      esi: emp.esi,
      pt: emp.pt,
      tds: emp.tds,
      netSalary: emp.netSalary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  const importEmployeesFromExcel = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryData = event.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
          alert("Excel file is empty");
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const row of rows) {
          const employeeData = {
            employeeId: row.employeeId || row.EmployeeID || row["Employee ID"] || "",
            name: row.name || row.Name || "",
            dob: row.dob || row.DOB || "",
            mobileNo: row.mobileNo || row.Mobile || row["Mobile No"] || "",
            email: row.email || row.Email || "",
            aadharNo: row.aadharNo || row.Aadhar || row["Aadhar No"] || "",
            uanNo: row.uanNo || row.UAN || row["UAN No"] || "",
            pfNo: row.pfNo || row.PF || row["PF No"] || "",
            esiNo: row.esiNo || row.ESI || row["ESI No"] || "",
            bankName: row.bankName || row.Bank || row["Bank Name"] || "",
            accountNo: row.accountNo || row.Account || row["Account No"] || "",
            ifscCode: row.ifscCode || row.IFSC || row["IFSC Code"] || "",
            basicSalary: row.basicSalary || row.Basic || row["Basic Salary"] || 0,
            hra: row.hra || row.HRA || 0,
            allowance: row.allowance || row.Allowance || 0,
          };

          if (!employeeData.employeeId || !employeeData.name) {
            failCount++;
            continue;
          }

          try {
            await axios.post("http://localhost:3003/api/employees", employeeData, {
              headers,
            });

            successCount++;
          } catch (err) {
            failCount++;
          }
        }

        alert(`Excel Import Complete\nSuccess: ${successCount}\nFailed/Duplicate: ${failCount}`);

        fetchEmployees();
        e.target.value = "";
      } catch (err) {
        console.log("EXCEL IMPORT ERROR:", err);
        alert("Error importing Excel file");
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadExcelTemplate = () => {
    const templateData = [
      {
        employeeId: "EMP001",
        name: "Ramesh Kumar",
        dob: "1998-05-20",
        mobileNo: "9876543210",
        email: "ramesh@gmail.com",
        aadharNo: "123456789012",
        uanNo: "100200300400",
        pfNo: "PF12345",
        esiNo: "ESI12345",
        bankName: "HDFC Bank",
        accountNo: "1234567890",
        ifscCode: "HDFC0001234",
        basicSalary: 15000,
        hra: 5000,
        allowance: 3000,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "employee-import-template.xlsx");
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();

    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.mobileNo?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={container}>
      <div style={formBox}>
        <h2>{editId ? "Edit Employee" : "Add Employee"}</h2>

        <form onSubmit={saveEmployee}>
          <div style={grid}>
            <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} style={input} required />
            <input name="name" placeholder="Employee Name" value={form.name} onChange={handleChange} style={input} required />
            <input type="date" name="dob" value={form.dob} onChange={handleChange} style={input} />
            <input name="mobileNo" placeholder="Mobile Number" value={form.mobileNo} onChange={handleChange} style={input} />
            <input name="email" placeholder="Email Optional" value={form.email} onChange={handleChange} style={input} />
            <input name="aadharNo" placeholder="Aadhar Number" value={form.aadharNo} onChange={handleChange} style={input} />
            <input name="uanNo" placeholder="UAN Number" value={form.uanNo} onChange={handleChange} style={input} />
            <input name="pfNo" placeholder="PF Number" value={form.pfNo} onChange={handleChange} style={input} />
            <input name="esiNo" placeholder="ESI Number" value={form.esiNo} onChange={handleChange} style={input} />
            <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} style={input} />
            <input name="accountNo" placeholder="Account Number" value={form.accountNo} onChange={handleChange} style={input} />
            <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} style={input} />
            <input name="basicSalary" type="number" placeholder="Basic Salary" value={form.basicSalary} onChange={handleChange} style={input} />
            <input name="hra" type="number" placeholder="HRA" value={form.hra} onChange={handleChange} style={input} />
            <input name="allowance" type="number" placeholder="Allowance" value={form.allowance} onChange={handleChange} style={input} />
          </div>

          <div style={actionRow}>
            <button type="submit" style={editId ? updateBtn : button}>
              {editId ? "Update Employee" : "Add Employee"}
            </button>

            {editId && (
              <button type="button" onClick={resetForm} style={cancelBtn}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={excelBox}>
        <h2>Excel Import / Export</h2>

        <div style={excelButtons}>
          <button onClick={downloadExcelTemplate} style={templateBtn}>
            Download Template
          </button>

          <label style={importBtn}>
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={importEmployeesFromExcel}
              style={{ display: "none" }}
            />
          </label>

          <button onClick={exportEmployeesToExcel} style={exportBtn}>
            Export Employees
          </button>
        </div>
      </div>

      <div style={tableBox}>
        <div style={topBar}>
          <h2>Employee List</h2>

          <input
            type="text"
            placeholder="Search by name, ID or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Mobile</th>
              <th style={th}>Gross</th>
              <th style={th}>PF</th>
              <th style={th}>ESI</th>
              <th style={th}>PT</th>
              <th style={th}>TDS</th>
              <th style={th}>Net</th>
              <th style={th}>PDF</th>
              <th style={th}>Edit</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td style={td}>{emp.employeeId}</td>
                <td style={td}>{emp.name}</td>
                <td style={td}>{emp.mobileNo || "-"}</td>
                <td style={td}>₹{emp.grossSalary || 0}</td>
                <td style={td}>₹{emp.pf || 0}</td>
                <td style={td}>₹{emp.esi || 0}</td>
                <td style={td}>₹{emp.pt || 0}</td>
                <td style={td}>₹{emp.tds || 0}</td>
                <td style={td}>₹{emp.netSalary || 0}</td>

                <td style={td}>
                  <button onClick={() => downloadSalarySlip(emp)} style={pdfBtn}>
                    PDF
                  </button>
                </td>

                <td style={td}>
                  <button onClick={() => editEmployee(emp)} style={editBtn}>
                    Edit
                  </button>
                </td>

                <td style={td}>
                  <button onClick={() => deleteEmployee(emp._id)} style={deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="12" style={emptyTd}>
                  No employees found
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

const excelBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
};

const excelButtons = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
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

const actionRow = {
  display: "flex",
  gap: "15px",
  marginTop: "20px",
};

const button = {
  flex: 1,
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
};

const updateBtn = {
  ...button,
  background: "#16a34a",
};

const cancelBtn = {
  ...button,
  background: "#64748b",
};

const templateBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#7c3aed",
  color: "white",
  cursor: "pointer",
};

const importBtn = {
  padding: "12px 18px",
  borderRadius: "8px",
  background: "#f97316",
  color: "white",
  cursor: "pointer",
};

const exportBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#16a34a",
  color: "white",
  cursor: "pointer",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "20px",
};

const searchInput = {
  width: "330px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
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

const pdfBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  background: "#16a34a",
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

export default EmployeeForm;