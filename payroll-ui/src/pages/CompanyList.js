import React, { useEffect, useState } from "react";
import axios from "axios";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [message, setMessage] = useState("");

  const loadCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data);
    } catch (error) {
      setMessage("Failed to load companies");
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const addCompany = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/companies/add", {
        companyName,
        companyCode,
      });

      setMessage(res.data.message);
      setCompanyName("");
      setCompanyCode("");
      loadCompanies();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add company");
    }
  };

 const deleteAllCompanies = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete all companies?"
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      "http://localhost:5000/api/companies/delete-all"
    );

    setMessage(res.data.message);
    setCompanies([]);
  } catch (error) {
    console.log("Delete Error:", error.response?.data || error.message);
    setMessage("Failed to delete companies");
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h2>Company List</h2>

      {message && (
        <p style={{ color: message.includes("Failed") ? "red" : "green" }}>
          {message}
        </p>
      )}

      <form onSubmit={addCompany} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={{ padding: "12px", marginRight: "10px", width: "250px" }}
        />

        <input
          type="text"
          placeholder="Company Code"
          value={companyCode}
          onChange={(e) => setCompanyCode(e.target.value)}
          style={{ padding: "12px", marginRight: "10px", width: "200px" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            background: "#0b1f4d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Add Company
        </button>

        <button
          type="button"
          onClick={deleteAllCompanies}
          style={{
            padding: "12px 20px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Delete All Companies
        </button>
      </form>

      <table border="1" cellPadding="12" width="100%">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Company Code</th>
          </tr>
        </thead>

        <tbody>
          {companies.length > 0 ? (
            companies.map((company) => (
              <tr key={company._id}>
                <td>{company.companyName}</td>
                <td>{company.companyCode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No companies found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyList;