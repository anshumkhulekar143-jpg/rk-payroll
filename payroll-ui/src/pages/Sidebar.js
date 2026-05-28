import React from "react";

function Sidebar({ activePage, setActivePage }) {
 const menus = [
  "Dashboard",
  "Company",
  "Employees",
  "Attendance",
  "Leave",
  "Payroll",
  "Reports",
  "Settings",
]; 

  return (
    <div className="sidebar">
      <h2>RK Payroll</h2>

      {menus.map((menu) => (
        <button
          key={menu}
          type="button"
          onClick={() => setActivePage(menu)}
          className={activePage === menu ? "active-menu" : ""}
        >
          {menu}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;