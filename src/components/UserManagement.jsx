import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
const [selectedUserId, setSelectedUserId] = useState("");
const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem("token");



  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users/full", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };
  const handleUserSelect = async (e) => {
  const userId = e.target.value;
  setSelectedUserId(userId);
  if (userId) {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  } else {
    setSelectedUser(null);
  }
};


 /* const handleAction = async (action, adoption_id) => {
    try {
      await axios.put(`http://localhost:5000/api/adoptions/${action}/${adoption_id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(`${action} failed`, err);
    }
  };*/
  // Update adoption status
  const updateStatus = async (adoption_id, newStatus) => {
    await fetch(`http://localhost:5000/api/admin/admin/adoption-status/${adoption_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    window.location.reload();
  };   
  const handleAppointmentStatus = async (appointmentId, status) => {
  try {
    await axios.put(`http://localhost:5000/api/appointments/status/${appointmentId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers(); // refresh data
  } catch (err) {
    console.error("Failed to update appointment status", err);
  }
};



  return (
    <div className="p-6">
      <div className="mb-4">
  <label className="mr-2 font-semibold">Select User:</label>
  <select
    className="border p-2 rounded"
    value={selectedUserId}
    onChange={handleUserSelect}
  >
    <option value="">-- Select a user --</option>
    {users.map((u) => (
      <option key={u.user_id} value={u.user_id}>
        {u.name} ({u.email})
      </option>
    ))}
  </select>
</div>

      <h1 className="text-3xl font-bold mb-6">Admin: User Management</h1>
      {users.map((user) => (
        <div key={user.user_id} className="mb-8 border rounded p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">
            👤 {user.name} ({user.email}) - {user.role}
          </h2>

          {/* Adoptions */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1">Adoptions</h3>
            {user.adoptions.length === 0 ? (
              <p>No adoptions</p>
            ) : (
              <table className="w-full border mb-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1">Pet ID</th>
                    <th className="p-1">Price</th>
                    <th className="p-1">Start</th>
                    <th className="p-1">End</th>
                    <th className="p-1">Status</th>
                    <th className="p-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {user.adoptions.map((a) => (
                    <tr key={a.adoption_id} className="border-t">
                      <td className="p-1">{a.pet_id}</td>
                      <td className="p-1">${a.price}</td>
                      <td className="p-1">{new Date(a.start_date).toLocaleDateString()}</td>
                      <td className="p-1">{new Date(a.end_date).toLocaleDateString()}</td>
                      <td className="p-1">{a.status}</td> 

                    <td className="P-1"> {a.status !== 'cancelled' && (
                    <div className="mt-1">
                      <button
                        onClick={() => updateStatus(a.adoption_id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded hover:bg-green-600"
                      >Approve</button>
                      <button
                        onClick={() => updateStatus(a.adoption_id, 'rejected')}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                      >Reject</button>
                      <button
                        onClick={() => updateStatus(a.adoption_id, 'cancelled')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >Cancel</button>
                    </div>
                  )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Appointments */}
          <h3 className="text-lg font-semibold mt-4 mb-2">📅 Appointments</h3>
{user.appointments.length === 0 ? (
  <p className="text-gray-600">No appointments found.</p>
) : (
  <table className="w-full border border-gray-300 text-sm mb-4">
    <thead className="bg-gray-100">
      <tr>
        <th className="border p-1">Pet ID</th>
        <th className="border p-1">Date</th>
        <th className="border p-1">Time</th>
        <th className="border p-1">Reason</th>
        <th className="border p-1">Status</th>
        <th className="border p-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {user.appointments.map((a) => (
        <tr key={a.appointment_id} className="border-t">
          <td className="border p-1 text-center">#{a.pet_id}</td>
          <td className="border p-1 text-center">{new Date(a.date).toLocaleDateString("en-GB")}</td>
          <td className="border p-1 text-center">{a.time}</td>
          <td className="border p-1 text-center">{a.reason}</td>
          <td className="border p-1 text-center capitalize">{a.status}</td>
          <td className="border p-1 text-center space-x-1">
            {a.status !== "cancelled" && (
              <>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleAppointmentStatus(a.appointment_id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleAppointmentStatus(a.appointment_id, "rejected")}
                >
                  Reject
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleAppointmentStatus(a.appointment_id, "cancelled")}
                >
                  Cancel
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}


          {/* Reviews */}
          <div>
            <h3 className="text-lg font-bold mb-1">Reviews</h3>
            {user.reviews.length === 0 ? (
              <p>No reviews</p>
            ) : (
              <ul className="list-disc pl-6">
                {user.reviews.map((r) => (
                  <li key={r.review_id}>
                    🐾 Pet #{r.pet_id} - {r.rating}/5 - {r.comment}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}




// src/pages/UserManagement.jsx
/*import React, { useEffect, useState } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users-adoptions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [token]);

  const updateStatus = async (adoption_id, newStatus) => {
    await fetch(`http://localhost:5000/api/admin/adoption-status/${adoption_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {users.map((user) => (
        <div key={user.user_id} className="border p-3 mb-4 rounded shadow">
          <h3 className="font-semibold text-lg">{user.name} ({user.email})</h3>
          <p>Phone: {user.phone}</p>
          <div className="mt-2">
            <h4 className="font-semibold mb-1">Adoptions:</h4>
            {user.adoptions.length === 0 ? (
              <p className="text-sm">No adoptions</p>
            ) : (
              user.adoptions.map((ad) => (
                <div key={ad.adoption_id} className="border p-2 rounded mb-2">
                  <p>Pet: {ad.pet_name}</p>
                  <p>Price: ${ad.price}</p>
                  <p>Period: {ad.start_date?.slice(0, 10)} ➡ {ad.end_date?.slice(0, 10)}</p>
                  <p>Status: <strong>{ad.status}</strong></p>

                  {ad.status !== 'cancelled' && (
                    <div className="mt-1">
                      <button
                        onClick={() => updateStatus(ad.adoption_id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded hover:bg-green-600"
                      >Approve</button>
                      <button
                        onClick={() => updateStatus(ad.adoption_id, 'rejected')}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                      >Reject</button>
                      <button
                        onClick={() => updateStatus(ad.adoption_id, 'cancelled')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >Cancel</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}*/
