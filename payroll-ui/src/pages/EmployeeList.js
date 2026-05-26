import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function EmployeeList() {
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const authHeader = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = React.useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/companies");
    setCompanies(res.data);
  } catch (error) {
    console.log(error);
  }
}, []);

useEffect(() => {
  fetchCompanies();
}, [fetchCompanies]);

  const fetchEmployees = async (companyId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:3003/api/employee/company/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees(res.data);
    setMessage("");
  } catch (error) {
    console.log("EMPLOYEE LOAD ERROR:", error.response?.data || error.message);
    setEmployees([]);
    setMessage(error.response?.data?.message || "Failed to load employees");
  }
};

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSearch("");

    if (companyId) {
      fetchEmployees(companyId);
    } else {
      setEmployees([]);
    }
  };

  const filteredEmployees = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return employees;

    return employees.filter((emp) => {
      return (
        (emp.employeeId || "").toLowerCase().includes(text) ||
        (emp.fullName || "").toLowerCase().includes(text) ||
        (emp.uanNo || "").toLowerCase().includes(text) ||
        (emp.department || "").toLowerCase().includes(text) ||
        (emp.designation || "").toLowerCase().includes(text)
      );
    });
  }, [employees, search]);

  const deleteEmployee = async (employeeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:3003/api/employee/${employeeId}`,
        {
          headers: authHeader(),
        }
      );

      setMessage(res.data.message || "Employee deleted successfully");

      if (selectedCompany) {
        fetchEmployees(selectedCompany);
      }
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const downloadSalarySlip = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:3003/api/salary-slip/${employeeId}/download`,
        {
          headers: authHeader(),
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `Salary_Slip_${employeeId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("PDF ERROR:", error.response?.data || error.message);
      alert("Failed to download salary slip");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Payroll List</h2>

        {message && <p style={styles.message}>{message}</p>}

        <input
          type="text"
          placeholder="Search by ID, name, UAN, department, or designation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <h3 style={styles.subHeading}>Employee List by Company</h3>

        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          style={styles.select}
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.companyName}
            </option>
          ))}
        </select>

        {filteredEmployees.length === 0 ? (
          <p style={styles.noData}>No employees found</p>
        ) : (
          <div style={styles.grid}>
            {filteredEmployees.map((emp) => (
              <div key={emp._id} style={styles.employeeCard}>
                <h3 style={styles.empName}>{emp.fullName || "N/A"}</h3>

                <p>
                  <strong>Employee ID:</strong> {emp.employeeId || "N/A"}
                </p>
                <p>
                  <strong>UAN No:</strong> {emp.uanNo || "N/A"}
                </p>
                <p>
                  <strong>ESI No:</strong> {emp.esiNo || "N/A"}
                </p>
                <p>
                  <strong>PF No:</strong> {emp.pfNo || "N/A"}
                </p>
                <p>
                  <strong>Aadhar No:</strong> {emp.aadharNo || "N/A"}
                </p>
                <p>
                  <strong>DOB:</strong> {emp.dob || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {emp.email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {emp.phone || "N/A"}
                </p>
                <p>
                  <strong>Department:</strong> {emp.department || "N/A"}
                </p>
                <p>
                  <strong>Designation:</strong> {emp.designation || "N/A"}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{emp.salary || 0}
                </p>
                <p>
                  <strong>PF:</strong> ₹{emp.pf || 0}
                </p>
                <p>
                  <strong>ESIC:</strong> ₹{emp.esic || 0}
                </p>
                <p>
                  <strong>PT:</strong> ₹{emp.pt || 0}
                </p>
                <p>
                  <strong>TDS:</strong> ₹{emp.tds || 0}
                </p>
                <p>
                  <strong>Net Pay:</strong> ₹{emp.netPay || 0}
                </p>

                <div style={styles.buttonRow}>
                  <button
                    onClick={() => deleteEmployee(emp._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => downloadSalarySlip(emp._id)}
                    style={styles.pdfBtn}
                  >
                    Download Salary Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "20px",
    color: "#1e293b",
  },
  message: {
    marginBottom: "12px",
    color: "red",
    fontWeight: "bold",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "20px",
    fontSize: "15px",
  },
  subHeading: {
    marginBottom: "15px",
    color: "#1e293b",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  noData: {
    color: "#64748b",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },
  employeeCard: {
    backgroundColor: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  empName: {
    marginBottom: "10px",
    color: "#0f172a",
  },
  buttonRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
  },
  pdfBtn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
  },
};

export default EmployeeList;