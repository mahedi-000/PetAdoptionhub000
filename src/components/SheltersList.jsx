import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SheltersList() {
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchShelters = async () => {
    const res = await axios.get("http://localhost:5000/api/shelters");
    setShelters(res.data);
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/shelters/${editingId}`, form);
    } else {
      await axios.post("http://localhost:5000/api/shelters", form);
    }
    setForm({ name: "", location: "", phone: "", email: "" });
    setEditingId(null);
    fetchShelters();
  };

  const handleEdit = (shelter) => {
    setForm(shelter);
    setEditingId(shelter.shelter_id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/shelters/${id}`);
    fetchShelters();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏠 Shelters</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-1" />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-1" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-1" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-1" />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Id</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shelters.map((shelter) => (
            <tr key={shelter.shelter_id}>
              <td className="border p-2">{shelter.shelter_id}</td>
              <td className="border p-2">{shelter.name}</td>
              <td className="border p-2">{shelter.location}</td>
              <td className="border p-2">{shelter.phone}</td>
              <td className="border p-2">{shelter.email}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(shelter)} className="bg-yellow-400 px-2 rounded">Edit</button>
                <button onClick={() => handleDelete(shelter.shelter_id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
