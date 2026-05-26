import React, { useState } from "react";

import Dashboard from "../pages/Dashboard";
import CompanyForm from "../pages/CompanyForm";
import CompanyList from "../pages/CompanyList";
import SubscriptionPage from "../pages/SubscriptionPage";
import UserManagementPage from "../pages/UserManagementPage";
import EmployeeForm from "../pages/EmployeeForm";
import AttendancePage from "../pages/AttendancePage";
import LeavePage from "../pages/LeavePage";
import PayrollPage from "../pages/PayrollPage";
import ReportsPage from "../pages/ReportsPage";
import EmployeePortal from "../pages/EmployeePortal";

function Layout({ setToken }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [activePage, setActivePage] = useState("dashboard");

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  if (role === "employee") {
    return (
      <div style={layout}>
        <aside style={sidebar}>
          <h2 style={logo}>RK Payroll</h2>

          <button style={activeMenuBtn}>My Portal</button>

          <button style={logoutBtn} onClick={logout}>
            Logout
          </button>
        </aside>

        <main style={mainContent}>
          <EmployeePortal />
        </main>
      </div>
    );
  }

  const canView = (page) => {
    const permissions = {
      superadmin: [
        "dashboard",
        "company",
        "companyList",
        "subscription",
        "users",
        "employee",
        "attendance",
        "leave",
        "payroll",
        "reports",
      ],

      companyadmin: [
        "dashboard",
        "users",
        "employee",
        "attendance",
        "leave",
        "payroll",
        "reports",
      ],

      hradmin: [
        "dashboard",
        "employee",
        "attendance",
        "leave",
        "reports",
      ],

      payrolladmin: [
        "dashboard",
        "payroll",
        "reports",
      ],
    };

    return permissions[role]?.includes(page);
  };

  const changePage = (page) => {
    setActivePage(page);
  };

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <h2 style={logo}>RK Payroll</h2>

        <p style={roleText}>
          Logged in as: <b>{role}</b>
        </p>

        {canView("dashboard") && (
          <button
            style={activePage === "dashboard" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("dashboard")}
          >
            Dashboard
          </button>
        )}

        {canView("company") && (
          <button
            style={activePage === "company" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("company")}
          >
            Create Company
          </button>
        )}

        {canView("companyList") && (
          <button
            style={activePage === "companyList" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("companyList")}
          >
            Company List
          </button>
        )}

        {canView("subscription") && (
          <button
            style={activePage === "subscription" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("subscription")}
          >
            Subscriptions
          </button>
        )}

        {canView("users") && (
          <button
            style={activePage === "users" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("users")}
          >
            Users & Roles
          </button>
        )}

        {canView("employee") && (
          <button
            style={activePage === "employee" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("employee")}
          >
            Employees
          </button>
        )}

        {canView("attendance") && (
          <button
            style={activePage === "attendance" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("attendance")}
          >
            Attendance
          </button>
        )}

        {canView("leave") && (
          <button
            style={activePage === "leave" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("leave")}
          >
            Leave Management
          </button>
        )}

        {canView("payroll") && (
          <button
            style={activePage === "payroll" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("payroll")}
          >
            Monthly Payroll
          </button>
        )}

        {canView("reports") && (
          <button
            style={activePage === "reports" ? activeMenuBtn : menuBtn}
            onClick={() => changePage("reports")}
          >
            Reports
          </button>
        )}

        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>
      </aside>

      <main style={mainContent}>
        {activePage === "dashboard" && canView("dashboard") && <Dashboard />}
        {activePage === "company" && canView("company") && <CompanyForm />}
        {activePage === "companyList" && canView("companyList") && <CompanyList />}
        {activePage === "subscription" && canView("subscription") && <SubscriptionPage />}
        {activePage === "users" && canView("users") && <UserManagementPage />}
        {activePage === "employee" && canView("employee") && <EmployeeForm />}
        {activePage === "attendance" && canView("attendance") && <AttendancePage />}
        {activePage === "leave" && canView("leave") && <LeavePage />}
        {activePage === "payroll" && canView("payroll") && <PayrollPage />}
        {activePage === "reports" && canView("reports") && <ReportsPage />}
      </main>
    </div>
  );
}

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f4f6f9",
};

const sidebar = {
  width: "270px",
  minHeight: "100vh",
  background: "#0f1f4b",
  color: "white",
  padding: "25px",
};

const logo = {
  marginBottom: "15px",
  fontSize: "26px",
  fontWeight: "bold",
};

const roleText = {
  fontSize: "13px",
  marginBottom: "25px",
  opacity: 0.8,
};

const menuBtn = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  border: "none",
  borderRadius: "10px",
  background: "#1d327a",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  textAlign: "left",
};

const activeMenuBtn = {
  ...menuBtn,
  background: "#38bdf8",
  color: "#001b3d",
  fontWeight: "bold",
};

const logoutBtn = {
  width: "100%",
  padding: "14px",
  marginTop: "30px",
  border: "none",
  borderRadius: "10px",
  background: "red",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const mainContent = {
  flex: 1,
  padding: "30px",
  overflowY: "auto",
};

export default Layout;