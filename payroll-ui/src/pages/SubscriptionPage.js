import React, { useEffect, useState } from "react";
import axios from "axios";

function SubscriptionPage() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://rk-payroll.onrender.com/api/company");
      setCompanies(res.data);
    } catch (err) {
      console.log("FETCH COMPANIES ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const updateSubscription = async (id, plan, months) => {
    try {
      await axios.put(
        `https://rk-payroll.onrender.com/api/company/${id}/subscription`,
        {
          subscriptionPlan: plan,
          months,
          status: "active",
        }
      );

      alert("Subscription Updated");
      fetchCompanies();
    } catch (err) {
      alert("Error updating subscription");
    }
  };

  const deactivateCompany = async (id) => {
    try {
      await axios.put(
        `https://rk-payroll.onrender.com/api/company/${id}/subscription`,
        {
          subscriptionPlan: "monthly",
          months: 0,
          status: "inactive",
        }
      );

      alert("Company Deactivated");
      fetchCompanies();
    } catch (err) {
      alert("Error deactivating company");
    }
  };

  return (
    <div style={container}>
      <div style={box}>
        <h2>Subscription Management</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Company</th>
              <th style={th}>Email</th>
              <th style={th}>Plan</th>
              <th style={th}>Status</th>
              <th style={th}>Start Date</th>
              <th style={th}>End Date</th>
              <th style={th}>Monthly</th>
              <th style={th}>Yearly</th>
              <th style={th}>Deactivate</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td style={td}>{company.companyName}</td>
                <td style={td}>{company.email}</td>
                <td style={td}>{company.subscriptionPlan}</td>
                <td style={td}>
                  <span style={statusStyle(company.status)}>
                    {company.status}
                  </span>
                </td>
                <td style={td}>
                  {company.subscriptionStartDate
                    ? company.subscriptionStartDate.slice(0, 10)
                    : "-"}
                </td>
                <td style={td}>
                  {company.subscriptionEndDate
                    ? company.subscriptionEndDate.slice(0, 10)
                    : "-"}
                </td>
                <td style={td}>
                  <button
                    onClick={() =>
                      updateSubscription(company._id, "monthly", 1)
                    }
                    style={monthlyBtn}
                  >
                    +1 Month
                  </button>
                </td>
                <td style={td}>
                  <button
                    onClick={() =>
                      updateSubscription(company._id, "yearly", 12)
                    }
                    style={yearlyBtn}
                  >
                    +1 Year
                  </button>
                </td>
                <td style={td}>
                  <button
                    onClick={() => deactivateCompany(company._id)}
                    style={deactivateBtn}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}

            {companies.length === 0 && (
              <tr>
                <td colSpan="9" style={emptyTd}>
                  No companies found
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

const box = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  overflowX: "auto",
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

const statusStyle = (status) => ({
  padding: "6px 10px",
  borderRadius: "20px",
  color: "white",
  background: status === "active" ? "#16a34a" : "red",
});

const monthlyBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const yearlyBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deactivateBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default SubscriptionPage;