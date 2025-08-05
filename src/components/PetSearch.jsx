import React, { useState } from 'react';

const PetSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    Id:'' ,
    name: '',
    category: '',
    minAge: '',
    maxAge: '',
    gender: '',
    available: false,
    location: ''
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Pet Name" onChange={handleChange} />
      <select name="category" onChange={handleChange}>
        <option value="">All Categories</option>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Bird">Bird</option>
      </select>
      <input type="number" name="minAge" placeholder="Min Age" onChange={handleChange} />
      <input type="number" name="maxAge" placeholder="Max Age" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="">Any Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <label>
        <input type="checkbox" name="available" onChange={handleChange} />
        Available only
      </label>
      <input type="text" name="location" placeholder="Shelter Location" onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
};

export default PetSearch;
