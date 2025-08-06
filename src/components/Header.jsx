import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Make sure to create this CSS file

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="header">
      <div className="header-container">
        <h1 className="logo">🐾 PetAdoptHub</h1>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {token && (
            <>
              {role === "admin" && (
                <>
                  <Link to="/pets">Pets</Link>
                  <Link to="/shelters">Shelters</Link>
                  <Link to="/admin/users">User Management</Link>
                </>
              )}
              {role === "user" && (
                <>
                  <Link to="/my-adoptions">My Adoptions</Link>
                  <Link to="/appointments">Appointments</Link>
                  <Link to="/reviews">Reviews</Link>
                  <Link to="/PetList">Search</Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="user-info">
          {token && (
            <span>
              👤 {role} | 📧 {email} | 🆔 {userId}
            </span>
          )}
          <button onClick={handleLogout}>
            {token ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
}
