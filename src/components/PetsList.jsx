import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PetsList() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    price: "",
    status: "Available",
    shelter_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchPets = async () => {
    const res = await axios.get("http://localhost:5000/api/pets");
    setPets(res.data);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/pets/${editingId}`, form);
    } else {
      await axios.post(`http://localhost:5000/api/pets`, form);
    }
    setForm({ name: "", type: "", breed: "", age: "", gender: "",price:"", status: "Available", shelter_id: "" });
    setEditingId(null);
    fetchPets();
  };

  const handleEdit = (pet) => {
    setForm(pet);
    setEditingId(pet.pet_id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/pets/${id}`);
    fetchPets();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🐶 Pets</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-1" />
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} className="border p-1" />
        <input name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} className="border p-1" />
        <input name="age" placeholder="Age" type="number" value={form.age} onChange={handleChange} className="border p-1" />
        <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} className="border p-1" />
         <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="border p-1" />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} className="border p-1" />
        <input name="shelter_id" placeholder="Shelter ID" value={form.shelter_id} onChange={handleChange} className="border p-1" />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Pet_id</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Breed</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Shelter ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.pet_id}>
              <td className="border p-2">{pet.pet_id}</td>
              <td className="border p-2">{pet.name}</td>
              <td className="border p-2">{pet.type}</td>
              <td className="border p-2">{pet.breed}</td>
              <td className="border p-2">{pet.age}</td>
              <td className="border p-2">{pet.gender}</td>
              <td className="border p-2">{pet.price}</td>
              <td className="border p-2">{pet.status}</td>
              <td className="border p-2">{pet.shelter_id}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(pet)} className="bg-yellow-400 px-2 rounded">Edit</button>
                <button onClick={() => handleDelete(pet.pet_id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
