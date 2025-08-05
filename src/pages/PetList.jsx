import React, { useState,useEffect } from 'react';
import PetSearch from "../components/PetSearch";
import axios from 'axios';

const PetList = () => {
  const [pets, setPets] = useState([]);
   const fetchPets = async () => {
    const res = await axios.get("http://localhost:5000/api/pets");
    setPets(res.data);
   };
   
     useEffect(() => {
       fetchPets();
     }, []);

  const handleSearch = async (filters) => {
    try {
      const res = await axios.post('http://localhost:5000/api/pets/search', filters);
      setPets(res.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  return (
    <> 
    <PetSearch onSearch={handleSearch} />
    <div className="p-4"> 
      {pets.length === 0 ? (
        <p className="text-gray-500">No pets found</p>):(
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
            <th className="border p-2">Shelter location</th>
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
              <td className="border p-2">{pet.location}</td>
              </tr>
          ))}
        </tbody>
      </table>)};
      </div>
    </>
  );
};

export default PetList;
