import React from "react";

function Topbar({ logout, title }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p>Welcome, {user?.name || "Super Admin"}</p>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Topbar;