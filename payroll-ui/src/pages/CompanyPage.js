import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3003/api/companies";

function CompanyPage() {
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    plan: "Monthly",
    status: "Active",
  });

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(API_URL);
      setCompanies(res.data);
    } catch (error) {
      console.log("Fetch companies error:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCompany = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, form);

      setForm({
        companyName: "",
        email: "",
        password: "",
        plan: "Monthly",
        status: "Active",
      });

      fetchCompanies();
      alert("Company created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating company");
    }
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Company Management</h2>
          <p>Create and manage company accounts</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={createCompany}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Company Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Company Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="plan" value={form.plan} onChange={handleChange}>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="form-buttons">
          <button type="submit">Create Company</button>
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan="4">No companies found</td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company._id}>
                <td>{company.companyName}</td>
                <td>{company.email}</td>
                <td>{company.plan}</td>
                <td>{company.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyPage;