import React from "react";
import Layout from "../components/Layout";
import DashboardStats from "./DashboardStats";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";

function CompanyAdminDashboard({ setToken }) {
  return (
    <Layout setToken={setToken}>
      <DashboardStats />
      <div />
      <div />
      <EmployeeForm />
      <EmployeeList />
    </Layout>
  );
}

export default CompanyAdminDashboard;