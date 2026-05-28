import React, { useState } from "react";

function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "RK Payroll",
    email: "admin@gmail.com",
    pfRate: 12,
    esiRate: 0.75,
    tdsRate: 10,
    professionalTax: 200,
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = (e) => {
    e.preventDefault();
    alert("Settings saved successfully");
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Manage company and payroll settings</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={saveSettings}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={settings.companyName}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Company Email"
          value={settings.email}
          onChange={handleChange}
        />

        <input
          name="pfRate"
          placeholder="PF Rate %"
          value={settings.pfRate}
          onChange={handleChange}
        />

        <input
          name="esiRate"
          placeholder="ESI Rate %"
          value={settings.esiRate}
          onChange={handleChange}
        />

        <input
          name="tdsRate"
          placeholder="TDS Rate %"
          value={settings.tdsRate}
          onChange={handleChange}
        />

        <input
          name="professionalTax"
          placeholder="Professional Tax"
          value={settings.professionalTax}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">Save Settings</button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;