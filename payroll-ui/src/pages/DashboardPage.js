import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardCards from "./DashboardCards";
import EmployeeTable from "./EmployeeTable";

import CompanyPage from "./CompanyPage";
import EmployeesPage from "./EmployeesPage";
import AttendancePage from "./AttendancePage";
import LeavePage from "./LeavePage";
import PayrollPage from "./PayrollPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

function DashboardPage({ logout }) {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="dashboard-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">

        <Topbar
          logout={logout}
          title={activePage}
        />

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <>
            <DashboardCards />
            <EmployeeTable />
          </>
        )}

        {/* COMPANY */}

        {activePage === "Company" && (
          <CompanyPage />
        )}

        {/* EMPLOYEES */}

        {activePage === "Employees" && (
          <EmployeesPage />
        )}

        {/* ATTENDANCE */}

        {activePage === "Attendance" && (
          <AttendancePage />
        )}

        {/* LEAVE */}

        {activePage === "Leave" && (
          <LeavePage />
        )}

        {/* PAYROLL */}

        {activePage === "Payroll" && (
          <PayrollPage />
        )}

        {/* REPORTS */}

        {activePage === "Reports" && (
          <ReportsPage />
        )}

        {/* SETTINGS */}

        {activePage === "Settings" && (
          <SettingsPage />
        )}

      </main>
    </div>
  );
}

export default DashboardPage;