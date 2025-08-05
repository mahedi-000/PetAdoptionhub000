import React from "react";
import PetsList from "../components/PetsList";

export default function Pets() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🐶 Pets</h1>
      <PetsList />
    </div>
  );
}

