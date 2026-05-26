import React from "react";
import Layout from "./components/Layout";
import DashboardStats from "./pages/DashboardStats";
import CompanyForm from "./pages/CompanyForm";
import CompanyList from "./pages/CompanyList";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeList from "./pages/EmployeeList";

function SuperAdminDashboard({ setToken }) {
  return (
    <Layout setToken={setToken}>
      <DashboardStats />
      <CompanyForm />
      <CompanyList />
      <EmployeeForm />
      <EmployeeList />
    </Layout>
  );
}

export default SuperAdminDashboard;