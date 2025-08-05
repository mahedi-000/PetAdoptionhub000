// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const handleButtonClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-100 shadow">
      <h1 className="text-xl font-bold text-blue-600">🐾 PetAdoptHub</h1>

      {token && (
        <div className="flex gap-4">
          {role === "admin" && (
            <> <div className="flex gap-4">
              <Link to="/pets" className="text-blue-600 hover:underline">
                Pets
              </Link>
              <Link to="/shelters" className="text-blue-600 hover:underline">
                Shelters
              </Link>
             <Link to="/admin/users" className="text-blue-600 hover:underline">
             User Management
             </Link>
             </div>
            </>
          )}
          {role === "user" && (
            <>
               <Link to="/my-adoptions">My Adoptions</Link>

              <Link to="/appointments" className="text-blue-600 hover:underline ">
                Appointments
              </Link>
              <Link to="/reviews" className="text-blue-600 hover:underline">
                Reviews
              </Link>
              <Link to="/PetList"className="text-blue-600 hover:underline">
              search
             </Link>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {token && (
          <span className="text-sm text-gray-700">
            👤 {role} | 📧 {email} | 🆔 {userId}
          </span>
        )}
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {token ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}
