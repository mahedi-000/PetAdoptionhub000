// src/pages/Pets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Pets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/petview")
      .then(res => setPets(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Available Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map((pet) => (
            <tr key={pet.pet_id}>
              <td className="border p-2">{pet.pet_id}</td>
              <td className="border p-2">{pet.name}</td>
              <td className="border p-2">{pet.type}</td>
              <td className="border p-2">{pet.breed}</td>
              <td className="border p-2">{pet.age}</td>
              <td className="border p-2">{pet.gender}</td>
              <td className="border p-2">{pet.status}</td>
              <td className="border p-2">{pet.shelter_id}</td>
              <td className="border p-2 space-x-2"></td>
             </tr>
        ))}; 
        </div>
    </div>
  );
}
